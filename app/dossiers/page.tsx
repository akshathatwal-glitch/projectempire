'use client';

/**
 * DOSSIERS — Imperial Security Bureau case-file archive.
 *
 * Same hero band / red console panel / chip+pill filter language as the
 * bounty board. The draggable card board now sits INSIDE the hero,
 * layered on top of the "DOSSIERS" title (title behind at z-0, cards on
 * top at z-10), scattered in a tight cluster instead of a huge sprawling
 * board. The board sits above the red console panel.
 *
 * Drop this in as app/dossiers/page.tsx (Next.js 14 App Router).
 * Requires: tailwindcss, lucide-react, motion, components/ui/draggable-card.
 */

import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { ImperialSearch } from '@/components/imperial-search';
import {
    DraggableCardBody,
    DraggableCardContainer,
} from '@/components/ui/draggable-card';
import {
    X,
    MapPin,
    Radio,
    ShieldAlert,
    Fingerprint,
    Users,
    ChevronRight,
    ScanLine,
    CircleSlash,
    Menu,
} from 'lucide-react';
import Navbar from '@/components/navbar';

// ————————————————————————————————————————————————————————————
// DATA
// ————————————————————————————————————————————————————————————

type Status = 'ACTIVE' | 'CAPTURED' | 'TERMINATED' | 'UNCONFIRMED';

interface Dossier {
    id: string;
    codename: string;
    realName: string;
    species: string;
    affiliation: string;
    sector: string;
    lastSeen: string;
    status: Status;
    threat: 1 | 2 | 3 | 4 | 5;
    bounty: string;
    brief: string;
    history: string;
    associates: string[];
}

