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
import { motion, LayoutGroup, AnimatePresence } from 'motion/react';
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
    Menu, Skull, Crosshair, Radiation,
    Copy, Check, Zap, Terminal, Lock, Unlock, FileText
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

function ThreatMeter({
    level,
    size = 'sm',
    onChange,
}: {
    level: number;
    size?: 'sm' | 'lg';
    onChange?: (level: number) => void;
}) {
    const [hoverLevel, setHoverLevel] = useState<number | null>(null);
    const trackHeight = size === 'lg' ? 'h-2.5' : 'h-1.5';
    const width = size === 'lg' ? 'w-28' : 'w-16';
    const interactive = typeof onChange === 'function';

    const displayLevel = hoverLevel ?? level;
    const pct = Math.max(0, Math.min(100, (displayLevel / 5) * 100));

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!interactive) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const next = Math.ceil(Math.max(0, Math.min(1, ratio)) * 5);
        setHoverLevel(next);
    };

    return (
        <div
            className="group flex items-center gap-1.5"
            role={interactive ? 'slider' : 'img'}
            aria-label={`Threat level ${level} of 5`}
            aria-valuemin={interactive ? 0 : undefined}
            aria-valuemax={interactive ? 5 : undefined}
            aria-valuenow={interactive ? level : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={
                interactive
                    ? (e) => {
                        if (e.key === 'ArrowRight') onChange?.(Math.min(5, level + 1));
                        if (e.key === 'ArrowLeft') onChange?.(Math.max(0, level - 1));
                    }
                    : undefined
            }
        >
            <div
                className={`relative ${width} ${trackHeight} overflow-hidden rounded-full bg-white/10 ${interactive ? 'cursor-pointer' : ''
                    }`}
                onPointerMove={handleMove}
                onPointerLeave={() => setHoverLevel(null)}
                onClick={() => {
                    if (interactive && hoverLevel !== null) onChange?.(hoverLevel);
                }}
            >
                {/* subtle track ticks at each level boundary */}
                <div className="pointer-events-none absolute inset-0 flex justify-between px-[1px]">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <span key={i} className="h-full w-px bg-black/40" />
                    ))}
                </div>

                {/* glowing fill */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#8a0a0a] via-[#d80f0f] to-[#ff3b3b] transition-[width] duration-300 ease-out"
                    style={{
                        width: `${pct}%`,
                        boxShadow:
                            '0 0 8px rgba(216,15,15,0.85), 0 0 16px rgba(216,15,15,0.5), inset 0 0 4px rgba(255,255,255,0.25)',
                    }}
                >
                    {/* animated shimmer pulse on the glow */}
                    <div className="absolute inset-0 animate-pulse rounded-full bg-white/10" />
                </div>
            </div>

            <span className="font-mono text-[9px] tabular-nums text-white/40 transition-colors group-hover:text-[#ff3b3b]">
                {displayLevel}/5
            </span>
        </div>
    );
}

// ————————————————————————————————————————————————————————————
// DRAGGABLE FILE CARD — v4 (tightened height)
//
// Changes from v3:
// 1. Internal card padding reduced across the codename block, the Open
//    File button block, and the footer info block — each card is now
//    visibly shorter without losing any content.
// 2. Row height and vertical jitter in generateScatterPositions() are
//    reduced to match the new shorter card height, so rows sit closer
//    together and there's less empty space in the board.
// ————————————————————————————————————————————————————————————

// Card width scales with codename length so short names (WIDOW-9) get a
// compact card and long ones (LOOSE THREAD) get room to breathe.
function codenameCardWidth(name: string) {
    const len = name.length;
    if (len <= 6) return 16.5; // rem (~264px)
    if (len <= 8) return 17.5; // (~280px)
    if (len <= 10) return 18.5; // (~296px)
    if (len <= 13) return 19.5; // (~312px)
    return 20.5; // (~328px)
}

function codenameFontSize(name: string) {
    const len = name.length;
    if (len <= 7) return 'text-[28px] sm:text-[30px]';
    if (len <= 10) return 'text-[24px] sm:text-[26px]';
    if (len <= 12) return 'text-[21px] sm:text-[23px]';
    return 'text-[19px] sm:text-[20px]';
}

function bgIcon(status: Status) {
    switch (status) {
        case 'ACTIVE':
            return Crosshair;
        case 'CAPTURED':
            return ShieldAlert;
        case 'TERMINATED':
            return Skull;
        case 'UNCONFIRMED':
            return Radiation;
    }
}

