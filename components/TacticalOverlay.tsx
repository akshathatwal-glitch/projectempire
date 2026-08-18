"use client";

import { useEffect, useState } from "react";
import { Activity, Radio, ShieldAlert, Signal } from "lucide-react";

const SYSTEM_LOGS = [
  "SECTOR 04 // RADAR SCAN IN PROGRESS...",
  "ISB DATASTREAM: ENCRYPTED (AES-512)",
  "JEDI SIGHTING: CORUSCANT LOWER LEVELS",
  "INQUISITORIAL STRIKE UNIT 07 ACTIVE",
  "HOLONET RELAY B-9: ORDER 66 BROADCAST",
  "CLEARANCE LEVEL OMEGA VERIFIED",
  "TARGET ACQUIRED: OREN-9 (PRIORITY HIGH)",
];

export default function TacticalOverlay() {
  const [logIndex, setLogIndex] = useState(0);
  const [timeStr, setTimeStr] = useState("");
  const [ping, setPing] = useState(14);
  const [freq, setFreq] = useState(142.8);
  const [waveBars, setWaveBars] = useState([40, 75, 25, 90, 50, 80, 30, 65, 45, 85]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toTimeString().split(" ")[0] +
        "." +
        Math.floor(now.getMilliseconds() / 10)
          .toString()
          .padStart(2, "0")
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % SYSTEM_LOGS.length);
      setPing(11 + Math.floor(Math.random() * 8));
      setFreq(+(142 + Math.random() * 0.9).toFixed(1));
      setWaveBars(Array.from({ length: 10 }, () => Math.floor(Math.random() * 75 + 20)));
    }, 2400);
    return () => clearInterval(telemetryInterval);
  }, []);

  return (
    <>
      {/* Top Right High-Tech Futuristic Imperial Live Telemetry Console */}
      <div className="absolute top-20 right-6 md:right-12 z-20 hidden md:flex flex-col gap-2.5 pointer-events-auto">
        <div className="relative group bg-black/85 border border-red-600/40 rounded-sm p-3.5 shadow-[0_0_30px_rgba(216,15,15,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_40px_rgba(255,59,48,0.5)] min-w-[260px]">
          {/* HUD Corner Brackets */}
          {/* <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" /> */}

          {/* Header Row */}
          <div className="flex items-center justify-between gap-4 border-b border-red-900/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 shadow-[0_0_8px_#ff3b30]" />
              </span>
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase">
                ISB LIVE TELEMETRY
              </span>
            </div>

            <div className="flex items-center gap-1 bg-red-950/70 border border-red-500/40 px-1.5 py-0.5 rounded text-[9px] font-mono text-red-400 shadow-[0_0_10px_rgba(255,59,48,0.2)]">
              <ShieldAlert size={10} className="animate-pulse" />
              <span>OMEGA</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2.5 text-[10px] font-mono">
            {/* Clock */}
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase">SYS_TIME</span>
              <span className="font-bold text-white tracking-wider">{timeStr}</span>
            </div>

            {/* Ping */}
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase">UPLINK</span>
              <span className="font-bold text-red-400 flex items-center gap-1">
                <Activity size={10} className="animate-pulse" />
                {ping} ms
              </span>
            </div>

            {/* Frequency */}
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase">FREQ</span>
              <span className="font-bold text-white/90 flex items-center gap-1">
                <Signal size={10} className="text-red-500" />
                {freq} MHz
              </span>
            </div>
          </div>

          {/* Frequency Waveform Visualizer */}
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1 h-3">
              {waveBars.map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-gradient-to-t from-red-800 to-red-500 rounded-full transition-all duration-300"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <span className="font-mono text-[9px] text-white/50 tracking-wider">
              SIG: 99.4% STABLE
            </span>
          </div>
        </div>

        {/* Dynamic Log Stream Bar */}

      </div>
    </>
  );
}
