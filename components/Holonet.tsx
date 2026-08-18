'use client'

import { useState, useMemo, useRef } from "react";
import {
    Radar,
    Crosshair,
    Search,
    Menu,
    ShieldAlert,
    ChevronRight,
} from "lucide-react";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";
import HunterCommendationsDemo from "@/components/hunter-commendations";
import { ImperialSearch } from "@/components/imperial-search";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

// Center-outward, matching the sector names used on the Broadcast Console
const RING_ORDER = [
    { id: "CORE WORLDS", r: 42 },
    { id: "COLONIES", r: 78 },
    { id: "EXPANSION REGION", r: 114 },
    { id: "MID RIM", r: 150 },
    { id: "OUTER RIM", r: 186 },
    { id: "WILD SPACE", r: 222 },
    { id: "UNKNOWN REGIONS", r: 258 },
];

const THREAT_META = [
    { id: "STANDARD", label: "STANDARD", color: "#8a8a8a" },
    { id: "URGENT", label: "URGENT", color: "#ffb020" },
    { id: "OMEGA", label: "OMEGA", color: "#ff3b30" },
];
const THREAT_RANK: Record<string, number> = { STANDARD: 0, URGENT: 1, OMEGA: 2 };
const threatColor = (id: string) => THREAT_META.find((t) => t.id === id)?.color ?? "#8a8a8a";

const STATUS_COLOR: Record<string, string> = {
    "ACTIVE PURSUIT": "#ff3b30",
    "CONFIRMED CAPTURE": "#3ddc84",
    "COLD TRAIL": "#8a8a8a",
};

// Drives the big two-tone headline in the dossier panel, e.g. "KAEL-7 IS ACTIVE"
const STATUS_HEADLINE: Record<string, string> = {
    "ACTIVE PURSUIT": "IS ACTIVE",
    "CONFIRMED CAPTURE": "IS CAPTURED",
    "COLD TRAIL": "HAS GONE DARK",
};

const SIGHTINGS = [
    { id: "sg1", sector: "OUTER RIM", designation: "SIGNAL — DESIGNATION KAEL-7", threat: "OMEGA", status: "ACTIVE PURSUIT", angle: 40, note: "Lightsaber ignition trace confirmed near mining outpost.", timestamp: "05:12 GCT" },
    { id: "sg2", sector: "MID RIM", designation: "SIGNAL — DESIGNATION OREN-9", threat: "URGENT", status: "ACTIVE PURSUIT", angle: 110, note: "Informant reports safehouse activity in the lower district.", timestamp: "04:03 GCT" },
    { id: "sg3", sector: "CORE WORLDS", designation: "SIGNAL — DESIGNATION MARA-1", threat: "OMEGA", status: "CONFIRMED CAPTURE", angle: 250, note: "Target apprehended, in transit to detention block.", timestamp: "23:41 GCT" },
    { id: "sg4", sector: "WILD SPACE", designation: "SIGNAL — DESIGNATION VESH-2", threat: "URGENT", status: "COLD TRAIL", angle: 195, note: "Trail lost beyond hyperspace beacon range.", timestamp: "21:58 GCT" },
    { id: "sg5", sector: "UNKNOWN REGIONS", designation: "SIGNAL — DESIGNATION THAL-3", threat: "URGENT", status: "COLD TRAIL", angle: 160, note: "Deep-space relay picked up an encrypted burst transmission.", timestamp: "18:26 GCT" },
    { id: "sg6", sector: "EXPANSION REGION", designation: "SIGNAL — DESIGNATION FYNN-6", threat: "STANDARD", status: "ACTIVE PURSUIT", angle: 70, note: "Routine patrol flagged an irregular Force resonance.", timestamp: "14:09 GCT" },
    { id: "sg7", sector: "COLONIES", designation: "SIGNAL — DESIGNATION DEXX-4", threat: "STANDARD", status: "COLD TRAIL", angle: 320, note: "Unconfirmed sighting, low signal confidence.", timestamp: "09:32 GCT" },
];