function DossierDragCard({
    file,
    position,
    onOpen,
}: {
    file: Dossier;
    position: React.CSSProperties;
    onOpen: (f: Dossier) => void;
}) {
    const c = statusColor(file.status);
    const BgIcon = bgIcon(file.status);

    return (
        <DraggableCardBody
            style={position}
            className="group h-[280px] min-h-0 overflow-hidden rounded-sm border border-white/12 bg-[#0c0c0e] p-0 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.85)] hover:border-[#d80f0f]/60 hover:shadow-[0_20px_50px_-10px_rgba(216,15,15,0.2)]"
        >
            <div className="absolute inset-0 flex flex-col justify-between">
                {/* icon watermark — sits behind everything, drifts + brightens on hover/drag */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <BgIcon
                        className="absolute -bottom-6 -right-6 h-28 w-28 text-[#d80f0f] opacity-[0.08] transition-all duration-300 ease-out group-hover:opacity-[0.18] group-hover:-rotate-6 group-active:opacity-[0.24]"
                        strokeWidth={1}
                        style={{ rotate: '-8deg' }}
                    />
                    <BgIcon
                        className="absolute -left-4 -top-4 h-14 w-14 text-white opacity-[0.04] transition-all duration-300 ease-out group-hover:opacity-[0.09]"
                        strokeWidth={1}
                        style={{ rotate: '12deg' }}
                    />
                </div>

                {/* faint scanline texture over the whole card */}
                <div
                    className="pointer-events-none absolute inset-0 z-20 opacity-[0.06]"
                    style={{
                        background:
                            'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)',
                    }}
                />

                {/* top strip — id left, status right */}
                <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 bg-black/60 px-3.5 py-2">
                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/40">{file.id}</span>
                    <span className={`flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] ${c.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${file.status === 'ACTIVE' ? 'animate-pulse' : ''}`} />
                        {file.status}
                    </span>
                </div>

                {/* codename — single line, full breathing room */}
                <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="h-[2px] w-6 bg-[#d80f0f]" />
                        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#d80f0f]/80">TARGET FILE</span>
                    </div>
                    <h3
                        className={`font-imperial select-none whitespace-nowrap leading-none tracking-wide text-white ${codenameFontSize(
                            file.codename,
                        )}`}
                    >
                        {file.codename}
                    </h3>
                    <p className="mt-1.5 truncate font-mono text-[9px] uppercase tracking-[0.15em] text-white/40">
                        {file.realName}
                    </p>
                </div>

                {/* open — green "access granted" terminal action, animated */}
                <div className="relative z-10 shrink-0 px-4 pb-2">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.95 }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen(file);
                        }}
                        className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-sm border border-emerald-500/60 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_25px_-2px_rgba(16,185,129,0.9)]"
                    >
                        {/* Continuous subtle shimmer sweep */}
                        <motion.span
                            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent"
                            animate={{ translateX: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 1.3, ease: 'easeInOut' }}
                        />
                        <span className="relative flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 group-hover/btn:bg-black" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 group-hover/btn:bg-black" />
                            </span>
                            Open File
                            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1.5" />
                        </span>
                    </motion.button>
                </div>

                {/* metadata footer — sector, affiliation, threat */}
                <div className="relative z-10 shrink-0 space-y-1.5 border-t border-white/10 bg-black/40 px-4 py-2.5 text-white/50">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                            <MapPin className="h-3 w-3 shrink-0 text-[#d80f0f]" />
                            <span className="truncate font-mono text-[9px] tracking-[0.02em]">{file.sector}</span>
                        </div>
                        <div className="flex items-center gap-1.5 overflow-hidden shrink-0">
                            <Users className="h-3 w-3 shrink-0 text-[#d80f0f]" />
                            <span className="truncate font-mono text-[9px] tracking-[0.02em] max-w-[120px]">{file.affiliation}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-0.5 border-t border-white/5">
                        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">Threat Rating</span>
                        <ThreatMeter level={file.threat} />
                    </div>
                </div>
            </div>
        </DraggableCardBody>
    );
}

// ————————————————————————————————————————————————————————————
// Scatter layout
// ————————————————————————————————————————————————————————————

