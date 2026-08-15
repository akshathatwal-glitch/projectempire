"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import type { AlertLevel } from "./console-data";

const ALERT_STYLES: Record<AlertLevel, { bg: string; glow: string }> = {
  NOMINAL: { bg: "#2a2a2a", glow: "none" },
  ELEVATED: { bg: "#d80f0f", glow: "0 0 18px -4px rgba(216,15,15,0.8)" },
  CRITICAL: { bg: "#ff3b30", glow: "0 0 24px -2px rgba(255,59,48,0.9)" },
};

function useGalacticClock() {
  const [time, setTime] = useState("03:114:00");

  useEffect(() => {
    let cycle = 0;
    const tick = () => {
      cycle += 1;
      const h = String(3).padStart(2, "0");
      const d = String(114).padStart(3, "0");
      const s = String(cycle % 60).padStart(2, "0");
      setTime(`${h}:${d}:${s}`);
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function CommandBar({ alertLevel = "ELEVATED" as AlertLevel }: { alertLevel?: AlertLevel }) {
  const time = useGalacticClock();
  const style = ALERT_STYLES[alertLevel];

  return (
    <div className="flex flex-col gap-4 border-b border-white/15 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <ShieldAlert size={22} strokeWidth={1.4} className="text-[#d80f0f]" />
        <h1 className="font-imperial text-[26px] tracking-wide sm:text-[32px]">
          COMMAND CONSOLE
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.15em] text-white/50">
          GST {time}
        </span>
        <span
          className="rounded-sm px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.1em] text-white"
          style={{ backgroundColor: style.bg, boxShadow: style.glow }}
        >
          ALERT: {alertLevel}
        </span>
      </div>
    </div>
  );
}