const DOSSIERS: Dossier[] = [
    {
        id: 'ISB-0114',
        codename: 'ASHVANE',
        realName: 'K███ Tel-Morran',
        species: 'Human',
        affiliation: 'HCET Syndicate — Cell Leader',
        sector: 'Outer Rim / Raxus Debris Field',
        lastSeen: '14:07:114 ABY-cycle',
        status: 'ACTIVE',
        threat: 5,
        bounty: '640,000 credits',
        brief:
            'Believed to coordinate Syndicate recruitment across three sectors using scavenger freighters as cover. Confirmed lightsaber combat, form unknown.',
        history:
            'Surfaced eleven cycles ago after a salvage-yard raid on Raxus went dark. Signal fragments intercepted from a modified YT-hull matching Syndicate courier profiles. Two ISB tracking teams lost contact within the debris field; presumed sensor-jammed rather than engaged.',
        associates: ['WIDOW-9', 'Unidentified Twi\'lek broker, callsign "Salt"'],
    },
    {
        id: 'ISB-0119',
        codename: 'WIDOW-9',
        realName: 'Unconfirmed',
        species: 'Zabrak',
        affiliation: 'HCET Syndicate — Courier Network',
        sector: 'Mid Rim / Bonadan shipping lanes',
        lastSeen: '02:44:113 ABY-cycle',
        status: 'ACTIVE',
        threat: 3,
        bounty: '210,000 credits',
        brief:
            'Runs falsified transit manifests moving recruits off-world. No confirmed combat engagement. Priority: capture for interrogation, not termination.',
        history:
            'Flagged after a pattern of manifest discrepancies at Bonadan customs repeated across nine cycles. Facial match against archive holos remains inconclusive — subject may be using cosmetic alteration or a body double network.',
        associates: ['ASHVANE'],
    },
    {
        id: 'ISB-0102',
        codename: 'GREYFEATHER',
        realName: 'Sella Ord Anmar',
        species: 'Human',
        affiliation: 'Unaligned Exile',
        sector: 'Unknown — last ping Felucia canopy',
        lastSeen: '119:071 ABY-cycle',
        status: 'UNCONFIRMED',
        threat: 2,
        bounty: '85,000 credits',
        brief:
            'Low combat priority. Historical case, kept open pending confirmation of status. Last transmission was a single distress burst, unanswered.',
        history:
            'Formerly attached to a Temple outpost prior to Order 66. Went to ground in the Felucia deep canopy. A single encrypted burst transmission was logged and never repeated. Search parties report the coordinates now show heavy native fauna activity.',
        associates: [],
    },
    {
        id: 'ISB-0087',
        codename: 'IRONSPAR',
        realName: 'D███ Kest',
        species: 'Human',
        affiliation: 'HCET Syndicate — Founding Member',
        sector: 'CAPTURED — in transit to Region IV',
        lastSeen: '233:110 ABY-cycle',
        status: 'CAPTURED',
        threat: 4,
        bounty: 'Claimed — 480,000 credits',
        brief:
            'One of the three founding Syndicate coordinators. Interrogation ongoing. Early intelligence has already led to two safehouse seizures.',
        history:
            'Apprehended during a failed extraction on Corellia after a Syndicate signal relay was traced to a shipping consortium office. Subject offered no resistance, consistent with a deliberate self-sacrifice to protect an evacuation in progress.',
        associates: ['ASHVANE', 'Unidentified — designation "The Cartographer"'],
    },
    {
        id: 'ISB-0140',
        codename: 'THRESHOLD',
        realName: 'Unconfirmed',
        species: 'Unknown',
        affiliation: 'HCET Syndicate — Suspected Recruiter',
        sector: 'Core Worlds / identity unknown',
        lastSeen: 'No confirmed sighting',
        status: 'UNCONFIRMED',
        threat: 5,
        bounty: 'Open — reward on ID alone',
        brief:
            'Ghost file. Believed responsible for the "clean recruitment" method flagged in Directive 9-Ashla: new Force-sensitives vanish with no trace, no distress calls, no bodies.',
        history:
            'THRESHOLD is a pattern, not a face. Nine disappearances across four sectors share the same signature: a subject of interest is quietly relocated within 48 hours of ISB flagging them. No agent has produced a visual match. Command suspects an inside source.',
        associates: ['Unconfirmed'],
    },
    {
        id: 'ISB-0071',
        codename: 'BRAMBLE',
        realName: 'Toth Ren-Kavik',
        species: 'Human',
        affiliation: 'Unaligned Exile',
        sector: 'TERMINATED — Kessel spice mines',
        lastSeen: '301:109 ABY-cycle',
        status: 'TERMINATED',
        threat: 2,
        bounty: 'Closed',
        brief: 'Case closed. Retained for pattern-analysis of exile behavior only.',
        history:
            'Located hiding among Kessel mine laborers under a false transit permit. Engaged an ISB inquisitorial escort and was terminated on-site. Recovered effects included a partially assembled lightsaber, non-functional.',
        associates: [],
    },
    {
        id: 'ISB-0133',
        codename: 'HOLLOWPOINT',
        realName: 'V██ Amsereth',
        species: 'Chiss',
        affiliation: 'HCET Syndicate — Field Tactician',
        sector: 'Outer Rim / Wild Space fringe',
        lastSeen: '018:114 ABY-cycle',
        status: 'ACTIVE',
        threat: 4,
        bounty: '390,000 credits',
        brief:
            'Plans Syndicate evasion routes. No confirmed lightsaber use — suspected non-combatant strategist rather than a Jedi. Treat any escort as hostile regardless.',
        history:
            'Chiss military signal patterns detected coordinating three simultaneous safehouse relocations, too precise for coincidence. If non-Force-sensitive as suspected, represents a distinct threat class ISB doctrine does not yet have a protocol for.',
        associates: ['ASHVANE', 'WIDOW-9'],
    },
    {
        id: 'ISB-0158',
        codename: 'LOOSE THREAD',
        realName: 'Pemma Skirata-Voss',
        species: 'Human',
        affiliation: 'Suspected Sympathizer — Civilian',
        sector: 'Core Worlds / Coruscant undercity',
        lastSeen: '299:114 ABY-cycle',
        status: 'ACTIVE',
        threat: 1,
        bounty: 'N/A — surveillance only',
        brief:
            'Low-level courier suspected of running supply drops for exiled Force-sensitives. No combat record. Under passive surveillance pending pattern confirmation.',
        history:
            'Flagged by an informant for repeated after-hours deliveries to a condemned undercity block. No contraband found in two searches. Command has authorized continued observation rather than detainment, citing insufficient cause.',
        associates: ['Unidentified undercity contact network'],
    },
];

