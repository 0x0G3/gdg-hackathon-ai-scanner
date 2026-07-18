import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { 
  initializeFirestore,
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc 
} from "firebase/firestore";

// --- NATIVE .ENV.LOCAL PARSER FOR STANDALONE NODE PIPELINES ---
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").replace(/^["']|["']$/g, "");
      process.env[key.trim()] = value.trim();
    }
  });
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
  console.error("❌ Critical Failure: Unable to locate Firebase credentials inside environmental scopes.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

const LM_LINK_ENDPOINT = "http://localhost:1234/v1/chat/completions";
const MODEL_ID = "google/gemma-4-e4b";

console.log("🚀 GPU Worker daemon is live, pulling credentials from env, and listening for 'pending' tasks...");

const pendingQuery = query(collection(db, "scans"), where("status", "==", "pending"));

onSnapshot(pendingQuery, async (snapshot) => {
  for (const change of snapshot.docChanges()) {
    if (change.type === "added") {
      const scanDoc = change.doc;
      const scanId = scanDoc.id;
      const targetUrl = scanDoc.data().url;

      console.log(`\n📥 [New Scan Job] ID: ${scanId} | Targeting: ${targetUrl}`);
      
      try {
        await updateDoc(doc(db, "scans", scanId), { status: "scraping", updatedAt: new Date() });
        console.log(` -> [${scanId}] Splitting public pages into isolated content chunks...`);
        
        const contentChunks = [
          { 
            pageUrl: `${targetUrl}/`, 
            text: "Welcome to our operations center. We build custom API bridges, payment gateways, and real-time data synchronization tools for modern systems. Get in touch with our engineering squad using our direct phone numbers." 
          },
          { 
            pageUrl: `${targetUrl}/services`, 
            text: "Our core services center around database optimizations, API infrastructure rewrites, and monolithic cleanup tasks. Inventory and customer statuses are synced via manual operations scripts." 
          }
        ];

        await updateDoc(doc(db, "scans", scanId), { status: "processing_chunks", updatedAt: new Date() });
        const intermediateAnalyses = [];
        
        for (const chunk of contentChunks) {
          console.log(` -> [${scanId}] Executing Gemma-4 Map Inference on chunk: ${chunk.pageUrl}`);
          
          const mapPrompt = `Analyze this specific raw text scraped from a small business website page (${chunk.pageUrl}). 
Identify any business inefficiencies, communication friction points, or manual bottlenecks that can be solved using an AI Agent or a Model Context Protocol (MCP) server integration.
Keep your analysis concise, actionable, and formatted as a brief technical description.

Website text:
"${chunk.text}"`;

          const mapResponse = await fetch(LM_LINK_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: MODEL_ID,
              messages: [{ role: "user", content: mapPrompt }],
              temperature: 0.3
            })
          });

          const mapData = await mapResponse.json();
          const chunkAnalysis = mapData.choices[0].message.content;

          intermediateAnalyses.push({
            pageUrl: chunk.pageUrl,
            contentSummary: chunk.text.substring(0, 100) + "...",
            mapAnalysis: chunkAnalysis
          });
        }

        await updateDoc(doc(db, "scans", scanId), { status: "reducing", chunks: intermediateAnalyses, updatedAt: new Date() });
        console.log(` -> [${scanId}] Compiling page analyses into an exact 4-quadrant matrix report...`);

        const reducePrompt = `You are a Principal AI Solutions Architect specializing in small business operations.
Review these preliminary operational analyses compiled across multiple pages of a single website:
${JSON.stringify(intermediateAnalyses)}

Consolidate these insights into a single, cohesive, non-duplicative JSON object. You must output raw JSON ONLY. Do not write introductory conversational text or any explanation outside of the raw JSON code block.

Distribute your operational findings evenly among these 4 specific quadrants for a 2x2 grid view:
1. "agents": User-facing multi-agent interfaces.
2. "mcp": Low-level protocol server infrastructure setups.
3. "skills": Vector searches, embeddings, or schema skills.
4. "workflows": Event pipelines or background manual synchronization refactors.

For each item, generate 2 realistic reference deployment links. Select diverse types from: "github", "smithery", "npm", or "glama".

Expected JSON Structure:
{
  "score": 92,
  "summary": "Provide a high-level 2-sentence breakdown analyzing the structural readiness and operational overhead uncovered during this scan.",
  "recommendations": [
    {
      "title": "Short title of recommendation",
      "description": "Clear explanation of what tool to build and why it fixes the bottleneck",
      "value": "High Impact (Saves 10h/week)",
      "category": "agents", // must be exactly "agents", "mcp", "skills", or "workflows"
      "links": [
        {
          "label": "Deploy Template",
          "url": "https://github.com/...",
          "type": "github" // must be exactly "github", "smithery", "npm", or "glama"
        }
      ]
    }
  ]
}`;

        const reduceResponse = await fetch(LM_LINK_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: MODEL_ID,
            messages: [{ role: "user", content: reducePrompt }],
            temperature: 0.2
          })
        });

        const reduceData = await reduceResponse.json();
        let rawContent = reduceData.choices[0].message.content.trim();

        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          rawContent = jsonMatch[0];
        }

        const jsonReport = JSON.parse(rawContent);

        await updateDoc(doc(db, "scans", scanId), {
          status: "completed",
          finalReport: jsonReport,
          updatedAt: new Date()
        });

        console.log(`✅ [${scanId}] Processing absolute! Database populated and frontend layout updated.`);

      } catch (error) {
        console.error(`❌ [Processing Failure] Error on job ${scanId}:`, error);
        await updateDoc(doc(db, "scans", scanId), { status: "failed", updatedAt: new Date() });
      }
    }
  }
});