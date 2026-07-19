"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Clock, Globe, Cpu, Sparkles } from "lucide-react";
import { ScanStatus } from "@/lib/types";

const steps = [
  { id: "pending", label: "In Queue", icon: Clock, desc: "Waiting for GPU worker" },
  { id: "scraping", label: "Scraping Site", icon: Globe, desc: "Extracting DOM & Lighthouse audit" },
  { id: "processing_chunks", label: "AI Chunk Analysis", icon: Cpu, desc: "Processing content via Gemma 4" },
  { id: "reducing", label: "Generating Report", icon: Sparkles, desc: "Synthesizing AI recommendations" },
  { id: "completed", label: "Completed", icon: Check, desc: "Ready for review" },
];

export function ProgressStepper({ currentStatus }: { currentStatus: ScanStatus }) {
  // Map statuses to indexes
  const statusIndex = steps.findIndex(s => s.id === currentStatus);
  const activeIndex = statusIndex === -1 ? 0 : statusIndex; // fallback to 0 if failed

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-purple-500/10 blur-[100px] pointer-events-none" />

      <h2 className="text-xl md:text-2xl font-bold text-white mb-8 md:mb-10 text-center relative z-10">
        Analyzing your Web Infrastructure
      </h2>

      <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:gap-4">
        {/* Connector Line (Mobile) */}
        <div className="md:hidden absolute top-6 bottom-6 left-6 w-[2px] bg-neutral-800 -translate-x-1/2 -z-10">
          <motion.div
            className="w-full bg-gradient-to-b from-purple-500 to-blue-500"
            initial={{ height: "0%" }}
            animate={{ height: currentStatus === "completed" ? "100%" : `${(activeIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = index < activeIndex || currentStatus === "completed";
          const isActive = index === activeIndex && currentStatus !== "completed";
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex-1 flex flex-row md:flex-col items-center md:text-center relative gap-4 md:gap-0">
              {/* Connector Line (Desktop) */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-neutral-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}

              {/* Icon Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-full flex items-center justify-center mb-0 md:mb-4 z-10 transition-colors duration-500 ${
                  isCompleted
                    ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    : isActive
                    ? "bg-neutral-800 border-2 border-purple-500 text-purple-400"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 md:w-8 md:h-8" />
                ) : isActive ? (
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
                ) : (
                  <Icon className="w-6 h-6 md:w-8 md:h-8" />
                )}
              </motion.div>

              {/* Text */}
              <div className="flex flex-col text-left md:text-center">
                <h3
                  className={`text-sm md:text-base font-semibold mb-0.5 md:mb-1 ${
                    isActive || isCompleted ? "text-white" : "text-neutral-500"
                  }`}
                >
                  {step.label}
                </h3>
                <p className="text-[11px] md:text-xs text-neutral-400 max-w-full md:max-w-[120px] leading-tight">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
