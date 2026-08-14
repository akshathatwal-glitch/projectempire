"use client";

import HunterCommendationsDemo from "@/components/hunter-commendations"
import { ImperialSearch } from "@/components/imperial-search"

import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useState, useRef, type MouseEvent } from "react";
import {
    Trophy,
    Search,
    Menu,
    Crosshair,
    MapPin,
    Coins,
    Lock,
    Plus,
    X,
    Terminal,
    ChevronRight,
    Send,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const SECTORS = [
    "OUTER RIM",
    "CORE WORLDS",
    "MID RIM",
    "COLONIES",
    "UNKNOWN REGIONS",
    "WILD SPACE",
];

type Status = "ACTIVE" | "CLAIMED";

interface Bounty {
    id: string;
    target: string;
    alias: string;
    sector: string;
    threat: 1 | 2 | 3 | 4 | 5;
    payout: number;
    lastSeen: string;
    status: Status;
}

const INITIAL_BOUNTIES: Bounty[] = [
    { id: "bt1", target: "Unidentified Jedi", alias: '"The Wanderer"', sector: "OUTER RIM", threat: 5, payout: 240000, lastSeen: "Tatooine, 3 days ago", status: "ACTIVE" },
    { id: "bt2", target: "Former Padawan", alias: '"Ashvale"', sector: "MID RIM", threat: 3, payout: 85000, lastSeen: "Bespin, 6 hours ago", status: "ACTIVE" },
    { id: "bt3", target: "Rogue Consular", alias: '"Grey Veil"', sector: "CORE WORLDS", threat: 4, payout: 160000, lastSeen: "Corellia, 1 day ago", status: "ACTIVE" },
    { id: "bt4", target: "Suspected Sympathizer", alias: '"Quiet Hand"', sector: "COLONIES", threat: 2, payout: 42000, lastSeen: "Muunilinst, 2 days ago", status: "ACTIVE" },
    { id: "bt5", target: "Exiled Knight", alias: '"Cinder"', sector: "UNKNOWN REGIONS", threat: 5, payout: 310000, lastSeen: "Signal lost, 9 days ago", status: "ACTIVE" },
    { id: "bt6", target: "Smuggler Contact", alias: '"Half-Light"', sector: "WILD SPACE", threat: 1, payout: 18000, lastSeen: "Nal Hutta, 4 hours ago", status: "CLAIMED" },
];

const THREAT_COLOR: Record<number, string> = {
    1: "#8a8a8a",
    2: "#ffb020",
    3: "#ffb020",
    4: "#ff3b30",
    5: "#ff3b30",
};

type SortKey = "PAYOUT" | "THREAT";

/* ------------------------------------------------------------------ */
/*  3D tilt card wrapper                                               */
/* ------------------------------------------------------------------ */

function TiltCard({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});

    function handleMove(e: MouseEvent<HTMLDivElement>) {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setStyle({
            transform: `perspective(900px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) translateZ(0)`,
        });
    }

    function handleLeave() {
        setStyle({
            transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)",
        });
    }

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ ...style, transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)" }}
            className="[transform-style:preserve-3d]"
        >
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BountyBoard() {
    const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES);
    const [sectorFilter, setSectorFilter] = useState<string>("ALL");
    const [sort, setSort] = useState<SortKey>("PAYOUT");
    const [postOpen, setPostOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // post-bounty form state
    const [target, setTarget] = useState("");
    const [alias, setAlias] = useState("");
    const [sector, setSector] = useState(SECTORS[0]);
    const [threat, setThreat] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [payout, setPayout] = useState("");
    const [error, setError] = useState<string | null>(null);

    function claim(id: string) {
        setBounties((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "CLAIMED" } : b))
        );
    }

    function submitBounty() {
        if (!target.trim()) {
            setError("TARGET DESIGNATION REQUIRED");
            return;
        }
        if (!payout || Number(payout) <= 0) {
            setError("VALID PAYOUT REQUIRED");
            return;
        }
        setError(null);
        const entry: Bounty = {
            id: Math.random().toString(36).slice(2, 8),
            target: target.trim(),
            alias: alias.trim() ? `"${alias.trim()}"` : "Unlisted",
            sector,
            threat,
            payout: Number(payout),
            lastSeen: "Position unconfirmed",
            status: "ACTIVE",
        };
        setBounties((prev) => [entry, ...prev]);
        setPostOpen(false);
        setTarget("");
        setAlias("");
        setPayout("");
        setThreat(3);
    }

    const activeCount = bounties.filter((b) => b.status === "ACTIVE").length;

    const filtered = bounties
        .filter((b) => sectorFilter === "ALL" || b.sector === sectorFilter)
        .filter(
            (b) =>
                b.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.sector.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => (sort === "PAYOUT" ? b.payout - a.payout : b.threat - a.threat));

    return (
        <section className="w-full bg-[#050505] text-white">
            <style>{`
        .font-imperial {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
        }
        @keyframes bb-pulse {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(3); opacity: 0; }
        }
        .bb-ring { animation: bb-pulse 2.4s ease-out infinite; }

        @keyframes bb-fade-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .bb-modal-in { animation: bb-fade-in 0.25s ease-out; }

        @keyframes bb-claim-flash {
          0% { background-color: rgba(255,176,32,0.22); box-shadow: inset 0 0 0 1px rgba(255,176,32,0.7); }
          100% { background-color: transparent; box-shadow: inset 0 0 0 1px rgba(255,176,32,0); }
        }
        .bb-claim-flash { animation: bb-claim-flash 1.6s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .bb-ring { animation: none; }
        }
      `}</style>

            {/* ---------------- Header band ---------------- */}
            <div className="relative overflow-hidden px-6 pt-16 pb-14 sm:px-10">
                <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(216,15,15,0.25),transparent_70%)]" />


                <div className="relative mx-auto mt-10 flex max-w-6xl flex-col items-center text-center">
                    {/* <Trophy size={30} strokeWidth={1.3} className="mb-5 text-[#ff3b30]" /> */}
                    <h1 className="font-imperial text-[44px] leading-none tracking-wide sm:text-[64px]">
                        BOUNTY BOARD
                    </h1>
                    <p className="mt-4 max-w-lg text-sm tracking-[0.15em] text-white/50">
                        ACTIVE CONTRACTS RANKED BY PAYOUT — CLAIM A HUNT BEFORE ANOTHER PARTY GETS THERE FIRST
                    </p>
                </div>
            </div>

            <HunterCommendationsDemo />

            {/* ---------------- Red console panel ---------------- */}
            <div className="mx-auto max-w-6xl px-6 pb-10 sm:px-10">
                <div className="relative overflow-hidden rounded-sm border border-white/15 bg-[#b5130e] [background-image:radial-gradient(ellipse_90%_70%_at_25%_0%,rgba(255,255,255,0.14),transparent_60%)]">
                    <div className="flex items-center justify-between border-b border-white/15 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <ImperialSearch value={searchQuery} onValueChange={setSearchQuery} />
                            <Menu size={16} className="text-white/70" />
                        </div>
                        <span className="font-imperial text-lg tracking-wide">BOUNTY NET</span>
                        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-white/85">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-white bb-ring" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                            </span>
                            {activeCount} ACTIVE
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 px-6 py-10 sm:px-10 md:grid-cols-[auto_1fr]">
                        <div className="hidden items-center justify-center md:flex">
                            <span className="font-imperial -rotate-90 whitespace-nowrap text-xs tracking-[0.4em] text-white/70">
                                GALAXY-WIDE CONTRACTS
                            </span>
                        </div>

                        <div>
                            <div className="mb-6 min-h-[20px] font-mono text-[11px] tracking-[0.1em] text-white/70">
                                Scanning open contracts... Sorting by payout...
                            </div>

                            <h2 className="font-imperial text-[36px] leading-[0.95] sm:text-[52px]">
                                THE HUNT <span className="text-white/60">PAYS</span>
                                <br />
                                WELL
                            </h2>

                            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85">
                                Filter contracts by sector, sort by payout or threat rating,
                                and claim before a rival bounty hunter beats you to it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- Filters / sort ---------------- */}
            <div className="mx-auto max-w-6xl px-6 pb-8 sm:px-10">
                <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
                    {/* sector chips */}
                    <div className="flex flex-wrap gap-2">
                        {["ALL", ...SECTORS].map((s) => {
                            const active = sectorFilter === s;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSectorFilter(s)}
                                    className={`group relative overflow-hidden rounded-sm border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] transition-all duration-300 ${active
                                        ? "border-[#d80f0f] bg-[#d80f0f] text-white"
                                        : "border-white/12 text-white/50 hover:-translate-y-0.5 hover:border-[#d80f0f]/50 hover:text-white"
                                        }`}
                                    style={{
                                        boxShadow: active
                                            ? "0 0 20px -4px rgba(216,15,15,0.7), inset 0 0 0 1px rgba(255,255,255,0.15)"
                                            : "none",
                                    }}
                                >
                                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                                    {active && (
                                        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.8)]" />
                                    )}
                                    <span className="relative">
                                        {s === "ALL" ? "ALL SECTORS" : s}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* sort: sliding-pill segmented control */}
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
                            SORT
                        </span>
                        <LayoutGroup id="sort-control">
                            <div className="relative flex rounded-sm border border-white/12 bg-[#0a0a0a] p-1">
                                {(["PAYOUT", "THREAT"] as SortKey[]).map((k) => {
                                    const active = sort === k;
                                    return (
                                        <button
                                            key={k}
                                            type="button"
                                            onClick={() => setSort(k)}
                                            className="relative z-10 rounded-[3px] px-4 py-1.5 font-mono text-[11px] tracking-[0.1em] transition-colors duration-300"
                                            style={{
                                                color: active ? "#050505" : "rgba(255,255,255,0.45)",
                                            }}
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId="sort-pill"
                                                    className="absolute inset-0 -z-10 rounded-[3px] bg-white"
                                                    style={{
                                                        boxShadow: "0 0 18px -2px rgba(255,255,255,0.6)",
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                        damping: 35,
                                                    }}
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

            {/* ---------------- Bounty grid ---------------- */}
            <div className="mx-auto max-w-6xl px-6 pb-10 sm:px-10">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((b, i) => {
                            const claimed = b.status === "CLAIMED";
                            const color = THREAT_COLOR[b.threat];
                            return (
                                <motion.div
                                    key={b.id}
                                    layout
                                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -12, scale: 0.96 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: i * 0.04,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    <TiltCard>
                                        <div
                                            className={`group relative overflow-hidden rounded-sm border p-6 [transform-style:preserve-3d] ${claimed
                                                ? "border-white/8 bg-[#0a0a0a]/60"
                                                : "border-white/10 bg-[#0a0a0a] hover:border-[#d80f0f]/50"
                                                }`}
                                            style={{
                                                boxShadow: claimed
                                                    ? "none"
                                                    : `0 20px 50px -25px ${color}55`,
                                            }}
                                        >
                                            {/* corners */}
                                            {!claimed && (
                                                <>
                                                    <span className="absolute left-2.5 top-2.5 h-4 w-4 border-l border-t border-white/0 transition-colors duration-300 group-hover:border-white/50" />
                                                    <span className="absolute right-2.5 top-2.5 h-4 w-4 border-r border-t border-white/0 transition-colors duration-300 group-hover:border-white/50" />
                                                    <span className="absolute bottom-2.5 left-2.5 h-4 w-4 border-b border-l border-white/0 transition-colors duration-300 group-hover:border-white/50" />
                                                    <span className="absolute bottom-2.5 right-2.5 h-4 w-4 border-b border-r border-white/0 transition-colors duration-300 group-hover:border-white/50" />
                                                </>
                                            )}

                                            {/* ghost id */}
                                            <span className="font-imperial pointer-events-none absolute -bottom-8 -right-3 select-none text-[110px] leading-none text-white/[0.03]">
                                                {b.id.slice(-2).toUpperCase()}
                                            </span>

                                            <div className="relative flex items-start justify-between">
                                                <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-white/40">
                                                    <MapPin size={11} />
                                                    {b.sector}
                                                </span>
                                                <span
                                                    className="rounded-sm border px-2 py-1 font-mono text-[10px] tracking-[0.1em]"
                                                    style={{
                                                        borderColor: claimed
                                                            ? "rgba(255,255,255,0.15)"
                                                            : color,
                                                        color: claimed ? "rgba(255,255,255,0.4)" : color,
                                                    }}
                                                >
                                                    {claimed ? "CLAIMED" : "ACTIVE"}
                                                </span>
                                            </div>

                                            <div className="relative mt-6 flex h-14 w-14 items-center justify-center rounded-sm border border-white/10 bg-black/40">
                                                <Crosshair
                                                    size={22}
                                                    className={
                                                        claimed ? "text-white/25" : "text-white/70"
                                                    }
                                                />
                                            </div>

                                            <h3 className="font-imperial relative mt-5 text-2xl leading-tight text-white">
                                                {b.target}
                                            </h3>
                                            <p className="relative mt-1 font-mono text-[11px] tracking-[0.05em] text-white/40">
                                                {b.alias}
                                            </p>

                                            <div className="relative mt-4 flex items-center gap-1.5">
                                                <span className="font-mono text-[10px] tracking-[0.15em] text-white/30">
                                                    THREAT
                                                </span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((n) => (
                                                        <span
                                                            key={n}
                                                            className="h-2.5 w-1.5 rounded-[1px]"
                                                            style={{
                                                                background:
                                                                    n <= b.threat
                                                                        ? color
                                                                        : "rgba(255,255,255,0.08)",
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="relative mt-3 font-mono text-[10px] tracking-[0.05em] text-white/30">
                                                LAST SEEN · {b.lastSeen}
                                            </p>

                                            <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                                                <div className="flex items-center gap-1.5">
                                                    <Coins size={15} className="text-[#ffb020]" />
                                                    <span className="font-imperial text-xl tracking-wide text-[#ffb020]">
                                                        {b.payout.toLocaleString()}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={claimed}
                                                    onClick={() => claim(b.id)}
                                                    className={`group/btn inline-flex items-center gap-1.5 rounded-sm px-4 py-2 font-mono text-[11px] tracking-[0.1em] transition-all ${claimed
                                                        ? "cursor-not-allowed border border-white/10 text-white/25"
                                                        : "bg-[#d80f0f] text-white hover:bg-[#ff3b30]"
                                                        }`}
                                                >
                                                    {claimed ? (
                                                        <>
                                                            <Lock size={12} />
                                                            LOCKED
                                                        </>
                                                    ) : (
                                                        <>
                                                            CLAIM
                                                            <ChevronRight
                                                                size={12}
                                                                className="transition-transform group-hover/btn:translate-x-0.5"
                                                            />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </TiltCard>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                    <div className="rounded-sm border border-white/10 bg-[#0a0a0a] py-16 text-center font-mono text-[12px] tracking-[0.1em] text-white/30">
                        NO CONTRACTS FOUND IN THIS SECTOR
                    </div>
                )}

                <div className="mt-10 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setPostOpen(true)}
                        className="group inline-flex items-center gap-2 rounded-sm border border-white/15 bg-[#0a0a0a] px-7 py-3.5 font-imperial text-lg tracking-wide text-white transition-all hover:border-[#d80f0f]/60 hover:bg-[#d80f0f]"
                    >
                        <Plus
                            size={17}
                            className="transition-transform group-hover:rotate-90"
                        />
                        POST BOUNTY
                    </button>
                </div>
            </div>

            {/* ---------------- Post bounty modal ---------------- */}
            {postOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setPostOpen(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bb-modal-in relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-white/12 bg-[#0a0a0a] p-6 shadow-[0_0_60px_-15px_rgba(216,15,15,0.5)] sm:p-8"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-white/40">
                                <Terminal size={14} />
                                POST NEW CONTRACT
                            </div>
                            <button
                                type="button"
                                onClick={() => setPostOpen(false)}
                                className="rounded-sm p-1 text-white/40 transition-colors hover:text-white"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-white/40">
                                    TARGET DESIGNATION
                                </label>
                                <input
                                    value={target}
                                    onChange={(e) => {
                                        setTarget(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    placeholder="e.g. Rogue Consular"
                                    className="w-full rounded-sm border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#d80f0f]/70"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-white/40">
                                    KNOWN ALIAS (OPTIONAL)
                                </label>
                                <input
                                    value={alias}
                                    onChange={(e) => setAlias(e.target.value)}
                                    placeholder="e.g. Grey Veil"
                                    className="w-full rounded-sm border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#d80f0f]/70"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-white/40">
                                    SECTOR
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SECTORS.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setSector(s)}
                                            className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] transition-all ${sector === s
                                                ? "border-[#d80f0f] bg-[#d80f0f] text-white"
                                                : "border-white/12 text-white/50 hover:border-white/30 hover:text-white"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-white/40">
                                    THREAT LEVEL
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setThreat(n as 1 | 2 | 3 | 4 | 5)}
                                            className="flex h-9 w-9 items-center justify-center rounded-sm border font-mono text-[12px] transition-all"
                                            style={{
                                                borderColor:
                                                    n <= threat
                                                        ? THREAT_COLOR[threat]
                                                        : "rgba(255,255,255,0.12)",
                                                color:
                                                    n <= threat
                                                        ? THREAT_COLOR[threat]
                                                        : "rgba(255,255,255,0.35)",
                                                background:
                                                    n <= threat
                                                        ? `${THREAT_COLOR[threat]}1a`
                                                        : "transparent",
                                            }}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-white/40">
                                    PAYOUT (CREDITS)
                                </label>
                                <div className="relative">
                                    <Coins
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ffb020]"
                                    />
                                    <input
                                        value={payout}
                                        onChange={(e) => {
                                            setPayout(e.target.value.replace(/[^0-9]/g, ""));
                                            if (error) setError(null);
                                        }}
                                        placeholder="150000"
                                        inputMode="numeric"
                                        className="w-full rounded-sm border border-white/10 bg-black/40 p-3 pl-9 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#d80f0f]/70"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                            <div className="min-h-[16px] font-mono text-[11px] tracking-[0.1em] text-[#ff5c4d]">
                                {error}
                            </div>
                            <button
                                type="button"
                                onClick={submitBounty}
                                className="group inline-flex items-center gap-2 rounded-sm bg-[#d80f0f] px-6 py-3 font-imperial text-lg tracking-wide text-white transition-all hover:bg-[#ff3b30]"
                            >
                                POST CONTRACT
                                <Send
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}