function generateScatterPositions(dossiers: Dossier[], randomize: boolean): React.CSSProperties[] {
    const cols = 4;
    const cellWidthPct = 100 / cols;
    const rowHeightPx = 290;
    const boardWidthPx = 1024;

    const seededRand = (seed: number) => {
        const x = Math.sin(seed * 999) * 10000;
        return x - Math.floor(x);
    };

    return dossiers.map((d, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const baseLeft = col * cellWidthPct;
        const baseTop = row * rowHeightPx;

        const r1 = randomize ? Math.random() : seededRand(i + 1);
        const r2 = randomize ? Math.random() : seededRand(i + 2);
        const r3 = randomize ? Math.random() : seededRand(i + 3);

        const widthRem = codenameCardWidth(d.codename);
        const cardWidthPct = ((widthRem * 16) / boardWidthPx) * 100;

        const leftJitter = (r1 - 0.5) * (cellWidthPct - cardWidthPct * 0.3);
        const topJitter = (r2 - 0.5) * 40;
        const rotateDeg = (r3 - 0.5) * 10;

        const left = Math.max(0, Math.min(100 - cardWidthPct, baseLeft + leftJitter));
        const top = Math.max(0, baseTop + topJitter);

        return {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}%`,
            rotate: `${rotateDeg.toFixed(1)}deg`,
            width: `${widthRem}rem`,
        } as React.CSSProperties;
    });
}

// ————————————————————————————————————————————————————————————
// DETAIL PANEL
// ————————————————————————————————————————————————————————————

type ModalTab = 'OVERVIEW' | 'FIELD_LOGS' | 'DIRECTIVES';

function DossierDetail({ file, onClose }: { file: Dossier; onClose: () => void }) {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [tab, setTab] = useState<ModalTab>('OVERVIEW');
    const [copied, setCopied] = useState(false);
    const [unredacted, setUnredacted] = useState(false);
    const [directiveStatus, setDirectiveStatus] = useState<string | null>(null);

    useEffect(() => {
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleCopyId = () => {
        navigator.clipboard.writeText(file.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const triggerDirective = (actionName: string) => {
        setDirectiveStatus(`EXECUTING ${actionName}...`);
        setTimeout(() => {
            setDirectiveStatus(`DIRECTIVE "${actionName}" TRANSMITTED TO ISB NET`);
            setTimeout(() => setDirectiveStatus(null), 3500);
        }, 600);
    };

    const displayName = unredacted
        ? file.realName.replace(/█+/g, 'aelen')
        : file.realName;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        >
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog Card */}
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="dossier-title"
                initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20, rotateX: -6 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-[#d80f0f]/40 bg-[#09090b] shadow-[0_0_80px_rgba(216,15,15,0.25),0_25px_60px_rgba(0,0,0,0.95)]"
            >
                {/* Holographic sweep beam */}
                <motion.div
                    initial={{ translateX: '-100%' }}
                    animate={{ translateX: '100%' }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                    className="pointer-events-none absolute top-0 z-30 h-[2px] w-full bg-gradient-to-r from-transparent via-[#d80f0f] to-transparent"
                />

                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#111114] px-5 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#d80f0f]/50 bg-[#d80f0f]/10 text-[#d80f0f]">
                            <ShieldAlert className="h-4 w-4 animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d80f0f]">
                                    ISB CLASSIFIED ARCHIVE
                                </span>
                                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[8px] tracking-wider text-white/60">
                                    CLEARANCE 5
                                </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                                <span>FILE #{file.id}</span>
                                <button
                                    type="button"
                                    onClick={handleCopyId}
                                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                    {copied ? 'COPIED' : 'COPY'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        ref={closeRef}
                        onClick={onClose}
                        aria-label="Close dossier"
                        className="group rounded-sm p-2 text-white/50 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#d80f0f]"
                    >
                        <X className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
                    </button>
                </div>

                {/* Hero Banner Section */}
                <div className="relative border-b border-white/10 bg-gradient-to-r from-[#160404] via-[#09090b] to-[#09090b] px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d80f0f]">
                                    TARGET CODENAME
                                </span>
                                {file.realName.includes('█') && (
                                    <button
                                        type="button"
                                        onClick={() => setUnredacted(!unredacted)}
                                        className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-amber-400/80 transition-colors hover:text-amber-300"
                                    >
                                        {unredacted ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                        {unredacted ? 'ENCRYPT' : 'UN-REDACT'}
                                    </button>
                                )}
                            </div>
                            <h2 id="dossier-title" className="font-imperial mt-1 text-4xl tracking-wide text-white sm:text-5xl">
                                {file.codename}
                            </h2>
                            <p className="mt-1 font-mono text-xs tracking-widest text-white/50">
                                IDENTITY: <span className={unredacted ? 'text-amber-300 font-bold' : ''}>{displayName}</span>
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2.5">
                            <StatusBadge status={file.status} />
                            <ThreatMeter level={file.threat} size="lg" />
                            <span className="font-mono text-[10px] tracking-wider text-amber-400">
                                BOUNTY: {file.bounty}
                            </span>
                        </div>
                    </div>

                    {/* Tab Selection */}
                    <div className="mt-6 flex border-b border-white/10">
                        {(['OVERVIEW', 'FIELD_LOGS', 'DIRECTIVES'] as ModalTab[]).map((t) => {
                            const isActive = tab === t;
                            const label =
                                t === 'OVERVIEW'
                                    ? 'OVERVIEW & METRICS'
                                    : t === 'FIELD_LOGS'
                                    ? 'FIELD INTEL LOGS'
                                    : 'ISB DIRECTIVES';
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTab(t)}
                                    className="relative px-4 py-2 font-mono text-[11px] font-medium tracking-[0.15em] transition-colors"
                                    style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)' }}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="dossier-modal-tab"
                                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d80f0f]"
                                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Directive Toast notification */}
                <AnimatePresence>
                    {directiveStatus && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[#d80f0f]/20 px-6 py-2 border-b border-[#d80f0f]/40 font-mono text-xs text-amber-300 flex items-center gap-2"
                        >
                            <Zap className="h-3.5 w-3.5 animate-spin text-amber-400" />
                            {directiveStatus}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tab Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {tab === 'OVERVIEW' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <InfoBlock icon={<Fingerprint className="h-4 w-4" />} label="Species" value={file.species} />
                                <InfoBlock icon={<Users className="h-4 w-4" />} label="Affiliation" value={file.affiliation} />
                                <InfoBlock icon={<Radio className="h-4 w-4" />} label="Last Signal Ping" value={file.lastSeen} />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <InfoBlock icon={<MapPin className="h-4 w-4" />} label="Last Known Position" value={file.sector} />
                                <InfoBlock icon={<ScanLine className="h-4 w-4" />} label="Bounty Status" value={file.bounty} />
                            </div>

                            <div className="rounded-sm border border-white/10 bg-black/40 p-4">
                                <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d80f0f]">
                                    <FileText className="h-3.5 w-3.5" /> Executive Summary
                                </h4>
                                <p className="mt-2 text-sm leading-relaxed text-white/80">{file.brief}</p>
                            </div>

                            <div className="rounded-sm border border-white/10 bg-black/40 p-4">
                                <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d80f0f]">
                                    <Users className="h-3.5 w-3.5" /> Confirmed Associates
                                </h4>
                                {file.associates.length ? (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {file.associates.map((a) => (
                                            <span
                                                key={a}
                                                className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/80"
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#d80f0f]" />
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-2 flex items-center gap-2 text-sm text-white/30">
                                        <CircleSlash className="h-4 w-4" /> None on record
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {tab === 'FIELD_LOGS' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="rounded-sm border border-white/10 bg-[#050507] p-4 font-mono text-xs">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-white/40">
                                    <span className="flex items-center gap-2 text-[#d80f0f]">
                                        <Terminal className="h-4 w-4" /> SURVEILLANCE_LOG_STREAM
                                    </span>
                                    <span>TIMESTAMP: {file.lastSeen}</span>
                                </div>
                                <p className="mt-4 leading-relaxed text-emerald-400/90 whitespace-pre-line font-mono text-sm">
                                    {file.history}
                                </p>
                            </div>

                            <div className="rounded-sm border border-amber-500/20 bg-amber-500/5 p-4">
                                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">
                                    <ShieldAlert className="h-4 w-4" /> Tactical Note
                                </div>
                                <p className="mt-1.5 text-xs leading-relaxed text-amber-200/70">
                                    Target exhibits high evasive capability. Any inquisitorial forces engaging this individual must maintain full perimeter lockdown.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {tab === 'DIRECTIVES' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <p className="font-mono text-xs tracking-wider text-white/60">
                                AUTHORIZED IMPERIAL ACTIONS FOR CASE FILE <span className="text-white font-bold">{file.id}</span>:
                            </p>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                    type="button"
                                    onClick={() => triggerDirective('MARK FOR PRIORITY PURSUIT')}
                                    className="group flex items-center gap-3 rounded-sm border border-[#d80f0f]/60 bg-[#d80f0f]/15 p-3.5 text-left font-mono transition-all duration-200 hover:border-[#d80f0f] hover:bg-[#d80f0f] hover:text-white hover:shadow-[0_0_25px_rgba(216,15,15,0.5)]"
                                >
                                    <Crosshair className="h-5 w-5 shrink-0 text-[#d80f0f] transition-colors group-hover:text-white" />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-white">Mark Priority Pursuit</div>
                                        <div className="text-[10px] text-white/50 group-hover:text-white/80">Dispatch ISB hunter squadron</div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                    type="button"
                                    onClick={() => triggerDirective('ISSUE SECTOR BOUNTY BULLETIN')}
                                    className="group flex items-center gap-3 rounded-sm border border-amber-500/50 bg-amber-500/10 p-3.5 text-left font-mono transition-all duration-200 hover:border-amber-400 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                                >
                                    <ScanLine className="h-5 w-5 shrink-0 text-amber-400 transition-colors group-hover:text-black" />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-amber-300 group-hover:text-black">Broadcast Bounty</div>
                                        <div className="text-[10px] text-white/50 group-hover:text-black/80">Transmit to HoloNet hunters</div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                    type="button"
                                    onClick={() => triggerDirective('REQUEST PROBE DRONE DEPLOYMENT')}
                                    className="group flex items-center gap-3 rounded-sm border border-emerald-500/50 bg-emerald-500/10 p-3.5 text-left font-mono transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                                >
                                    <Radio className="h-5 w-5 shrink-0 text-emerald-400 transition-colors group-hover:text-black" />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 group-hover:text-black">Deploy Probe Drones</div>
                                        <div className="text-[10px] text-white/50 group-hover:text-black/80">Scan sector {file.sector}</div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                    type="button"
                                    onClick={() => triggerDirective('GENERATE CLASSIFIED REPORT')}
                                    className="group flex items-center gap-3 rounded-sm border border-white/20 bg-white/5 p-3.5 text-left font-mono transition-all duration-200 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                                >
                                    <Terminal className="h-5 w-5 shrink-0 text-white/70 transition-colors group-hover:text-black" />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-white/90 group-hover:text-black">Export Case Log</div>
                                        <div className="text-[10px] text-white/50 group-hover:text-black/80">Download encrypted file</div>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Footer action bar */}
                <div className="flex items-center justify-between border-t border-white/10 bg-[#111114] px-6 py-3.5">
                    <span className="font-mono text-[10px] tracking-widest text-white/30">
                        SECURE TERMINAL NODE 09-ISB
                    </span>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={onClose}
                        className="rounded-sm border border-white/20 bg-white/10 px-5 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                    >
                        Close File
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-sm border border-white/10 bg-black/40 p-3.5 transition-colors hover:border-[#d80f0f]/40">
            <div className="flex items-center gap-2 text-[#d80f0f]">
                {icon}
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">{label}</span>
            </div>
            <p className="mt-1.5 font-mono text-xs text-white/90 truncate">{value}</p>
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
        generateScatterPositions(DOSSIERS, false),
    );

    useEffect(() => {
        setScatterPositions(generateScatterPositions(DOSSIERS, true));
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
                        <DraggableCardContainer className="relative z-10 mx-auto h-[640px] w-full max-w-5xl">
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

            {/* ---------------- ISB Console panel ---------------- */}
            <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 sm:px-10">
                <div className="relative overflow-hidden rounded-sm border border-[#d80f0f]/40 bg-gradient-to-r from-[#180303] via-[#0b0304] to-[#180303] shadow-[0_0_60px_rgba(216,15,15,0.2)]">
                    {/* Top ambient glow line */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d80f0f] to-transparent opacity-80" />

                    <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <ImperialSearch value={query} onValueChange={setQuery} />
                            <Menu size={16} className="text-white/60" />
                        </div>
                        <span className="font-imperial text-lg tracking-wide text-white">DOSSIER NET</span>
                        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-[#d80f0f]">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-[#d80f0f] db-ring" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d80f0f]" />
                            </span>
                            {activeCount} ACTIVE
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 px-6 py-10 sm:px-10 md:grid-cols-[auto_1fr]">
                        <div className="hidden items-center justify-center md:flex">
                            <span className="font-imperial -rotate-90 whitespace-nowrap text-xs tracking-[0.4em] text-[#d80f0f]/80">
                                ISB SURVEILLANCE ARCHIVE
                            </span>
                        </div>

                        <div>
                            <div className="mb-4 min-h-[20px] font-mono text-[11px] tracking-[0.15em] text-[#d80f0f]">
                                Cross-referencing case files... Sorting by threat...
                            </div>

                            <h2 className="font-imperial text-[36px] leading-[0.95] text-white sm:text-[52px]">
                                NO FILE <span className="text-[#d80f0f]">STAYS</span>
                                <br />
                                CLOSED
                            </h2>

                            <p className="mt-4 max-w-md font-mono text-xs leading-relaxed text-white/60">
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

            <AnimatePresence>
                {active && <DossierDetail file={active} onClose={() => setActive(null)} />}
            </AnimatePresence>
        </main>
    );
}