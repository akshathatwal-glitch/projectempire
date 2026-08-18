/**
 * lib/db.ts — In-memory singleton database for Project Empire.
 *
 * Uses module-level variables so they survive across API route calls
 * within the same Node.js process. Pre-seeded with demo data that
 * mirrors the hardcoded constants from the original components.
 *
 * All mutations (POST, PATCH) update these arrays directly.
 * Data resets on server restart — perfect for a hackathon demo.
 */

import type {
  Bounty,
  Broadcast,
  Dossier,
  Hunter,
  InterceptLine,
  Sector,
  Sighting,
} from "./types";

// ─────────────────────────────────────────────────────────────
// BOUNTIES
// ─────────────────────────────────────────────────────────────
const bounties: Bounty[] = [
  {
    id: "bt1",
    target: "Unidentified Jedi",
    alias: '"The Wanderer"',
    sector: "OUTER RIM",
    threat: 5,
    payout: 240000,
    lastSeen: "Tatooine, 3 days ago",
    status: "ACTIVE",
    postedAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
  },
  {
    id: "bt2",
    target: "Former Padawan",
    alias: '"Ashvale"',
    sector: "MID RIM",
    threat: 3,
    payout: 85000,
    lastSeen: "Bespin, 6 hours ago",
    status: "ACTIVE",
    postedAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
  },
  {
    id: "bt3",
    target: "Rogue Consular",
    alias: '"Grey Veil"',
    sector: "CORE WORLDS",
    threat: 4,
    payout: 160000,
    lastSeen: "Corellia, 1 day ago",
    status: "ACTIVE",
    postedAt: new Date(Date.now() - 86400_000).toISOString(),
  },
  {
    id: "bt4",
    target: "Suspected Sympathizer",
    alias: '"Quiet Hand"',
    sector: "COLONIES",
    threat: 2,
    payout: 42000,
    lastSeen: "Muunilinst, 2 days ago",
    status: "ACTIVE",
    postedAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
  {
    id: "bt5",
    target: "Exiled Knight",
    alias: '"Cinder"',
    sector: "UNKNOWN REGIONS",
    threat: 5,
    payout: 310000,
    lastSeen: "Signal lost, 9 days ago",
    status: "ACTIVE",
    postedAt: new Date(Date.now() - 9 * 86400_000).toISOString(),
  },
  {
    id: "bt6",
    target: "Smuggler Contact",
    alias: '"Half-Light"',
    sector: "WILD SPACE",
    threat: 1,
    payout: 18000,
    lastSeen: "Nal Hutta, 4 hours ago",
    status: "CLAIMED",
    postedAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
  },
  {
    id: "bt7",
    target: "Force-Sensitive Youngling",
    alias: '"Starfall"',
    sector: "OUTER RIM",
    threat: 2,
    payout: 55000,
    lastSeen: "Lothal, 5 days ago",
    status: "ACTIVE",
    postedAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
  },
  {
    id: "bt8",
    target: "Jedi Healer",
    alias: '"Pale Root"',
    sector: "MID RIM",
    threat: 3,
    payout: 120000,
    lastSeen: "Takodana, 12 hours ago",
    status: "ACTIVE",
    postedAt: new Date(Date.now() - 12 * 3600_000).toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────
// BROADCASTS
// ─────────────────────────────────────────────────────────────
const broadcasts: Broadcast[] = [
  {
    id: "tx-881",
    message:
      "ORDER 66 ENFORCEMENT DIRECTIVE: All sectors report status on target suppression.",
    sectors: ["OUTER RIM", "MID RIM"],
    priority: "OMEGA",
    status: "SENT",
    timestamp: "04:12 GCT",
    createdAt: new Date(Date.now() - 60 * 60_000).toISOString(),
  },
  {
    id: "tx-874",
    message:
      "SYNDICATE RECRUITMENT WARNING: Intercepted transmissions indicate cell movement in Coruscant lower levels.",
    sectors: ["CORE WORLDS"],
    priority: "URGENT",
    status: "SENT",
    timestamp: "02:44 GCT",
    createdAt: new Date(Date.now() - 90 * 60_000).toISOString(),
  },
  {
    id: "tx-860",
    message:
      "ROUTINE PATROL COMMUNIQUE: Standard orbital scans completed for Expansion Region.",
    sectors: ["EXPANSION REGION"],
    priority: "STANDARD",
    status: "SENT",
    timestamp: "22:15 GCT",
    createdAt: new Date(Date.now() - 360 * 60_000).toISOString(),
  },
  {
    id: "tx-851",
    message:
      "CURFEW ENFORCEMENT: Sector-wide lockdown active from local dusk to dawn. Non-compliance is insurgent activity.",
    sectors: ["OUTER RIM", "WILD SPACE"],
    priority: "URGENT",
    status: "SENT",
    timestamp: "19:33 GCT",
    createdAt: new Date(Date.now() - 600 * 60_000).toISOString(),
  },
  {
    id: "tx-840",
    message:
      "BOUNTY ESCALATION: Rewards on confirmed Jedi targets increased by Imperial decree. Consult the Bounty Board.",
    sectors: ["CORE WORLDS", "MID RIM", "OUTER RIM", "COLONIES"],
    priority: "OMEGA",
    status: "SENT",
    timestamp: "15:07 GCT",
    createdAt: new Date(Date.now() - 720 * 60_000).toISOString(),
  },
  {
    id: "tx-822",
    message:
      "FORCE SIGNATURE ALERT: Unconfirmed lightsaber trace detected near Kessel hyperspace approach. All patrols divert immediately.",
    sectors: ["OUTER RIM"],
    priority: "OMEGA",
    status: "SENT",
    timestamp: "11:58 GCT",
    createdAt: new Date(Date.now() - 900 * 60_000).toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────
// DOSSIERS
// ─────────────────────────────────────────────────────────────
const dossiers: Dossier[] = [
  {
    id: "ISB-0114",
    codename: "ASHVANE",
    realName: "K███ Tel-Morran",
    species: "Human",
    affiliation: "HCET Syndicate — Cell Leader",
    sector: "Outer Rim / Raxus Debris Field",
    lastSeen: "14:07:114 ABY-cycle",
    status: "ACTIVE",
    threat: 5,
    bounty: "640,000 credits",
    brief:
      "Believed to coordinate Syndicate recruitment across three sectors using scavenger freighters as cover. Confirmed lightsaber combat, form unknown.",
    history:
      "Surfaced eleven cycles ago after a salvage-yard raid on Raxus went dark. Signal fragments intercepted from a modified YT-hull matching Syndicate courier profiles. Two ISB tracking teams lost contact within the debris field; presumed sensor-jammed rather than engaged.",
    associates: ["WIDOW-9", 'Unidentified Twi\'lek broker, callsign "Salt"'],
  },
  {
    id: "ISB-0119",
    codename: "WIDOW-9",
    realName: "Unconfirmed",
    species: "Zabrak",
    affiliation: "HCET Syndicate — Courier Network",
    sector: "Mid Rim / Bonadan shipping lanes",
    lastSeen: "02:44:113 ABY-cycle",
    status: "ACTIVE",
    threat: 3,
    bounty: "210,000 credits",
    brief:
      "Runs falsified transit manifests moving recruits off-world. No confirmed combat engagement. Priority: capture for interrogation, not termination.",
    history:
      "Flagged after a pattern of manifest discrepancies at Bonadan customs repeated across nine cycles. Facial match against archive holos remains inconclusive — subject may be using cosmetic alteration or a body double network.",
    associates: ["ASHVANE"],
  },
  {
    id: "ISB-0102",
    codename: "GREYFEATHER",
    realName: "Sella Ord Anmar",
    species: "Human",
    affiliation: "Unaligned Exile",
    sector: "Mid Rim / Naboo system",
    lastSeen: "08:21:110 ABY-cycle",
    status: "UNCONFIRMED",
    threat: 2,
    bounty: "90,000 credits",
    brief:
      "Former Jedi Padawan who went into hiding after Order 66. Reported use of Force abilities in agricultural sector on Naboo. Low aggression profile.",
    history:
      "Padawan records confirm she was offworld at the time of the Purge. Surfaced in a rural Naboo village under the alias 'Sella Marsh'. Informant tip received from a local merchant. Two subsequent sweeps of the area found nothing.",
    associates: [],
  },
  {
    id: "ISB-0133",
    codename: "IRONVEIL",
    realName: "Classified",
    species: "Mirialan",
    affiliation: "HCET Syndicate — Combat Arm",
    sector: "Outer Rim / Mandalore space",
    lastSeen: "22:09:115 ABY-cycle",
    status: "ACTIVE",
    threat: 5,
    bounty: "880,000 credits",
    brief:
      "Suspected to be the primary combat enforcer for the HCET Syndicate. Multiple Inquisitor-grade threat assessments on file. Approach with extreme caution.",
    history:
      "First confirmed sighting during a garrison raid on a Mid Rim garrison post. Surveillance footage shows Form VII Juyo combat style. Believed to be training new Syndicate recruits in covert combat techniques. Three ISB agents killed in last engagement.",
    associates: ["ASHVANE", "Unknown Mandalorian contact"],
  },
  {
    id: "ISB-0088",
    codename: "PALE ROOT",
    realName: "Unknown",
    species: "Togruta",
    affiliation: "HCET Syndicate — Medic & Intel",
    sector: "Mid Rim / Takodana",
    lastSeen: "06:44:114 ABY-cycle",
    status: "ACTIVE",
    threat: 3,
    bounty: "175,000 credits",
    brief:
      "Provides medical support and intelligence routing for the Syndicate. Believed to operate out of Takodana's forested lowlands. Not a front-line combatant.",
    history:
      "Intercepted Syndicate comms reference a 'Root Network' coordinating medical supply drops across three sectors. Pattern analysis suggests this individual maintains a covert safe-house network. Has evaded capture twice by abandoning established positions before arrival of Imperial forces.",
    associates: ["WIDOW-9"],
  },
  {
    id: "ISB-0071",
    codename: "KAEL-7",
    realName: "Kael Drayven",
    species: "Human",
    affiliation: "HCET Syndicate — Founding Member",
    sector: "Outer Rim / Ryloth",
    lastSeen: "05:12:115 ABY-cycle",
    status: "ACTIVE",
    threat: 5,
    bounty: "1,200,000 credits",
    brief:
      "One of the founding members of the HCET Syndicate. Believed to be coordinating large-scale Jedi recruitment operations across the Outer Rim. Highest priority target.",
    history:
      "Survived Order 66 on Ryloth, where he rallied surviving Jedi into the nascent HCET Syndicate. Reputation for strategic brilliance and adaptability. Has outwitted Imperial pursuit forces on at least six documented occasions. A live capture would be of significant intelligence value.",
    associates: ["ASHVANE", "IRONVEIL", "WIDOW-9"],
  },
  {
    id: "ISB-0095",
    codename: "OREN-9",
    realName: "Oren Mav",
    species: "Nautolan",
    affiliation: "HCET Syndicate — Courier",
    sector: "Mid Rim / Bespin",
    lastSeen: "04:03:115 ABY-cycle",
    status: "ACTIVE",
    threat: 3,
    bounty: "195,000 credits",
    brief:
      "Runs a secondary courier network for the Syndicate, specializing in bypassing Imperial blockades near gas giant systems. Suspected Force-user.",
    history:
      "Identified through a pattern of hyperspace jump anomalies that correspond with known Syndicate supply runs. Twice intercepted near Bespin, twice escaped via an unregistered submersible vessel. Imperial Navy has issued a standing intercept order.",
    associates: ["PALE ROOT"],
  },
  {
    id: "ISB-0044",
    codename: "MARA-1",
    realName: "Classified — ISB-SIGMA clearance required",
    species: "Human",
    affiliation: "Unknown — possible Syndicate leadership",
    sector: "Core Worlds / Coruscant underworld",
    lastSeen: "23:41:114 ABY-cycle",
    status: "CAPTURED",
    threat: 4,
    bounty: "COLLECTED",
    brief:
      "High-value intelligence asset captured during a Core Worlds sweep. Currently in transit to ISB detention facility. Real identity classified above standard Omega clearance.",
    history:
      "Apprehended following a tip from a turned Syndicate informant. The identity of this individual is restricted to ISB-SIGMA clearance personnel. Their capture represents the most significant intelligence breakthrough in the hunt against the HCET Syndicate to date.",
    associates: ["Classified"],
  },
];

// ─────────────────────────────────────────────────────────────
// SIGHTINGS (Holonet radar)
// ─────────────────────────────────────────────────────────────
const sightings: Sighting[] = [
  {
    id: "sg1",
    sector: "OUTER RIM",
    designation: "SIGNAL — DESIGNATION KAEL-7",
    threat: "OMEGA",
    status: "ACTIVE PURSUIT",
    angle: 40,
    note: "Lightsaber ignition trace confirmed near mining outpost.",
    timestamp: "05:12 GCT",
  },
  {
    id: "sg2",
    sector: "MID RIM",
    designation: "SIGNAL — DESIGNATION OREN-9",
    threat: "URGENT",
    status: "ACTIVE PURSUIT",
    angle: 110,
    note: "Informant reports safehouse activity in the lower district.",
    timestamp: "04:03 GCT",
  },
  {
    id: "sg3",
    sector: "CORE WORLDS",
    designation: "SIGNAL — DESIGNATION MARA-1",
    threat: "OMEGA",
    status: "CONFIRMED CAPTURE",
    angle: 250,
    note: "Target apprehended, in transit to detention block.",
    timestamp: "23:41 GCT",
  },
  {
    id: "sg4",
    sector: "WILD SPACE",
    designation: "SIGNAL — DESIGNATION VESH-2",
    threat: "URGENT",
    status: "COLD TRAIL",
    angle: 195,
    note: "Trail lost beyond hyperspace beacon range.",
    timestamp: "21:58 GCT",
  },
  {
    id: "sg5",
    sector: "UNKNOWN REGIONS",
    designation: "SIGNAL — DESIGNATION THAL-3",
    threat: "URGENT",
    status: "COLD TRAIL",
    angle: 160,
    note: "Deep-space relay picked up an encrypted burst transmission.",
    timestamp: "18:26 GCT",
  },
  {
    id: "sg6",
    sector: "EXPANSION REGION",
    designation: "SIGNAL — DESIGNATION FYNN-6",
    threat: "STANDARD",
    status: "ACTIVE PURSUIT",
    angle: 70,
    note: "Routine patrol flagged an irregular Force resonance.",
    timestamp: "14:09 GCT",
  },
  {
    id: "sg7",
    sector: "COLONIES",
    designation: "SIGNAL — DESIGNATION DEXX-4",
    threat: "STANDARD",
    status: "COLD TRAIL",
    angle: 320,
    note: "Unconfirmed sighting, low signal confidence.",
    timestamp: "09:32 GCT",
  },
];

// ─────────────────────────────────────────────────────────────
// HUNTERS (Active Deployments)
// ─────────────────────────────────────────────────────────────
const hunters: Hunter[] = [
  {
    id: "d1",
    hunter: "Hunter Vex",
    location: "Tatooine, Outer Rim",
    status: "EN ROUTE",
    eta: "2H 14M",
  },
  {
    id: "d2",
    hunter: "Hunter Ashvale",
    location: "Bespin, Mid Rim",
    status: "ENGAGED",
    eta: "CONTACT",
  },
  {
    id: "d3",
    hunter: "Hunter Grey Veil",
    location: "Corellia, Core Worlds",
    status: "STANDBY",
    eta: "—",
  },
  {
    id: "d4",
    hunter: "Hunter Cinder",
    location: "Signal lost, Unknown Regions",
    status: "RETURNING",
    eta: "9D AGO",
  },
  {
    id: "d5",
    hunter: "Inquisitor Krath",
    location: "Mandalore Sector",
    status: "ENGAGED",
    eta: "ONGOING",
  },
  {
    id: "d6",
    hunter: "Hunter Sable",
    location: "Takodana, Mid Rim",
    status: "EN ROUTE",
    eta: "4H 30M",
  },
];

// ─────────────────────────────────────────────────────────────
// SECTORS (Activity Heatmap)
// ─────────────────────────────────────────────────────────────
const sectors: Sector[] = [
  { name: "OUTER RIM", intensity: 0.85, sightings: 6 },
  { name: "CORE WORLDS", intensity: 0.2, sightings: 1 },
  { name: "MID RIM", intensity: 0.5, sightings: 3 },
  { name: "COLONIES", intensity: 0.15, sightings: 1 },
  { name: "UNKNOWN REGIONS", intensity: 0.95, sightings: 5 },
  { name: "WILD SPACE", intensity: 0.1, sightings: 1 },
  { name: "EXPANSION REGION", intensity: 0.35, sightings: 2 },
];

// ─────────────────────────────────────────────────────────────
// INTERCEPT FEED
// ─────────────────────────────────────────────────────────────

let _interceptCounter = 100;

const intercepts: InterceptLine[] = [
  {
    id: "i1",
    timestamp: "03:114:18",
    text: "decrypting rebel channel 7...",
    flagged: false,
  },
  {
    id: "i2",
    timestamp: "03:114:19",
    text: "contact flagged — Bespin relay",
    flagged: true,
  },
  {
    id: "i3",
    timestamp: "03:114:21",
    text: "recruitment cell suspected, Muunilinst",
    flagged: true,
  },
  {
    id: "i4",
    timestamp: "03:114:22",
    text: "hunter Vex reports position confirmed",
    flagged: false,
  },
  {
    id: "i5",
    timestamp: "03:114:24",
    text: "HCET Syndicate chatter, low confidence",
    flagged: true,
  },
  {
    id: "i6",
    timestamp: "03:114:26",
    text: "supply drop coordinates intercepted",
    flagged: true,
  },
  {
    id: "i7",
    timestamp: "03:114:29",
    text: "signal burst detected, origin masked",
    flagged: false,
  },
  {
    id: "i8",
    timestamp: "03:114:31",
    text: "encrypted holonet packet flagged",
    flagged: true,
  },
];

const INTERCEPT_POOL: string[] = [
  "signal burst detected, origin masked",
  "HCET Syndicate chatter, low confidence",
  "supply drop coordinates intercepted",
  "new recruit designation logged",
  "encrypted holonet packet flagged",
  "sympathizer network node identified",
  "hunter Grey requests sector clearance",
  "jamming detected on frequency 4",
  "Force signature anomaly — sector 7",
  "unknown vessel on Kessel approach",
  "covert broadcast relay detected",
  "Syndicate safe-house location updated",
  "lightsaber energy signature traced",
  "rogue hyperspace exit — no beacon",
];

// ─────────────────────────────────────────────────────────────
// DB SINGLETON — exported object with all arrays + helpers
// ─────────────────────────────────────────────────────────────

function randomTimestamp(): string {
  const s = Math.floor(Math.random() * 60);
  return `03:114:${String(s).padStart(2, "0")}`;
}

export const db = {
  // ── bounties ──────────────────────────────────────────────
  getBounties(): Bounty[] {
    return bounties;
  },
  getBountyById(id: string): Bounty | undefined {
    return bounties.find((b) => b.id === id);
  },
  addBounty(bounty: Bounty): void {
    bounties.unshift(bounty);
  },
  updateBounty(id: string, patch: Partial<Bounty>): Bounty | null {
    const idx = bounties.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    bounties[idx] = { ...bounties[idx], ...patch };
    return bounties[idx];
  },

  // ── broadcasts ────────────────────────────────────────────
  getBroadcasts(): Broadcast[] {
    return broadcasts;
  },
  addBroadcast(broadcast: Broadcast): void {
    broadcasts.unshift(broadcast);
  },

  // ── dossiers ──────────────────────────────────────────────
  getDossiers(): Dossier[] {
    return dossiers;
  },
  getDossierById(id: string): Dossier | undefined {
    return dossiers.find((d) => d.id === id);
  },

  // ── sightings ─────────────────────────────────────────────
  getSightings(): Sighting[] {
    return sightings;
  },
  addSighting(sighting: Sighting): void {
    sightings.push(sighting);
  },

  // ── hunters ───────────────────────────────────────────────
  getHunters(): Hunter[] {
    return hunters;
  },

  // ── sectors ───────────────────────────────────────────────
  getSectors(): Sector[] {
    return sectors;
  },

  // ── intercepts ────────────────────────────────────────────
  getIntercepts(): InterceptLine[] {
    return intercepts.slice(-20);
  },
  generateIntercept(): InterceptLine {
    const text = INTERCEPT_POOL[Math.floor(Math.random() * INTERCEPT_POOL.length)];
    const flagged = Math.random() > 0.5;
    _interceptCounter++;
    const entry: InterceptLine = {
      id: `i-${_interceptCounter}`,
      timestamp: randomTimestamp(),
      text,
      flagged,
    };
    intercepts.push(entry);
    // Keep capped at 50
    if (intercepts.length > 50) intercepts.shift();
    return entry;
  },
};