const STATUS_FILTERS: Array<Status | 'ALL'> = ['ALL', 'ACTIVE', 'CAPTURED', 'TERMINATED', 'UNCONFIRMED'];

type SortKey = 'THREAT' | 'RECENT';

// Generates a 2-row x 4-column scatter layout for the card board, with
// jitter so it doesn't look like a rigid grid. When `randomize` is false
// it uses a deterministic pseudo-random formula (same output every time)
// — used only for the very first server-rendered pass, so the server and
// client markup match and React doesn't throw a hydration mismatch. Once
// mounted, an effect below calls this again with `randomize: true`, which
// uses real Math.random() and gives a fresh scatter on every page load.
function generateScatterPositions(count: number, randomize: boolean): React.CSSProperties[] {
    const cols = 4;
    const cellWidthPct = 100 / cols;
    const rowHeightPx = 340;
    const cardWidthPct = 21; // footprint of a 14rem card inside the max-w-5xl board

    const seededRand = (seed: number) => {
        const x = Math.sin(seed * 999) * 10000;
        return x - Math.floor(x); // 0..1, deterministic per seed
    };

    return Array.from({ length: count }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const baseLeft = col * cellWidthPct;
        const baseTop = row * rowHeightPx;

        const r1 = randomize ? Math.random() : seededRand(i + 1);
        const r2 = randomize ? Math.random() : seededRand(i + 2);
        const r3 = randomize ? Math.random() : seededRand(i + 3);

        const leftJitter = (r1 - 0.5) * cellWidthPct * 0.7;
        const topJitter = (r2 - 0.5) * 110;
        const rotateDeg = (r3 - 0.5) * 16;

        const left = Math.max(0, Math.min(100 - cardWidthPct, baseLeft + leftJitter));
        const top = Math.max(0, baseTop + topJitter);

        return {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}%`,
            rotate: `${rotateDeg.toFixed(1)}deg`,
            width: '14rem',
        } as React.CSSProperties;
    });
}

// ————————————————————————————————————————————————————————————
// SMALL PIECES
// ————————————————————————————————————————————————————————————

function statusColor(status: Status) {
    switch (status) {
        case 'ACTIVE':
            return { text: 'text-[#ff3b30]', dot: 'bg-[#ff3b30]' };
        case 'CAPTURED':
            return { text: 'text-[#ffb020]', dot: 'bg-[#ffb020]' };
        case 'TERMINATED':
            return { text: 'text-white/40', dot: 'bg-white/40' };
        case 'UNCONFIRMED':
            return { text: 'text-sky-400', dot: 'bg-sky-400' };
    }
}

function StatusBadge({ status }: { status: Status }) {
    const c = statusColor(status);
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] font-medium tracking-[0.18em] ${c.text}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${status === 'ACTIVE' ? 'animate-pulse' : ''}`} />
            {status}
        </span>
    );
}

