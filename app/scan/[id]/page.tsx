"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Scan } from "@/lib/types";
import { ProgressStepper } from "@/components/ProgressStepper";
import { FinalReportView } from "@/components/FinalReport";
import { MockDataSeed } from "@/components/MockDataSeed";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ScanDashboard() {
  const params = useParams();
  const scanId = params.id as string;
  
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanId) return;

    // Use Firestore onSnapshot for real-time updates directly to the client
    const unsub = onSnapshot(
      doc(db, "scans", scanId),
      (docSnap) => {
        if (docSnap.exists()) {
          setScan({ id: docSnap.id, ...docSnap.data() } as Scan);
          setError(null);
        } else {
          setError("Scan not found. Please check the URL and try again.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        setError("Failed to connect to the live scan queue.");
        setLoading(false);
      }
    );

    return () => unsub(); // Cleanup subscription on unmount
  }, [scanId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-purple-500 rounded-full animate-spin" />
          <p className="text-neutral-400">Connecting to Queue...</p>
        </div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-neutral-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 overflow-x-hidden selection:bg-purple-500/30">
      <header className="w-full p-6 border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              AI Integration Scan
            </h1>
            <p className="text-sm text-neutral-500 font-mono mt-1">ID: {scanId}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400">Target:</span>
            <a 
              href={scan.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors truncate max-w-[200px] md:max-w-md"
            >
              {scan.url}
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12 min-h-[calc(100vh-100px)] flex flex-col justify-center">
        {scan.status === "failed" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-2xl mx-auto text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Scan Failed</h2>
            <p className="text-neutral-300">
              The worker encountered a critical error while processing the URL. 
              Please verify the website is accessible and try again.
            </p>
          </motion.div>
        ) : scan.status === "completed" && scan.finalReport ? (
          <FinalReportView report={scan.finalReport} />
        ) : (
          <div className="w-full flex justify-center py-20">
            <ProgressStepper currentStatus={scan.status} />
          </div>
        )}
      </main>

      <MockDataSeed scanId={scanId} />
    </div>
  );
}
