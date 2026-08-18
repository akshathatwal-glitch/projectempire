"use client";

import { useState } from "react";
import { SECTOR_ACTIVITY, type SectorActivity } from "./console-data";

export function SectorMap({ onSelect }: { onSelect?: (sector: SectorActivity) => void }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="rounded-sm border border-white/10 bg-[#0f0f0f] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.1em] text-white/45">
          SECTOR ACTIVITY — GALAXY-WIDE
        </span>
        <span className="font-mono text-[10px] tracking-[0.1em] text-white/30">
          {SECTOR_ACTIVITY.reduce((sum, s) => sum + s.sightings, 0)} TOTAL SIGHTINGS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SECTOR_ACTIVITY.map((sector) => {
          const isHot = sector.intensity > 0.7;
          return (
            <button
              key={sector.name}
              type="button"
              onClick={() => {
                setActive(sector.name);
                onSelect?.(sector);
              }}
              className={`relative overflow-hidden rounded-sm p-3 text-left transition-transform duration-200 hover:-translate-y-0.5 ${
                active === sector.name ? "ring-1 ring-white/60" : ""
              }`}
              style={{ backgroundColor: `rgba(216,15,15,${0.08 + sector.intensity * 0.85})` }}
            >
              {isHot && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 animate-pulse rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.8)]" />
              )}
              <div className="font-mono text-[10px] tracking-[0.08em] text-white">
                {sector.name}
              </div>
              <div className="mt-1 font-mono text-[10px] text-white/70">
                {sector.sightings} sighting{sector.sightings !== 1 ? "s" : ""}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