const SCAN_POOL = [
    { sector: "OUTER RIM", designation: "SIGNAL — DESIGNATION BRYN-5", threat: "URGENT", status: "ACTIVE PURSUIT", angle: 15, note: "New Force resonance detected near the asteroid belt." },
    { sector: "MID RIM", designation: "SIGNAL — DESIGNATION ISKA-8", threat: "STANDARD", status: "COLD TRAIL", angle: 135, note: "Faint signal, likely atmospheric interference." },
    { sector: "UNKNOWN REGIONS", designation: "SIGNAL — DESIGNATION NOVAK-0", threat: "OMEGA", status: "ACTIVE PURSUIT", angle: 200, note: "Unregistered vessel emerged from an uncharted hyperspace lane." },
    { sector: "COLONIES", designation: "SIGNAL — DESIGNATION PELL-3", threat: "STANDARD", status: "ACTIVE PURSUIT", angle: 290, note: "Local garrison reports a suspicious cargo manifest." },
];

// Rapid-fire terminal noise shown while a scan is running
const TERMINAL_NOISE = [
    "0x4F2A :: PING SECTOR NODE",
    "TRACE >> NULL RESPONSE",
    "DECRYPTING HEADER... OK",
    "NODE 7734 // NO CONTACT",
    "SUBSPACE ECHO -3.2dB",
    "CROSS-REF BOUNTY #88231",
    "FORCE SIGNATURE: 0.00",
    "RELAY HANDSHAKE OK",
    "HYPERLANE 0x9C.. LOCK",
    "PURGING FALSE ECHO",
    "SECTOR GRID 14 CLEAR",
    "BIOSIGN SCAN 00:00:07",
    "COMPARING DOSSIER HASH",
    "UPLINK JITTER +0.4ms",
    "GARRISON PING ACK",
    "DEEP SCAN >> 62%",
];

const CX = 280;
const CY = 280;
const toXY = (r: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
};
const ringRadius = (sector: string) => RING_ORDER.find((s) => s.id === sector)?.r ?? 0;

