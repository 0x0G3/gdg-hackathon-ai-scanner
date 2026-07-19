"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight, Loader2, Cpu, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url || !url.startsWith("http")) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Failed to start scan");
      }

      const data = await res.json();
      router.push(`/scan/${data.scanId}`);
    } catch (err: unknown) {
      console.error(err);
      setError("An error occurred while starting the scan. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden selection:bg-purple-500/30">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center space-y-6 max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-4 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            <span>Powered by Gemma 4 Local Intelligence</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-200 to-neutral-500 pb-2">
            Audit your website for AI & MCP agent readiness instantly.
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Enter any public URL to run a deep chunked scan and Lighthouse audit. Discover integration gaps, suggested AI tools, and maximize your business value.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-neutral-900 border border-neutral-800 rounded-2xl p-1.5 sm:p-2 shadow-2xl focus-within:border-purple-500/50 transition-colors gap-2 sm:gap-0">
              <div className="hidden sm:block pl-4 text-neutral-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-business.com"
                className="w-full bg-neutral-950 sm:bg-transparent border border-neutral-800 sm:border-none text-white px-4 py-3 sm:py-4 rounded-xl sm:rounded-none focus:outline-none focus:border-purple-500/50 sm:focus:border-none placeholder:text-neutral-600 text-base sm:text-lg text-center sm:text-left"
                disabled={isLoading}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    Scan Website
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-4 text-center"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-center text-neutral-400"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold">Local AI Processing</h3>
            <p className="text-sm">Queued execution on private home GPU clusters for maximum context size.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <Search className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold">Deep Scrape & Audit</h3>
            <p className="text-sm">Comprehensive Lighthouse analysis and multi-page chunking.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold">Actionable Insights</h3>
            <p className="text-sm">Get real, implementable AI integration strategies formatted in JSON.</p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
