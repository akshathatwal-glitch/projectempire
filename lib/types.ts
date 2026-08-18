// ─────────────────────────────────────────────────────────────
// SHARED TYPES — used by both the API routes and the frontend
// ─────────────────────────────────────────────────────────────

export type BountyStatus = "ACTIVE" | "CLAIMED";
export type BountyThreat = 1 | 2 | 3 | 4 | 5;

export interface Bounty {
  id: string;
  target: string;
  alias: string;
  sector: string;
  threat: BountyThreat;
  payout: number;
  lastSeen: string;
  status: BountyStatus;
  postedAt: string; // ISO timestamp
}

// ─────────────────────────────────────────────────────────────

export type BroadcastPriority = "STANDARD" | "URGENT" | "OMEGA";
export type BroadcastStatus = "SENT" | "QUEUED";

export interface Broadcast {
  id: string;
  message: string;
  sectors: string[];
  priority: BroadcastPriority;
  status: BroadcastStatus;
  timestamp: string; // display string e.g. "04:12 GCT"
  createdAt: string; // ISO timestamp for sorting
}

// ─────────────────────────────────────────────────────────────

export type DossierStatus = "ACTIVE" | "CAPTURED" | "TERMINATED" | "UNCONFIRMED";
export type DossierThreat = 1 | 2 | 3 | 4 | 5;

export interface Dossier {
  id: string;
  codename: string;
  realName: string;
  species: string;
  affiliation: string;
  sector: string;
  lastSeen: string;
  status: DossierStatus;
  threat: DossierThreat;
  bounty: string;
  brief: string;
  history: string;
  associates: string[];
}

// ─────────────────────────────────────────────────────────────

export type SightingThreat = "STANDARD" | "URGENT" | "OMEGA";
export type SightingStatus = "ACTIVE PURSUIT" | "CONFIRMED CAPTURE" | "COLD TRAIL";

export interface Sighting {
  id: string;
  sector: string;
  designation: string;
  threat: SightingThreat;
  status: SightingStatus;
  angle: number;
  note: string;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────

export type HunterStatus = "STANDBY" | "EN ROUTE" | "ENGAGED" | "RETURNING";

export interface Hunter {
  id: string;
  hunter: string;
  location: string;
  status: HunterStatus;
  eta: string;
}

// ─────────────────────────────────────────────────────────────

export interface Sector {
  name: string;
  intensity: number; // 0-1
  sightings: number;
}

// ─────────────────────────────────────────────────────────────

export interface InterceptLine {
  id: string;
  timestamp: string;
  text: string;
  flagged?: boolean;
}
