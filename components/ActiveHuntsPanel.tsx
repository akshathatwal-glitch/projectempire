"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Crosshair, MapPin, Clock, Flame } from "lucide-react";

interface HunterDeployment {
  id: string;
  hunter: string;
  location: string;
  status: "STANDBY" | "EN ROUTE" | "ENGAGED" | "RETURNING";
  eta: string;
}

const STATUS_CONFIG: Record<
  HunterDeployment["status"],
  { color: string; bg: string; border: string; glow: string; dotColor: string }
> = {
  ENGAGED: {
    color: "text-red-400",
    bg: "bg-red-950/60",
    border: "border-red-500/50",
    glow: "shadow-[0_0_12px_rgba(255,59,48,0.5)]",
    dotColor: "bg-red-500",
  },
  "EN ROUTE": {
    color: "text-amber-400",
    bg: "bg-amber-950/60",
    border: "border-amber-500/50",
    glow: "shadow-[0_0_10px_rgba(245,158,11,0.4)]",
    dotColor: "bg-amber-400",
  },
  STANDBY: {
    color: "text-white/60",
    bg: "bg-white/5",
    border: "border-white/10",
    glow: "none",
    dotColor: "bg-white/40",
  },
  RETURNING: {
    color: "text-sky-400",
    bg: "bg-sky-950/60",
    border: "border-sky-500/40",
    glow: "shadow-[0_0_10px_rgba(56,189,248,0.3)]",
    dotColor: "bg-sky-400",
  },
};

export function ActiveHuntsPanel() {
  const [deployments, setDeployments] = useState<HunterDeployment[]>([]);

  useEffect(() => {
    fetch("/api/hunters")
      .then((r) => r.json())
      .then((d) => setDeployments(d.hunters ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden rounded-sm border border-red-600/30 bg-[#0a0a0c] p-5 shadow-[0_0_35px_rgba(216,15,15,0.2)] backdrop-blur-xl">
      {/* HUD Corner Brackets */}
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-red-500" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-red-500" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-red-500" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-red-500" />

      {/* Panel Header */}
      <div className="mb-5 flex items-center justify-between border-b border-red-900/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 shadow-[0_0_8px_#ff3b30]" />
          </span>
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-red-500 uppercase flex items-center gap-1.5">
            <Flame size={14} className="animate-pulse" />
            ACTIVE HUNTS REGISTRY
          </span>
        </div>
        <span className="rounded bg-red-950/80 border border-red-500/40 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-red-400 shadow-[0_0_10px_rgba(255,59,48,0.3)]">
          {deployments.length} DEPLOYED
        </span>
      </div>

      {/* Hunter Cards List */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {deployments.map((d, index) => {
          const config = STATUS_CONFIG[d.status];
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-black/60 p-4 transition-all duration-300 hover:border-red-500/60 hover:bg-red-950/20 hover:shadow-[0_0_25px_rgba(216,15,15,0.4)] cursor-pointer"
            >
              {/* Laser Shimmer Sweep Effect */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

              {/* Card Top Row: ID & Status Pill */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] tracking-[0.2em] text-white/35 font-bold uppercase flex items-center gap-1">
                  <Crosshair size={11} className="text-red-500 group-hover:rotate-90 transition-transform duration-300" />
                  ID: {d.id}
                </span>

                {/* Status Badge */}
                <div
                  className={`flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase ${config.bg} ${config.border} ${config.color} ${config.glow}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor} ${d.status === "ENGAGED" || d.status === "EN ROUTE" ? "animate-ping" : ""}`} />
                  <span>{d.status}</span>
                </div>
              </div>

              {/* BIG HUNTER NAME */}
              <div className="my-1">
                <h3 className="font-imperial text-2xl font-bold tracking-wider text-white uppercase group-hover:text-red-400 group-hover:drop-shadow-[0_0_12px_rgba(255,59,48,0.8)] transition-all">
                  {d.hunter}
                </h3>
              </div>

              {/* Compact Details: Location & ETA */}
              <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-2 font-mono text-[10px] text-white/60">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 truncate text-white/50 group-hover:text-white/80 transition-colors">
                    <MapPin size={11} className="text-red-500 shrink-0" />
                    <span className="truncate">{d.location}</span>
                  </span>

                  <span className="flex items-center gap-1 shrink-0 font-bold text-white/90 group-hover:text-red-300 transition-colors ml-2">
                    <Clock size={11} className="text-amber-400" />
                    <span>{d.eta}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