function ThreatMeter({ level, size = 'sm' }: { level: number; size?: 'sm' | 'lg' }) {
    const bars = size === 'lg' ? 'h-5 w-2' : 'h-3 w-1.5';
    return (
        <div className="flex items-end gap-1" role="img" aria-label={`Threat level ${level} of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={`${bars} rounded-[1px] transition-colors ${i < level ? 'bg-[#d80f0f] shadow-[0_0_6px_rgba(216,15,15,0.7)]' : 'bg-white/10'
                        }`}
                    style={{ height: size === 'lg' ? `${8 + i * 4}px` : `${6 + i * 2.5}px` }}
                />
            ))}
        </div>
    );
}

// ————————————————————————————————————————————————————————————
// DRAGGABLE FILE CARD (compact)
// ————————————————————————————————————————————————————————————

function DossierDragCard({
    file,
    position,
    onOpen,
}: {
    file: Dossier;
    position: React.CSSProperties;
    onOpen: (f: Dossier) => void;
}) {
    return (
        <DraggableCardBody
            style={position}
            className="min-h-0 rounded-sm border border-white/10 bg-[#0a0a0a] p-0 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] hover:border-[#d80f0f]/50"
        >
            <div className="relative flex flex-col">
                {/* photo strip — thin band instead of a big empty box, just enough for status + a watermark id */}
                <div className="relative h-16 w-full overflow-hidden bg-[#050505]">
                    <div
                        className="absolute inset-0 opacity-80"
                        style={{
                            background:
                                'radial-gradient(ellipse at 30% 50%, rgba(216,15,15,0.35), transparent 70%), linear-gradient(180deg, #111112 0%, #050505 100%)',
                        }}
                    />
                    <svg
                        viewBox="0 0 100 100"
                        className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 fill-black/60 stroke-white/[0.06]"
                        strokeWidth={0.5}
                    >
                        <circle cx="50" cy="34" r="16" />
                        <path d="M20 92 C20 62 34 50 50 50 C66 50 80 62 80 92 Z" />
                    </svg>
                    <div className="absolute left-1.5 top-1.5">
                        <StatusBadge status={file.status} />
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 font-mono text-[8px] tracking-widest text-white/30">
                        {file.id}
                    </div>
                </div>

                {/* content — the codename is the whole point of the card, everything else is a supporting label */}
                <div className="flex flex-col gap-2.5 p-3.5">
                    <div>
                        <h3 className="font-imperial select-none text-[28px] leading-[0.95] tracking-wide text-white">
                            {file.codename}
                        </h3>
                        <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">
                            {file.realName}
                        </p>
                    </div>

                    <div className="space-y-0.5 text-[10px] text-white/50">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-2.5 w-2.5 shrink-0 text-[#d80f0f]/60" />
                            <span className="truncate">{file.sector}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="h-2.5 w-2.5 shrink-0 text-[#d80f0f]/60" />
                            <span className="truncate">{file.affiliation}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/25">
                                Threat
                            </span>
                            <ThreatMeter level={file.threat} />
                        </div>
                        {/* explicit tap target so dragging never gets mistaken for opening the file */}
                        <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpen(file);
                            }}
                            className="group flex items-center gap-1 rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-400 transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_16px_-2px_rgba(16,185,129,0.8)] active:scale-90 active:bg-emerald-600"
                        >
                            Open
                            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </DraggableCardBody>
    );
}

// ————————————————————————————————————————————————————————————
// DETAIL PANEL
// ————————————————————————————————————————————————————————————

function DossierDetail({ file, onClose }: { file: Dossier; onClose: () => void }) {
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="dossier-title"
                className="db-modal-in relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-sm border border-[#d80f0f]/30 bg-[#0a0a0a] shadow-[0_0_60px_rgba(216,15,15,0.15)]"
            >
                <div className="flex items-center justify-between border-b border-white/10 bg-[#111112] px-5 py-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d80f0f]">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Imperial Security Bureau — Classified File {file.id}
                    </div>
                    <button
                        ref={closeRef}
                        onClick={onClose}
                        aria-label="Close dossier"
                        className="rounded-sm p-2 text-white/50 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#d80f0f]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="font-mono text-[11px] tracking-widest text-white/40">{file.realName}</p>
                            <h2 id="dossier-title" className="font-imperial mt-1 text-4xl tracking-wide text-white">
                                {file.codename}
                            </h2>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <StatusBadge status={file.status} />
                            <ThreatMeter level={file.threat} size="lg" />
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <InfoBlock icon={<Fingerprint className="h-3.5 w-3.5" />} label="Species" value={file.species} />
                        <InfoBlock icon={<Users className="h-3.5 w-3.5" />} label="Affiliation" value={file.affiliation} />
                        <InfoBlock icon={<Radio className="h-3.5 w-3.5" />} label="Last Signal" value={file.lastSeen} />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoBlock icon={<MapPin className="h-3.5 w-3.5" />} label="Last Known Position" value={file.sector} />
                        <InfoBlock icon={<ScanLine className="h-3.5 w-3.5" />} label="Bounty Status" value={file.bounty} />
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-5">
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d80f0f]">Summary</h4>
                        <p className="mt-2 text-sm leading-relaxed text-white/70">{file.brief}</p>
                    </div>

                    <div className="mt-5">
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d80f0f]">Field Log</h4>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{file.history}</p>
                    </div>

                    <div className="mt-5">
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d80f0f]">
                            Known Associates
                        </h4>
                        {file.associates.length ? (
                            <ul className="mt-2 space-y-1">
                                {file.associates.map((a) => (
                                    <li key={a} className="flex items-center gap-2 text-sm text-white/60">
                                        <span className="h-1 w-1 rounded-full bg-[#d80f0f]" />
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2 flex items-center gap-2 text-sm text-white/30">
                                <CircleSlash className="h-3.5 w-3.5" /> None on record
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-sm border border-white/5 bg-black/30 p-3">
            <div className="flex items-center gap-1.5 text-[#d80f0f]/80">
                {icon}
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">{label}</span>
            </div>
            <p className="mt-1 truncate text-sm text-white/80">{value}</p>
        </div>
    );
}

// ————————————————————————————————————————————————————————————
// PAGE
// ————————————————————————————————————————————————————————————

export default function DossiersPage() {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
    const [sort, setSort] = useState<SortKey>('THREAT');
    const [active, setActive] = useState<Dossier | null>(null);

    // Deterministic layout for the first (server-rendered) pass, then
    // re-rolled with real randomness once mounted on the client below —
    // so the board is scattered differently every time the page loads.
    const [scatterPositions, setScatterPositions] = useState<React.CSSProperties[]>(() =>
        generateScatterPositions(DOSSIERS.length, false),
    );

    useEffect(() => {
        setScatterPositions(generateScatterPositions(DOSSIERS.length, true));
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return DOSSIERS.filter((f) => {
            const matchesQuery =
                !q ||
                f.codename.toLowerCase().includes(q) ||
                f.realName.toLowerCase().includes(q) ||
                f.sector.toLowerCase().includes(q) ||
                f.affiliation.toLowerCase().includes(q);
            const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
            return matchesQuery && matchesStatus;
        }).sort((a, b) => (sort === 'THREAT' ? b.threat - a.threat : a.id < b.id ? 1 : -1));
    }, [query, statusFilter, sort]);

    const activeCount = DOSSIERS.filter((f) => f.status === 'ACTIVE').length;

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <style>{`
        .font-imperial {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
        }
        @keyframes db-pulse {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(3); opacity: 0; }
        }
        .db-ring { animation: db-pulse 2.4s ease-out infinite; }

        @keyframes db-fade-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .db-modal-in { animation: db-fade-in 0.25s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .db-ring { animation: none; }
        }
      `}</style>

            <Navbar />

            {/* ---------------- Header band: title + card board layered on top ---------------- */}
            <div className="relative px-6 pt-28 pb-14 sm:px-10">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-60 [background:radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(216,15,15,0.25),transparent_70%)]" />

                {/* relative wrapper: title sits behind (z-0), card board sits on top (z-10) */}
                <div className="relative mx-auto mt-10 max-w-5xl">
                    {/* Title — centered, low z-index, no pointer events so it never blocks drags */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 flex flex-col items-center text-center">
                        <h1 className="font-imperial text-[52px] leading-none tracking-wide sm:text-[76px]">
                            DOSSIERS
                        </h1>
                        <p className="mt-4 max-w-lg text-sm tracking-[0.15em] text-white/50">
                            FULL CASE FILES ON EVERY KNOWN TARGET — LAST POSITION, AFFILIATIONS, THREAT RATING
                        </p>
                    </div>

                    {/* Card board — defines the section height, sits ON TOP of the title */}
                    {filtered.length ? (
                        <DraggableCardContainer className="relative z-10 mx-auto h-[760px] w-full max-w-5xl">
                            {filtered.map((f, i) => (
                                <DossierDragCard
                                    key={f.id}
                                    file={f}
                                    position={scatterPositions[i % scatterPositions.length]}
                                    onOpen={setActive}
                                />
                            ))}
                        </DraggableCardContainer>
                    ) : (
                        <div className="relative z-10 flex h-[420px] flex-col items-center justify-end gap-3 pb-6 text-center text-white/40">
                            <CircleSlash className="h-8 w-8" />
                            <p className="font-mono text-xs uppercase tracking-[0.2em]">No matching files in the archive</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ---------------- Red console panel ---------------- */}
            <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 sm:px-10">
                <div className="relative overflow-hidden rounded-sm border border-white/15 bg-[#b5130e] [background-image:radial-gradient(ellipse_90%_70%_at_25%_0%,rgba(255,255,255,0.14),transparent_60%)]">
                    <div className="flex items-center justify-between border-b border-white/15 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <ImperialSearch value={query} onValueChange={setQuery} />
                            <Menu size={16} className="text-white/70" />
                        </div>
                        <span className="font-imperial text-lg tracking-wide">DOSSIER NET</span>
                        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-white/85">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-white db-ring" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                            </span>
                            {activeCount} ACTIVE
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 px-6 py-10 sm:px-10 md:grid-cols-[auto_1fr]">
                        <div className="hidden items-center justify-center md:flex">
                            <span className="font-imperial -rotate-90 whitespace-nowrap text-xs tracking-[0.4em] text-white/70">
                                ISB SURVEILLANCE ARCHIVE
                            </span>
                        </div>

                        <div>
                            <div className="mb-6 min-h-[20px] font-mono text-[11px] tracking-[0.1em] text-white/70">
                                Cross-referencing case files... Sorting by threat...
                            </div>

                            <h2 className="font-imperial text-[36px] leading-[0.95] sm:text-[52px]">
                                NO FILE <span className="text-white/60">STAYS</span>
                                <br />
                                CLOSED
                            </h2>

                            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85">
                                Search by codename, sector, or affiliation. Drag a file to
                                the side, or open it for full field intelligence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- Filters / sort ---------------- */}
            <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-10">
                <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
                    {/* status chips */}
                    <div className="flex flex-wrap gap-2">
                        {STATUS_FILTERS.map((s) => {
                            const isActive = statusFilter === s;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatusFilter(s)}
                                    className={`group relative overflow-hidden rounded-sm border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] transition-all duration-300 ${isActive
                                        ? 'border-[#d80f0f] bg-[#d80f0f] text-white'
                                        : 'border-white/12 text-white/50 hover:-translate-y-0.5 hover:border-[#d80f0f]/50 hover:text-white'
                                        }`}
                                    style={{
                                        boxShadow: isActive
                                            ? '0 0 20px -4px rgba(216,15,15,0.7), inset 0 0 0 1px rgba(255,255,255,0.15)'
                                            : 'none',
                                    }}
                                >
                                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                                    {isActive && (
                                        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.8)]" />
                                    )}
                                    <span className="relative">{s}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* sort: sliding-pill segmented control */}
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">SORT</span>
                        <LayoutGroup id="dossier-sort-control">
                            <div className="relative flex rounded-sm border border-white/12 bg-[#0a0a0a] p-1">
                                {(['THREAT', 'RECENT'] as SortKey[]).map((k) => {
                                    const isActive = sort === k;
                                    return (
                                        <button
                                            key={k}
                                            type="button"
                                            onClick={() => setSort(k)}
                                            className="relative z-10 rounded-[3px] px-4 py-1.5 font-mono text-[11px] tracking-[0.1em] transition-colors duration-300"
                                            style={{ color: isActive ? '#050505' : 'rgba(255,255,255,0.45)' }}
                                        >
                                            {isActive && (
                                                <motion.span
                                                    layoutId="dossier-sort-pill"
                                                    className="absolute inset-0 -z-10 rounded-[3px] bg-white"
                                                    style={{ boxShadow: '0 0 18px -2px rgba(255,255,255,0.6)' }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                                />
                                            )}
                                            {k}
                                        </button>
                                    );
                                })}
                            </div>
                        </LayoutGroup>
                    </div>
                </div>
            </div>

            {active && <DossierDetail file={active} onClose={() => setActive(null)} />}
        </main>
    );
}