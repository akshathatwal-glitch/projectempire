"use client";

import { useEffect, useState } from "react";

const SYSTEM_LOGS = [
  "SECTOR 04 // SCAN IN PROGRESS",
  "DATASTREAM ENCRYPTED — AES-512",
  "HOLONET RELAY B-9 SYNCED",
  "CLEARANCE LEVEL OMEGA VERIFIED",
  "TARGET LOCK: OREN-9",
];

export default function TacticalOverlay() {
  const [logIndex, setLogIndex] = useState(0);
  const [ping, setPing] = useState(14);
  const [freq, setFreq] = useState(142.8);
  const [waveBars, setWaveBars] = useState<number[]>([
    35, 45, 60, 40, 55, 70, 50, 65, 30, 45, 55, 40, 60, 50,
  ]);

  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % SYSTEM_LOGS.length);
      setPing(11 + Math.floor(Math.random() * 8));
      setFreq(+(142 + Math.random() * 0.9).toFixed(1));
      setWaveBars(Array.from({ length: 14 }, () => Math.floor(Math.random() * 60 + 25)));
    }, 2800);
    return () => clearInterval(telemetryInterval);
  }, []);

  return (
    // Sits BELOW the top nav/subheader row — shift down/right if your
    // "CLEARANCE / OMEGA" badge is a separate element also living near
    // top-20 right-6, they'll still collide. Remove that badge or move
    // this block to wherever it actually has clear space.
    <div className="absolute top-36 md:top-40 right-6 md:right-10 z-20 hidden md:flex flex-col items-end gap-2.5 pointer-events-none select-none [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
      {/* Status line */}
      <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-white/85">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
        </span>
        <span>ISB TELEMETRY</span>
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-wider text-white/60">
        <span>
          UPLINK <span className="text-white/90">{ping}ms</span>
        </span>
        <span className="text-red-400/60">/</span>
        <span>
          FREQ <span className="text-white/90">{freq}</span>
        </span>
        <span className="text-red-400/60">/</span>
        <span>
          SIG <span className="text-white/90">99%</span>
        </span>
      </div>

      {/* Waveform — solid, red-tinted so it reads against the red field */}
      <div className="flex items-end gap-[3px] h-3.5">
        {waveBars.map((h, i) => (
          <span
            key={i}
            className="w-[2px] bg-red-200/80 rounded-full transition-all duration-500 ease-out"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Log ticker */}
      <div className="text-[9px] font-medium tracking-[0.14em] text-white/50 max-w-[220px] text-right">
        {SYSTEM_LOGS[logIndex]}
      </div>
    </div>
  );
}