export type AlertLevel = "NOMINAL" | "ELEVATED" | "CRITICAL";

export interface SectorActivity {
  name: string;
  intensity: number; // 0 - 1, drives heat color
  sightings: number;
}

export interface HunterDeployment {
  id: string;
  hunter: string;
  location: string;
  status: "STANDBY" | "EN ROUTE" | "ENGAGED" | "RETURNING";
  eta: string;
}

export interface InterceptLine {
  id: string;
  timestamp: string;
  text: string;
  flagged?: boolean;
}

export const SECTOR_ACTIVITY: SectorActivity[] = [
  { name: "OUTER RIM", intensity: 0.85, sightings: 6 },
  { name: "CORE WORLDS", intensity: 0.2, sightings: 1 },
  { name: "MID RIM", intensity: 0.5, sightings: 3 },
  { name: "COLONIES", intensity: 0.15, sightings: 1 },
  { name: "UNKNOWN REGIONS", intensity: 0.95, sightings: 5 },
  { name: "WILD SPACE", intensity: 0.1, sightings: 1 },
];

export const ACTIVE_DEPLOYMENTS: HunterDeployment[] = [
  { id: "d1", hunter: "Hunter Vex", location: "Tatooine, Outer Rim", status: "EN ROUTE", eta: "2H 14M" },
  { id: "d2", hunter: "Hunter Ashvale", location: "Bespin, Mid Rim", status: "ENGAGED", eta: "CONTACT" },
  { id: "d3", hunter: "Hunter Grey Veil", location: "Corellia, Core Worlds", status: "STANDBY", eta: "—" },
  { id: "d4", hunter: "Hunter Cinder", location: "Signal lost, Unknown Regions", status: "RETURNING", eta: "9D AGO" },
];

export const INTERCEPT_SEED: InterceptLine[] = [
  { id: "i1", timestamp: "03:114:18", text: "decrypting rebel channel 7..." },
  { id: "i2", timestamp: "03:114:19", text: "contact flagged — Bespin relay", flagged: true },
  { id: "i3", timestamp: "03:114:21", text: "recruitment cell suspected, Muunilinst", flagged: true },
  { id: "i4", timestamp: "03:114:22", text: "hunter Vex reports position confirmed" },
];

export const INTERCEPT_POOL: string[] = [
  "signal burst detected, origin masked",
  "HCET Syndicate chatter, low confidence",
  "supply drop coordinates intercepted",
  "new recruit designation logged",
  "encrypted holonet packet flagged",
  "sympathizer network node identified",
  "hunter Grey requests sector clearance",
  "jamming detected on frequency 4",
];
