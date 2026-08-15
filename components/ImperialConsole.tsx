"use client";

import { useState } from "react";
import { CommandBar } from "./CommandBar";
import { StatGrid } from "./StatGrid";
import { SectorMap } from "./SectorMap";
import { InterceptFeed } from "./InterceptFeed";
import { ActiveHuntsPanel } from "./ActiveHuntsPanel";
import { DirectivePanel } from "./DirectivePanel";
import type { AlertLevel, SectorActivity } from "./console-data";

export default function ImperialConsole() {
  const [alertLevel] = useState<AlertLevel>("ELEVATED");
  const [selectedSector, setSelectedSector] = useState<SectorActivity | null>(null);

  return (
    <section className="w-full bg-[#050505] px-6 py-10 text-white sm:px-10 sm:py-14">
      <style>{`
        .font-imperial {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
        }
      `}</style>

      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <CommandBar alertLevel={alertLevel} />

        <StatGrid />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
          <SectorMap onSelect={setSelectedSector} />
          <InterceptFeed />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
          <ActiveHuntsPanel />
          <DirectivePanel
            onDeployHunter={() => console.log("deploy hunter", selectedSector?.name)}
            onLockdownSector={() => console.log("lockdown", selectedSector?.name)}
            onIssueDirective={() => console.log("directive issued")}
          />
        </div>

        {selectedSector && (
          <div className="rounded-sm border border-[#d80f0f]/40 bg-[#d80f0f]/10 px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] text-white/80">
            SECTOR SELECTED: {selectedSector.name} — {selectedSector.sightings} ACTIVE SIGHTING
            {selectedSector.sightings !== 1 ? "S" : ""}
          </div>
        )}
      </div>
    </section>
  );
}
