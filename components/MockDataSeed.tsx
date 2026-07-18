"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ScanStatus, FinalReport } from "@/lib/types";
import { Database, Loader2 } from "lucide-react";

export function MockDataSeed({ scanId }: { scanId: string }) {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm("Inject mock data and complete this scan?")) return;
    
    setIsSeeding(true);
    
    try {
      const mockReport: FinalReport = {
        score: 85,
        summary: "Your digital infrastructure is highly adaptable. By implementing targeted AI enhancements like dynamic lead scoring and localized MCP agents, you could see a 30% reduction in customer acquisition costs while increasing engagement.",
        recommendations: [
          {
            title: "Gemma 4 MCP Agent",
            description: "Local Support Knowledge Base",
            value: "High Impact (Saves 10h/week)",
            category: "agents",
            links: [
              {
                label: "Deploy Template",
                url: "https://github.com/",
                type: "github"
              }
            ]
          },
          {
            title: "LangChain CRM Routing",
            description: "Multi-agent CRM routing",
            value: "Medium Impact",
            category: "workflows",
            links: []
          },
          {
            title: "UI Personalization",
            description: "Automated UI Personalization based on User Session",
            value: "Medium Impact",
            category: "skills",
            links: []
          }
        ]
      };

      const scanRef = doc(db, "scans", scanId);
      await updateDoc(scanRef, {
        status: "completed" as ScanStatus,
        finalReport: mockReport,
        updatedAt: new Date(),
      });
      
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Failed to seed data");
    } finally {
      setIsSeeding(false);
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null; // Only show in dev mode
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleSeed}
        disabled={isSeeding}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded-full font-mono text-xs backdrop-blur-md transition-all shadow-lg"
      >
        {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
        Seed Mock Report
      </button>
    </div>
  );
}
