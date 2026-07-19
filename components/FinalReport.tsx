"use client";

import { motion } from "framer-motion";
import { FinalReport, Recommendation } from "@/lib/types";
import { 
  TrendingUp, 
  Bot, 
  Cpu, 
  Sparkles, 
  GitFork,
  ExternalLink 
} from "lucide-react";

// Inline Brand Asset SVGs to ensure compiled portability without dependency bloat
function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 group-hover/btn:text-white transition-colors">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.061.069-.061 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconNpm() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className="w-4 h-4 text-neutral-500 group-hover/btn:text-red-400 transition-colors">
      <path d="M0 0h256v256H0z" fill="#231F20" /><path d="M48 48h160v160H48z" fill="#FFF" /><path d="M136 80h40v96h-40zM80 80h40v80h16v-80h24v96H80z" fill="#CB3837" />
    </svg>
  );
}

function ResourceBadge({ link }: { link: { label: string; url: string; type: string } }) {
  const isGithub = link.type === 'github';
  const isSmithery = link.type === 'smithery';
  const isNpm = link.type === 'npm';
  const isGlama = link.type === 'glama';

  return (
    <div className="relative group/badge">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-950 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-150 shadow-md group/btn"
      >
        {isGithub && <IconGithub />}
        {isSmithery && (
          <span className="text-[10px] font-black text-orange-400 group-hover/btn:text-orange-300 transition-colors border border-orange-500/20 rounded px-1 scale-90 bg-orange-500/5">
            S
          </span>
        )}
        {isNpm && <IconNpm />}
        {isGlama && (
          <span className="text-[10px] font-bold text-cyan-400 group-hover/btn:text-cyan-300 transition-colors border border-cyan-500/20 rounded px-1 scale-90 bg-cyan-500/5">
            G
          </span>
        )}
        {!isGithub && !isSmithery && !isNpm && !isGlama && (
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-white transition-colors" />
        )}
      </a>
      
      {/* Floating Micro-Tooltip Layout */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-[10px] font-medium text-neutral-200 rounded-md opacity-0 pointer-events-none group-hover/badge:opacity-100 transition-all duration-150 whitespace-nowrap z-30 shadow-2xl scale-95 group-hover/badge:scale-100">
        {link.label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-top-neutral-950" />
      </div>
    </div>
  );
}

export function FinalReportView({ report }: { report: FinalReport }) {
  const score = report?.score ?? 0;
  const summary = report?.summary ?? "Analysis complete.";
  const recommendations = report?.recommendations ?? [];

  // Distribute across the 4 specialized operational categories
  const agents = recommendations.filter(r => r.category === 'agents');
  const mcp = recommendations.filter(r => r.category === 'mcp');
  const skills = recommendations.filter(r => r.category === 'skills');
  const workflows = recommendations.filter(r => r.category === 'workflows');

  const renderSectionRows = (items: Recommendation[], fallbackMsg: string) => {
    if (items.length === 0) {
      return (
        <div className="text-left py-4 px-4 rounded-xl border border-dashed border-neutral-800/60 bg-neutral-900/5 text-neutral-500 text-xs leading-relaxed">
          {fallbackMsg}
        </div>
      );
    }

    return items.map((item, idx) => (
      <div
        key={idx}
        className="group flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-neutral-900/50 border border-neutral-800/60 hover:border-neutral-700/80 hover:bg-neutral-800/40 rounded-xl transition-all duration-200"
      >
        {/* Core Metadata Info - Unclamped text layouts to accommodate longer analytical variants */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-white tracking-tight break-words">
              {item.title}
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 whitespace-nowrap">
              {item.value}
            </span>
          </div>
          <p className="text-neutral-300 text-xs leading-relaxed break-words">
            {item.description}
          </p>
        </div>

        {item.links && item.links.length > 0 && (
          <div className="flex-shrink-0 flex items-center gap-1.5 pt-2 sm:pt-0 sm:pl-3 border-t sm:border-t-0 sm:border-l border-neutral-800/60 transition-colors">
            {item.links.map((link, lIdx) => (
              <ResourceBadge key={lIdx} link={link} />
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Top Banner Score Block */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-neutral-800/80 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex-shrink-0 relative bg-neutral-950/40 p-2 rounded-xl border border-neutral-800/50">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-neutral-900" />
            <motion.circle 
              cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" 
              strokeDasharray={251.2} 
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="text-emerald-400 stroke-linecap-round" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-black text-white tracking-tight">{score}</span>
            <span className="text-[8px] uppercase text-neutral-400 font-bold tracking-widest mt-0.5">Index</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2.5">
            <TrendingUp className="text-emerald-400 w-5 h-5" /> Operational AI System Audit
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed max-w-5xl">
            {summary}
          </p>
        </div>
      </motion.div>

      {/* Modern 4-Square Matrix Layout (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quadrant 1: Autonomous AI Agents */}
        <div className="space-y-4 bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-5 hover:border-neutral-800 transition-colors duration-200">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-800/80">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/10">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Autonomous AI Agents</h3>
              <p className="text-xs text-neutral-400 mt-0.5">User-facing automation and intelligence layers</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {renderSectionRows(agents, "No workflow interface optimization metrics flagged.")}
          </div>
        </div>

        {/* Quadrant 2: MCP Infrastructure */}
        <div className="space-y-4 bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-5 hover:border-neutral-800 transition-colors duration-200">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-800/80">
            <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/10">
              <Cpu className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">MCP Infrastructure</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Model Context Protocol hosting and interface layers</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {renderSectionRows(mcp, "No backend protocol connections requested.")}
          </div>
        </div>

        {/* Quadrant 3: Semantic Skills */}
        <div className="space-y-4 bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-5 hover:border-neutral-800 transition-colors duration-200">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-800/80">
            <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/10">
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Semantic Skills & Tools</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Knowledge configurations, tools, and execution models</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {renderSectionRows(skills, "No dedicated context skills identified.")}
          </div>
        </div>

        {/* Quadrant 4: Workflow Integrations */}
        <div className="space-y-4 bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-5 hover:border-neutral-800 transition-colors duration-200">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-800/80">
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/10">
              <GitFork className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Workflow Integrations</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Event-driven triggers and sequential flow orchestration</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {renderSectionRows(workflows, "No operational orchestration adjustments flagged.")}
          </div>
        </div>

      </div>

    </div>
  );
}