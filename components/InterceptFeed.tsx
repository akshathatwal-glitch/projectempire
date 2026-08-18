"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Radio, ShieldAlert, Terminal, Lock, Pause, Play, Trash2, Filter } from "lucide-react";

interface InterceptLine {
  id: string;
  timestamp: string;
  text: string;
  flagged?: boolean;
}

export function InterceptFeed() {
  const [lines, setLines] = useState<InterceptLine[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Fetch intercepts from API (also generates a new line each call) ──
  const fetchIntercepts = useCallback(async () => {
    try {
      const res = await fetch("/api/intel");
      const data = await res.json();
      setLines(data.lines ?? []);
    } catch {
      // keep existing state on error
    }
  }, []);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIntercepts();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchIntercepts]);

  // Poll every ~3s to simulate live stream (matches original interval)
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(fetchIntercepts, 3000);
    return () => clearInterval(id);
  }, [isPaused, fetchIntercepts]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const displayedLines = flaggedOnly ? lines.filter((l) => l.flagged) : lines;

  return (
    <div className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-sm border border-red-600/30 bg-[#0a0a0c] p-4 shadow-[0_0_35px_rgba(216,15,15,0.2)] backdrop-blur-xl font-mono">
      {/* HUD Corner Brackets */}
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-red-500 z-10" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-red-500 z-10" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-red-500 z-10" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-red-500 z-10" />

      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-red-900/40 pb-2.5 z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPaused ? "bg-amber-400" : "bg-red-400"} opacity-80`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? "bg-amber-500" : "bg-red-600 shadow-[0_0_8px_#ff3b30]"}`} />
          </span>
          <span className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase flex items-center gap-1.5">
            <Radio size={13} className="animate-pulse" />
            LIVE INTERCEPTS STREAM
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFlaggedOnly((prev) => !prev)}
            className={`flex items-center gap-1 rounded border px-2 py-0.5 text-[9px] font-bold tracking-wider transition cursor-pointer ${
              flaggedOnly
                ? "border-amber-500/60 bg-amber-950/60 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white"
            }`}
          >
            <Filter size={10} />
            {flaggedOnly ? "FLAGGED ONLY" : "ALL PINGS"}
          </button>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1 rounded border border-white/10 bg-white/5 text-white/50 hover:text-white transition cursor-pointer"
            title={isPaused ? "Resume Feed" : "Pause Feed"}
          >
            {isPaused ? <Play size={11} className="text-emerald-400" /> : <Pause size={11} />}
          </button>

          <button
            type="button"
            onClick={() => setLines([])}
            className="p-1 rounded border border-white/10 bg-white/5 text-white/50 hover:text-red-400 transition cursor-pointer"
            title="Clear Stream"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Terminal Display Screen */}
      <div
        ref={scrollRef}
        className="relative flex-1 space-y-2 overflow-y-auto p-2 border border-white/5 bg-black/70 rounded-sm"
      >
        {/* Subtle Scanline Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_3px)]" />

        <AnimatePresence initial={false}>
          {displayedLines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 24 }}
              className={`group relative flex items-start gap-2.5 rounded-sm p-2 transition-all duration-200 border border-transparent hover:border-white/15 hover:bg-white/[0.04] ${
                line.flagged
                  ? "bg-red-950/20 text-red-300 border-l-2 border-l-red-500 shadow-[0_0_12px_rgba(216,15,15,0.15)]"
                  : "text-white/80 border-l-2 border-l-white/20"
              }`}
            >
              {/* Badge Icon */}
              {line.flagged ? (
                <ShieldAlert size={13} className="text-red-400 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <Terminal size={13} className="text-white/40 shrink-0 mt-0.5 group-hover:text-red-400 transition-colors" />
              )}

              <div className="flex-1 min-w-0 leading-relaxed text-[11px]">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-red-400 text-[10px] tracking-wider">
                    [{line.timestamp}]
                  </span>
                  {line.flagged && (
                    <span className="text-[9px] font-bold tracking-widest text-amber-400 bg-amber-950/70 border border-amber-500/40 px-1.5 py-0.2 rounded uppercase">
                      FLAGGED
                    </span>
                  )}
                </div>

                <p className="truncate text-white/90 group-hover:text-white transition-colors">
                  {line.text}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {displayedLines.length === 0 && (
          <div className="py-10 text-center text-xs text-white/30 tracking-widest uppercase">
            AWAITING INCOMING DECRYPTED TRANSMISSIONS...
          </div>
        )}

        {/* Blinking Terminal Cursor */}
        <div className="flex items-center gap-1.5 pt-1 px-2 text-[11px] text-red-500 font-bold">
          <span>&gt; ISB_DECRYPT_NODE: ACTIVE</span>
          <span className="inline-block h-3.5 w-1.5 animate-pulse bg-red-500 shadow-[0_0_8px_#ff3b30]" />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-2.5 flex items-center justify-between text-[9px] text-white/35 z-10 border-t border-white/5 pt-2">
        <span className="flex items-center gap-1">
          <Lock size={9} className="text-red-500" />
          AES-512 ENCRYPTED RELAY
        </span>
        <span>STREAM RATE: 3.0s</span>
      </div>
    </div>
  );
}
