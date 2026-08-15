"use client";

import { motion } from "motion/react";

interface Stat {
  label: string;
  value: string | number;
  tone?: "default" | "danger";
}

const STATS: Stat[] = [
  { label: "JEDI SIGHTED", value: 17 },
  { label: "HUNTS ACTIVE", value: 6 },
  { label: "SECTORS COMPROMISED", value: 3, tone: "danger" },
  { label: "CELLS DISRUPTED", value: 42 },
];

export function StatGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="rounded-sm border border-white/10 bg-[#0f0f0f] px-4 py-3"
        >
          <div className="font-mono text-[10px] tracking-[0.1em] text-white/45">
            {stat.label}
          </div>
          <div
            className={`font-imperial mt-1 text-[28px] leading-none ${
              stat.tone === "danger" ? "text-[#ff3b30]" : "text-white"
            }`}
          >
            {stat.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