// "SIGNAL — DESIGNATION KAEL-7" -> "KAEL-7"
const codenameOf = (designation: string) => designation.split(" ").pop();

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HolonetMap() {
    const [sightings, setSightings] = useState(SIGHTINGS);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(SIGHTINGS[0]?.id ?? null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [scanLines, setScanLines] = useState<string[]>([]);
    const [highlightId, setHighlightId] = useState<string | null>(null);
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const radarRef = useRef<HTMLDivElement | null>(null);

    const sectorStats = useMemo(
        () =>
            RING_ORDER.map((ring) => {
                const items = sightings.filter((s) => s.sector === ring.id);
                const top = items.reduce(
                    (acc, s) => (THREAT_RANK[s.threat] > THREAT_RANK[acc] ? s.threat : acc),
                    "STANDARD"
                );
                return { ...ring, count: items.length, topThreat: items.length ? top : null };
            }),
        [sightings]
    );

    const filtered = selectedSector
        ? sightings.filter((s) => s.sector === selectedSector)
        : sightings;

    const activeInfo = sightings.find((s) => s.id === (hoveredId || selectedId)) || null;

    // What the dossier panel shows: hovered/selected contact, falling back to the
    // first item in the current (possibly sector-filtered) list.
    const panelItem = filtered.find((s) => s.id === (hoveredId || selectedId)) || filtered[0] || null;

    function toggleSector(id: string) {
        setSelectedSector((prev: string | null) => (prev === id ? null : id));
    }

    function selectSighting(id: string) {
        setSelectedId((prev: string | null) => (prev === id ? null : id));
    }

    function trackOnRadar(id: string) {
        setSelectedId(id);
        radarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function handleScan() {
        if (scanning) return;
        setScanning(true);
        setScanLines([]);

        const TOTAL_TICKS = 16;
        const TICK_MS = 45;
        let tick = 0;

        const iv = setInterval(() => {
            tick += 1;
            const line = TERMINAL_NOISE[Math.floor(Math.random() * TERMINAL_NOISE.length)];
            setScanLines((prev) => [...prev.slice(-7), line]);

            if (tick >= TOTAL_TICKS) {
                clearInterval(iv);
                scanIntervalRef.current = null;
                setScanLines((prev) => [...prev.slice(-7), "SIGNAL ISOLATED."]);

                setTimeout(() => {
                    const pick = SCAN_POOL[Math.floor(Math.random() * SCAN_POOL.length)];
                    const id = Math.random().toString(36).slice(2, 8);
                    const entry = {
                        ...pick,
                        id,
                        timestamp:
                            new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
                            " GCT",
                    };
                    setSightings((prev) => [entry, ...prev]);
                    setScanning(false);
                    setScanLines([]);
                    setHighlightId(id);
                    setSelectedId(id);
                    setTimeout(() => setHighlightId(null), 2200);
                }, 260);
            }
        }, TICK_MS);

        scanIntervalRef.current = iv;
    }

    return (
        <section className="w-full bg-[#050505] text-white">
            <style>{`
        .font-imperial {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
        }
        @keyframes hn-pulse {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(3); opacity: 0; }
        }
        .hn-ring { animation: hn-pulse 2.4s ease-out infinite; }

        @keyframes hn-blip-pulse {
          0% { r: 5; opacity: 0.8; }
          100% { r: 16; opacity: 0; }
        }
        .hn-blip-pulse { animation: hn-blip-pulse 1.8s ease-out infinite; transform-box: fill-box; transform-origin: center; }

        @keyframes hn-node-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .hn-node-pulse { animation: hn-node-pulse 1.8s ease-out infinite; }

        @keyframes hn-sweep-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hn-sweep { animation: hn-sweep-rotate 6s linear infinite; transform-box: fill-box; transform-origin: center; }

        @keyframes hn-row-flash {
          0% { background-color: rgba(216,15,15,0.22); box-shadow: inset 0 0 0 1px rgba(216,15,15,0.6); }
          100% { background-color: transparent; box-shadow: inset 0 0 0 1px rgba(216,15,15,0); }
        }
        .hn-row-highlight { animation: hn-row-flash 2.2s ease-out; }

        @keyframes hn-status-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .hn-status-dot { animation: hn-status-glow 1.8s ease-in-out infinite; }

        @keyframes hn-spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hn-spin-fast { animation: hn-spin-fast 0.6s linear infinite; }

        @keyframes hn-scan-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .hn-scan-progress { animation: hn-scan-progress 0.95s linear forwards; }

        @keyframes hn-scanline-move {
          0% { transform: translateY(-40px); }
          100% { transform: translateY(160px); }
        }
        .hn-scanline-move { animation: hn-scanline-move 1s linear infinite; }

        @keyframes hn-cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .hn-cursor-blink { animation: hn-cursor-blink 0.9s step-end infinite; }

        @keyframes hn-panel-in {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .hn-panel-in { animation: hn-panel-in 0.35s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .hn-ring, .hn-blip-pulse, .hn-sweep, .hn-status-dot, .hn-node-pulse,
          .hn-spin-fast, .hn-scan-progress, .hn-scanline-move, .hn-cursor-blink, .hn-panel-in { animation: none; }
        }
      `}</style>


            <div className="relative overflow-hidden px-6 pt-16 pb-14 sm:px-10">



            </div>

            {/* ---------------- Red console panel ---------------- */}
            <div ref={radarRef} className="mx-auto max-w-6xl px-6 pb-10 sm:px-10">
                <div className="relative overflow-hidden rounded-sm border border-white/15 bg-[#b5130e] [background-image:radial-gradient(ellipse_90%_70%_at_25%_0%,rgba(255,255,255,0.14),transparent_60%)]">
                    <div className="flex items-center justify-between border-b border-white/15 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Search size={16} className="text-white/70" />
                            <Menu size={16} className="text-white/70" />
                        </div>
                        <span className="font-imperial text-lg tracking-wide">IMPERIAL HOLONET</span>
                        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-white/85">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-white hn-ring" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                            </span>
                            SCANNING
                        </span>
                    </div>

                    <div className="px-6 py-10 sm:px-10">
                        <div className="mb-6 min-h-[20px] font-mono text-[11px] tracking-[0.1em] text-white/70">
                            Calibrating long-range sensors... Cross-referencing Order 66 target registry...
                        </div>

                        <h2 className="font-imperial text-[36px] leading-[0.95] sm:text-[52px]">
                            NO SHADOW <span className="text-white/60">ESCAPES</span>
                            <br />
                            THE NET
                        </h2>

                        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85">
                            Deep-space contacts are logged in real time below. Select a sector to
                            isolate its signal, or run a scan to sweep for new activity.
                        </p>

                        {/* Radar bezel */}
                        <div className="mt-9 rounded-sm border border-white/20 bg-black/50 p-5 sm:p-8">
                            <div className="mx-auto aspect-square w-full max-w-[440px]">
                                <svg viewBox="0 0 560 560" className="h-full w-full" role="img" aria-label="Sector threat radar">
                                    <defs>
                                        <linearGradient id="hnSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
                                            <stop offset="0%" stopColor="#ff3b30" stopOpacity="0" />
                                            <stop offset="100%" stopColor="#ff3b30" stopOpacity="0.32" />
                                        </linearGradient>
                                    </defs>

                                    {/* rings */}
                                    {RING_ORDER.map((ring, i) => (
                                        <circle
                                            key={ring.id}
                                            cx={CX}
                                            cy={CY}
                                            r={ring.r}
                                            fill="none"
                                            stroke={i === RING_ORDER.length - 1 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}
                                            strokeDasharray={i === RING_ORDER.length - 1 ? "3 6" : undefined}
                                        />
                                    ))}

                                    {/* spokes */}
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                                        const p = toXY(258, deg);
                                        return (
                                            <line key={deg} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" />
                                        );
                                    })}

                                    {/* ring labels */}
                                    {RING_ORDER.map((ring) => {
                                        const p = toXY(ring.r, 315);
                                        return (
                                            <text
                                                key={ring.id}
                                                x={p.x + 4}
                                                y={p.y - 4}
                                                fontFamily="monospace"
                                                fontSize="7.5"
                                                letterSpacing="0.5"
                                                fill="rgba(255,255,255,0.35)"
                                            >
                                                {ring.id}
                                            </text>
                                        );
                                    })}

                                    {/* rotating sweep */}
                                    <g className="hn-sweep">
                                        <path
                                            d={`M ${CX} ${CY} L ${toXY(258, 255).x} ${toXY(258, 255).y} L ${toXY(258, 285).x} ${toXY(258, 285).y} Z`}
                                            fill="url(#hnSweepGrad)"
                                        />
                                        <line
                                            x1={CX}
                                            y1={CY}
                                            x2={toXY(258, 270).x}
                                            y2={toXY(258, 270).y}
                                            stroke="#ff3b30"
                                            strokeWidth="1.2"
                                            opacity="0.7"
                                        />
                                    </g>

                                    {/* center */}
                                    <circle cx={CX} cy={CY} r="3" fill="#ff3b30" />

                                    {/* blips */}
                                    {sightings.map((s) => {
                                        const p = toXY(ringRadius(s.sector), s.angle);
                                        const isSelected = s.id === selectedId;
                                        const color = threatColor(s.threat);
                                        return (
                                            <g key={s.id}>
                                                {s.threat === "OMEGA" && (
                                                    <circle cx={p.x} cy={p.y} r="5" fill="none" stroke={color} strokeWidth="1.5" className="hn-blip-pulse" />
                                                )}
                                                {isSelected && (
                                                    <circle cx={p.x} cy={p.y} r="11" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 3" />
                                                )}
                                                <circle
                                                    cx={p.x}
                                                    cy={p.y}
                                                    r="5"
                                                    fill={color}
                                                    stroke="#050505"
                                                    strokeWidth="1.5"
                                                    className="cursor-pointer"
                                                    onMouseEnter={() => setHoveredId(s.id)}
                                                    onMouseLeave={() => setHoveredId(null)}
                                                    onClick={() => selectSighting(s.id)}
                                                >
                                                    <title>{`${s.designation} — ${s.sector} — ${s.threat}`}</title>
                                                </circle>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>

                            {/* legend */}
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-4">
                                {THREAT_META.map((t) => (
                                    <span key={t.id} className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-white/50">
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                                        {t.label}
                                    </span>
                                ))}
                            </div>

                            {/* detail strip */}
                            <div className="mt-4 min-h-[40px] rounded-sm border border-white/10 bg-black/40 px-4 py-3 font-mono text-[11px] leading-relaxed tracking-[0.05em] text-white/70">
                                {activeInfo ? (
                                    <>
                                        <span style={{ color: threatColor(activeInfo.threat) }}>{activeInfo.threat}</span>
                                        {" · "}
                                        {activeInfo.sector}
                                        {" — "}
                                        {activeInfo.designation}
                                        <div className="mt-1 text-white/45">{activeInfo.note}</div>
                                    </>
                                ) : (
                                    <span className="text-white/35">Hover or select a contact below to inspect signal details.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- Contact log ---------------- */}
            <div className="mx-auto max-w-6xl px-6 pb-12 sm:px-10">
                <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-6">
                    <div>
                        <h3 className="font-imperial text-[40px] leading-none tracking-wide sm:text-[52px]">
                            ACTIVE CONTACTS
                        </h3>
                        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-white/35">
                            {sightings.length} SIGNALS ON FILE · HOLONET RELAY NETWORK
                        </p>
                    </div>
                    <span className="hidden font-mono text-[10px] tracking-[0.2em] text-white/25 sm:block">LIVE</span>
                </div>

                {/* sector filter chips */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setSelectedSector(null)}
                        aria-pressed={selectedSector === null}
                        className={`rounded-sm border px-3 py-2 font-mono text-[11px] tracking-[0.08em] transition-all ${selectedSector === null
                            ? "border-[#d80f0f] bg-[#d80f0f] text-white"
                            : "border-white/12 text-white/50 hover:border-white/30 hover:text-white"
                            }`}
                    >
                        ALL SECTORS
                    </button>
                    {sectorStats.map((ring) => {
                        const active = selectedSector === ring.id;
                        return (
                            <button
                                key={ring.id}
                                type="button"
                                onClick={() => toggleSector(ring.id)}
                                aria-pressed={active}
                                className={`flex items-center gap-2 rounded-sm border px-3 py-2 font-mono text-[11px] tracking-[0.08em] transition-all ${active
                                    ? "border-[#d80f0f] bg-[#d80f0f] text-white"
                                    : "border-white/12 text-white/50 hover:border-white/30 hover:text-white"
                                    }`}
                            >
                                {ring.topThreat && (
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: threatColor(ring.topThreat) }} />
                                )}
                                {ring.id}
                                <span className="text-white/35">{ring.count}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ---- Split view: signal timeline (left) + dossier detail (right) ---- */}
                <div className="grid grid-cols-1 overflow-hidden rounded-sm border border-white/10 lg:grid-cols-[340px_1fr]">
                    {/* LEFT: timeline */}
                    <div className="border-b border-white/10 bg-[#0a0a0a] lg:border-b-0 lg:border-r lg:border-white/10">
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40">SIGNAL TIMELINE</span>
                            <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">{filtered.length} LOGGED</span>
                        </div>

                        <div className="max-h-[520px] overflow-y-auto">
                            {filtered.length === 0 ? (
                                <div className="px-5 py-10 text-center font-mono text-[10px] tracking-[0.1em] text-white/25">
                                    NONE ON FILE
                                </div>
                            ) : (
                                <div className="relative px-5 py-2">
                                    <div className="pointer-events-none absolute left-[26px] top-0 bottom-0 w-px bg-white/10" />
                                    {filtered.map((s) => {
                                        const isActive = s.id === (panelItem?.id ?? null);
                                        const isNew = s.id === highlightId;
                                        const color = threatColor(s.threat);
                                        return (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => selectSighting(s.id)}
                                                onMouseEnter={() => setHoveredId(s.id)}
                                                onMouseLeave={() => setHoveredId(null)}
                                                aria-pressed={isActive}
                                                className={`relative flex w-full items-start gap-3 rounded-sm py-3 pl-1 pr-2 text-left transition-colors ${isNew ? "hn-row-highlight" : ""
                                                    } ${isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"}`}
                                            >
                                                <span
                                                    className="relative z-10 mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 bg-[#0a0a0a]"
                                                    style={{ borderColor: color, backgroundColor: isActive ? color : "#0a0a0a" }}
                                                >
                                                    {(s.threat === "OMEGA" || isActive) && (
                                                        <span
                                                            className="hn-node-pulse absolute inset-0 rounded-full"
                                                            style={{ border: `1.5px solid ${color}` }}
                                                        />
                                                    )}
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span className="flex items-center justify-between gap-2">
                                                        <span className={`font-mono text-[10px] tracking-[0.1em] ${isActive ? "text-white" : "text-white/45"}`}>
                                                            {s.timestamp}
                                                        </span>
                                                        <span
                                                            className="relative flex h-1.5 w-1.5 shrink-0"
                                                        >
                                                            <span
                                                                className="hn-status-dot absolute inline-flex h-full w-full rounded-full"
                                                                style={{ backgroundColor: STATUS_COLOR[s.status] }}
                                                            />
                                                            <span
                                                                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                                                                style={{ backgroundColor: STATUS_COLOR[s.status] }}
                                                            />
                                                        </span>
                                                    </span>
                                                    <span className={`mt-1 block truncate text-[13px] font-semibold tracking-wide ${isActive ? "text-white" : "text-white/60"}`}>
                                                        {codenameOf(s.designation)}
                                                    </span>
                                                    <span className="mt-0.5 block truncate font-mono text-[9px] tracking-[0.1em] text-white/30">
                                                        {s.sector}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: dossier detail panel */}
                    <div className="relative overflow-hidden bg-[#0a0a0a] p-6 sm:p-10">
                        {/* diagonal red shard, echoes the console panel's red field */}
                        <div
                            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rotate-45 opacity-[0.16]"
                            style={{
                                background: "linear-gradient(135deg, #ff3b30, transparent 65%)",
                                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                            }}
                        />
                        <div
                            className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rotate-12 opacity-[0.08]"
                            style={{
                                background: "linear-gradient(135deg, #ff3b30, transparent 70%)",
                                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                            }}
                        />

                        {panelItem ? (
                            <div key={panelItem.id} className="hn-panel-in relative">
                                <div className="mb-6 flex flex-wrap items-center gap-3">
                                    <span
                                        className="rounded-sm border px-2.5 py-1 font-mono text-[10px] tracking-[0.15em]"
                                        style={{ borderColor: threatColor(panelItem.threat), color: threatColor(panelItem.threat) }}
                                    >
                                        {panelItem.threat} THREAT
                                    </span>
                                    <span
                                        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em]"
                                        style={{ color: STATUS_COLOR[panelItem.status] }}
                                    >
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span
                                                className="hn-status-dot absolute inline-flex h-full w-full rounded-full"
                                                style={{ backgroundColor: STATUS_COLOR[panelItem.status] }}
                                            />
                                            <span
                                                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                                                style={{ backgroundColor: STATUS_COLOR[panelItem.status] }}
                                            />
                                        </span>
                                        {panelItem.status}
                                    </span>
                                    <span className="font-mono text-[10px] tracking-[0.15em] text-white/30">
                                        {panelItem.sector}
                                    </span>
                                </div>

                                <h4 className="font-imperial text-[42px] leading-[0.92] sm:text-[64px]">
                                    <span className="text-white">{codenameOf(panelItem.designation)}</span>{" "}
                                    <span style={{ color: threatColor(panelItem.threat) }}>
                                        {STATUS_HEADLINE[panelItem.status]}
                                    </span>
                                </h4>

                                <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60">
                                    {panelItem.note}
                                </p>

                                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
                                        CASE {panelItem.id.toUpperCase()} · LOGGED {panelItem.timestamp}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => trackOnRadar(panelItem.id)}
                                        className="group ml-auto inline-flex items-center gap-2 rounded-sm border border-white/15 px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-white/70 transition-colors hover:border-[#d80f0f] hover:bg-[#d80f0f] hover:text-white"
                                    >
                                        <Crosshair size={12} className="transition-transform duration-300 group-hover:rotate-90" />
                                        TRACK ON RADAR
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex min-h-[240px] items-center justify-center font-mono text-[11px] tracking-[0.15em] text-white/30">
                                NO SIGNAL SELECTED
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <button
                        type="button"
                        onClick={handleScan}
                        disabled={scanning}
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-sm border border-white/15 bg-[#0a0a0a] px-7 py-3.5 font-imperial text-lg tracking-wide text-white transition-all hover:border-[#d80f0f]/60 hover:bg-[#d80f0f] disabled:cursor-not-allowed disabled:opacity-90"
                    >
                        <Radar
                            size={17}
                            className={scanning ? "hn-spin-fast" : "transition-transform duration-700 group-hover:rotate-180"}
                        />
                        {scanning ? "SCANNING..." : "INITIATE SCAN"}
                        {scanning && (
                            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#ff3b30]/70">
                                <span className="hn-scan-progress block h-full bg-[#ff3b30]" />
                            </span>
                        )}
                    </button>

                    {scanning && (
                        <div
                            aria-live="polite"
                            className="relative h-36 w-full max-w-md overflow-hidden rounded-sm border border-[#d80f0f]/30 bg-black/60 p-4 font-mono text-[11px] tracking-[0.08em]"
                        >
                            <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_3px)]" />
                            <div className="hn-scanline-move pointer-events-none absolute inset-x-0 h-8 bg-gradient-to-b from-[#ff3b30]/0 via-[#ff3b30]/10 to-[#ff3b30]/0" />

                            <div className="relative flex h-full flex-col justify-end gap-1">
                                {scanLines.map((line, i) => {
                                    const isLast = i === scanLines.length - 1;
                                    return (
                                        <div key={`${line}-${i}`} className="flex items-center gap-2 leading-5">
                                            <ChevronRight size={10} className="shrink-0 text-white/25" />
                                            <span className={isLast ? "text-[#ff6b57]" : "text-white/40"}>{line}</span>
                                        </div>
                                    );
                                })}
                                <div className="flex items-center gap-2">
                                    <ChevronRight size={10} className="shrink-0 text-white/25" />
                                    <span className="hn-cursor-blink inline-block h-3 w-[7px] bg-[#ff3b30]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
