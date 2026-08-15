"use client";

import { useState, useRef, useEffect } from "react";
import {
    Radio,
    Send,
    ShieldAlert,
    X,
    Menu,
    ChevronRight,
} from "lucide-react";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";
import HunterCommendationsDemo from "@/components/hunter-commendations";
import { ImperialSearch } from "@/components/imperial-search";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const SECTORS = [
    "OUTER RIM",
    "CORE WORLDS",
    "MID RIM",
    "COLONIES",
    "EXPANSION REGION",
    "UNKNOWN REGIONS",
    "WILD SPACE",
];

const PRIORITIES = [
    { id: "STANDARD", label: "STANDARD", color: "#8a8a8a" },
    { id: "URGENT", label: "URGENT", color: "#ffb020" },
    { id: "OMEGA", label: "OMEGA", color: "#ff3b30" },
] as const;

type Priority = (typeof PRIORITIES)[number]["id"];

const TEMPLATES = [
    { label: "Order 66 Reminder", text: "All garrisons are reminded: Jedi Order status remains ENEMY OF THE EMPIRE. Report sightings immediately." },
    { label: "Curfew Notice", text: "Sector-wide curfew in effect from local dusk to dawn. Non-compliance will be treated as insurgent activity." },
    { label: "Bounty Increase", text: "Bounty rates on confirmed Jedi targets have been increased by Imperial decree. Consult the Bounty Board for updated contracts." },
    { label: "Sighting Alert", text: "Unconfirmed lightsaber signature detected. All patrol units divert to last known coordinates immediately." },
];

type LogStatus = "SENT" | "QUEUED";

interface BroadcastEntry {
    id: string;
    message: string;
    sectors: string[];
    priority: Priority;
    status: LogStatus;
    timestamp: string;
}

const INITIAL_LOG: BroadcastEntry[] = [
    {
        id: "tx-881",
        message: "ORDER 66 ENFORCEMENT DIRECTIVE: All sectors report status on target suppression.",
        sectors: ["OUTER RIM", "MID RIM"],
        priority: "OMEGA",
        status: "SENT",
        timestamp: "04:12 GCT",
    },
    {
        id: "tx-874",
        message: "SYNDICATE RECRUITMENT WARNING: Intercepted transmissions indicate cell movement in Coruscant lower levels.",
        sectors: ["CORE WORLDS"],
        priority: "URGENT",
        status: "SENT",
        timestamp: "02:44 GCT",
    },
    {
        id: "tx-860",
        message: "ROUTINE PATROL COMMUNIQUE: Standard orbital scans completed for Expansion Region.",
        sectors: ["EXPANSION REGION"],
        priority: "STANDARD",
        status: "SENT",
        timestamp: "22:15 GCT",
    },
];

const UPLINK_STEPS = [
    "ENCRYPTING PAYLOAD (AES-512)...",
    "ACQUIRING HOLONET RELAY NODE...",
    "HANDSHAKE CONFIRMED — BROADCASTING...",
    "TRANSMISSION COMPLETE.",
];

export default function BroadcastConsole() {
    const [composeOpen, setComposeOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSectors, setSelectedSectors] = useState<string[]>(["OUTER RIM"]);
    const [priority, setPriority] = useState<Priority>("STANDARD");
    const [transmitting, setTransmitting] = useState(false);
    const [logLines, setLogLines] = useState<string[]>([]);
    const [log, setLog] = useState<BroadcastEntry[]>(INITIAL_LOG);
    const [error, setError] = useState<string | null>(null);
    const [highlightId, setHighlightId] = useState<string | null>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logLines]);

    useEffect(() => {
        if (!composeOpen) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape" && !transmitting) setComposeOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [composeOpen, transmitting]);

    function toggleSector(sector: string) {
        setSelectedSectors((prev) =>
            prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
        );
    }

    function applyTemplate(text: string) {
        setMessage(text);
        setError(null);
    }

    function handleTransmit() {
        if (!message.trim()) {
            setError("MESSAGE PAYLOAD REQUIRED");
            return;
        }
        if (selectedSectors.length === 0) {
            setError("SELECT AT LEAST ONE SECTOR");
            return;
        }
        setError(null);
        setTransmitting(true);
        setLogLines([]);

        UPLINK_STEPS.forEach((line, i) => {
            setTimeout(() => {
                setLogLines((prev) => [...prev, line]);
                if (i === UPLINK_STEPS.length - 1) {
                    setTimeout(() => {
                        const id = Math.random().toString(36).slice(2, 8);
                        const entry: BroadcastEntry = {
                            id,
                            message: message.trim(),
                            sectors: selectedSectors,
                            priority,
                            status: "SENT",
                            timestamp:
                                new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + " GCT",
                        };
                        setLog((prev) => [entry, ...prev]);
                        setTransmitting(false);
                        setMessage("");
                        setLogLines([]);
                        setComposeOpen(false);
                        setHighlightId(id);
                        setTimeout(() => setHighlightId(null), 2200);
                    }, 500);
                }
            }, i * 550);
        });
    }

    const filteredLog = searchQuery.trim()
        ? log.filter(
            (e) =>
                e.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.sectors.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : log;

    return (
        <section className="w-full bg-[#050505] text-white min-h-screen">
            <style>{`
        .font-imperial {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
        }
        @keyframes bc-pulse {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(3); opacity: 0; }
        }
        .bc-ring { animation: bc-pulse 2.4s ease-out infinite; }

        @keyframes bc-fade-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .bc-modal-in { animation: bc-fade-in 0.25s ease-out; }

        @keyframes bc-row-flash {
          0% { background-color: rgba(216,15,15,0.22); box-shadow: inset 0 0 0 1px rgba(216,15,15,0.6); }
          100% { background-color: transparent; box-shadow: inset 0 0 0 1px rgba(216,15,15,0); }
        }
        .bc-row-highlight { animation: bc-row-flash 2.2s ease-out; }

        @keyframes bc-status-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .bc-status-dot { animation: bc-status-glow 1.8s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .bc-ring, .bc-status-dot { animation: none; }
        }
      `}</style>

            {/* ---------------- Header band ---------------- */}
            <div className="relative overflow-hidden px-6 pt-24 pb-14 sm:px-10">
                <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(216,15,15,0.25),transparent_70%)]" />

                <div className="relative mx-auto mt-10 flex max-w-6xl flex-col items-center text-center">
                    <h1 className="font-imperial text-[44px] leading-none tracking-wide sm:text-[64px]">
                        BROADCAST CONSOLE
                    </h1>
                    <p className="mt-4 max-w-lg text-sm tracking-[0.15em] text-white/50">
                        DRAFT AND TRANSMIT IMPERIAL MESSAGING ACROSS OCCUPIED SECTORS
                    </p>
                </div>
            </div>

            {/* ---------------- Red console panel ---------------- */}
            <div className="mx-auto max-w-6xl px-6 pb-10 sm:px-10">
                <div className="relative overflow-hidden rounded-sm border border-white/15 bg-[#b5130e] [background-image:radial-gradient(ellipse_90%_70%_at_25%_0%,rgba(255,255,255,0.14),transparent_60%)]">
                    <div className="flex items-center justify-between border-b border-white/15 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <ImperialSearch value={searchQuery} onValueChange={setSearchQuery} placeholder="SEARCH BROADCASTS..." />
                            <Menu size={16} className="text-white/70" />
                        </div>
                        <span className="font-imperial text-lg tracking-wide">IMPERIAL COMMS</span>
                        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-white/85">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-white bc-ring" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                            </span>
                            UPLINK ACTIVE
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 px-6 py-10 sm:px-10 md:grid-cols-[auto_1fr]">
                        <div className="hidden items-center justify-center md:flex">
                            <span className="font-imperial -rotate-90 whitespace-nowrap text-xs tracking-[0.4em] text-white/70">
                                SECTOR-WIDE TRANSMISSION
                            </span>
                        </div>

                        <div>
                            <div className="mb-6 min-h-[20px] font-mono text-[11px] tracking-[0.1em] text-white/70">
                                Power on... Uplink standing by... Awaiting payload...
                            </div>

                            <h2 className="font-imperial text-[36px] leading-[0.95] sm:text-[52px]">
                                COMPLIANCE IS <span className="text-white/60">NOT</span>
                                <br />
                                OPTIONAL
                            </h2>

                            <div className="mt-6 flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setComposeOpen(true)}
                                    className="group inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 font-imperial text-lg tracking-wide text-[#050505] transition-all hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                >
                                    NEW TRANSMISSION
                                    <Send size={16} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Velocity Ticker */}
            <div className="relative w-full overflow-hidden border-y border-red-950/60 bg-[#050505] py-4 my-8">
                <ScrollBasedVelocity
                    text="BROADCAST CONSOLE • TRANSMITTING ACROSS SECTORS • ORDER 66 ENFORCED • CLEARANCE OMEGA • "
                    default_velocity={2}
                    className="font-mono text-2xl font-bold uppercase tracking-[0.2em] text-[#ff3b30]/85 drop-shadow-[0_0_15px_rgba(216,15,15,0.6)] sm:text-3xl"
                />
            </div>

            {/* ---------------- Transmission log ---------------- */}
            <div className="mx-auto max-w-6xl px-6 pb-12 sm:px-10">
                <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-6">
                    <div>
                        <h3 className="font-imperial text-[40px] leading-none tracking-wide sm:text-[52px]">
                            TRANSMISSION LOG
                        </h3>
                        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-white/35">
                            {filteredLog.length} RECORDS ON FILE · HOLONET RELAY NETWORK
                        </p>
                    </div>
                    <span className="hidden font-mono text-[10px] tracking-[0.2em] text-white/25 sm:block">
                        LIVE
                    </span>
                </div>

                <div className="divide-y divide-white/8 rounded-sm border border-white/10 bg-[#0a0a0a]">
                    {filteredLog.map((entry) => {
                        const meta = PRIORITIES.find((p) => p.id === entry.priority)!;
                        const isNew = entry.id === highlightId;
                        return (
                            <div
                                key={entry.id}
                                className={`group relative flex flex-col gap-4 overflow-hidden px-6 py-6 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7 ${isNew ? "bc-row-highlight" : ""
                                    }`}
                            >
                                <span className="absolute inset-y-0 left-0 w-[3px] scale-y-0 bg-[#d80f0f] transition-transform duration-300 group-hover:scale-y-100" />

                                <div className="flex min-w-0 items-start gap-4 pl-2">
                                    <div
                                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border"
                                        style={{
                                            borderColor: `${meta.color}40`,
                                            background: `${meta.color}15`,
                                            color: meta.color,
                                        }}
                                    >
                                        <Radio size={16} />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-white/40">
                                            <span>{entry.timestamp}</span>
                                            <span>·</span>
                                            <span className="uppercase" style={{ color: meta.color }}>
                                                {entry.priority}
                                            </span>
                                        </div>
                                        <p className="mt-1 font-sans text-sm leading-relaxed text-white/90">
                                            {entry.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 pl-2 sm:pl-0">
                                    {entry.sectors.map((sec) => (
                                        <span
                                            key={sec}
                                            className="rounded-sm border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-white/60"
                                        >
                                            {sec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hunter Commendations Section */}
            <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
                <HunterCommendationsDemo />
            </div>

            {/* ---------------- Compose Modal ---------------- */}
            {composeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => !transmitting && setComposeOpen(false)}
                    />

                    <div className="bc-modal-in relative w-full max-w-2xl rounded-sm border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl sm:p-8">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[#ff3b30]">
                                <Radio size={14} className="bc-status-dot" />
                                NEW IMPERIAL BROADCAST
                            </div>
                            <button
                                type="button"
                                onClick={() => !transmitting && setComposeOpen(false)}
                                disabled={transmitting}
                                className="text-white/40 hover:text-white disabled:opacity-30"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Templates */}
                        <div className="mt-6">
                            <label className="block font-mono text-[10px] tracking-[0.15em] text-white/40 uppercase mb-2">
                                PRESET DIRECTIVES
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t.label}
                                        type="button"
                                        onClick={() => applyTemplate(t.text)}
                                        className="rounded-sm border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] text-white/70 hover:border-red-500/50 hover:text-white transition"
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message payload */}
                        <div className="mt-6">
                            <label className="block font-mono text-[10px] tracking-[0.15em] text-white/40 uppercase mb-2">
                                TRANSMISSION PAYLOAD
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                disabled={transmitting}
                                placeholder="ENTER BROADCAST TEXT..."
                                rows={4}
                                className="w-full rounded-sm border border-white/15 bg-black/60 p-3 font-mono text-xs tracking-wider text-white placeholder-white/30 outline-none focus:border-red-500/60"
                            />
                        </div>

                        {/* Sectors selection */}
                        <div className="mt-6">
                            <label className="block font-mono text-[10px] tracking-[0.15em] text-white/40 uppercase mb-2">
                                TARGET SECTORS
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {SECTORS.map((sec) => {
                                    const active = selectedSectors.includes(sec);
                                    return (
                                        <button
                                            key={sec}
                                            type="button"
                                            onClick={() => toggleSector(sec)}
                                            className={`rounded-sm border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] transition-all ${active
                                                ? "border-red-500 bg-red-600/20 text-white"
                                                : "border-white/10 bg-white/5 text-white/40 hover:text-white"
                                                }`}
                                        >
                                            {sec}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Priority selection */}
                        <div className="mt-6">
                            <label className="block font-mono text-[10px] tracking-[0.15em] text-white/40 uppercase mb-2">
                                CLEARANCE PRIORITY
                            </label>
                            <div className="flex gap-2">
                                {PRIORITIES.map((p) => {
                                    const active = priority === p.id;
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setPriority(p.id)}
                                            className="flex items-center gap-2 rounded-sm border px-4 py-2 font-mono text-[11px] tracking-[0.1em] transition-all"
                                            style={{
                                                borderColor: active ? p.color : "rgba(255,255,255,0.12)",
                                                color: active ? p.color : "rgba(255,255,255,0.5)",
                                                background: active ? `${p.color}1a` : "transparent",
                                            }}
                                        >
                                            <ShieldAlert size={13} />
                                            {p.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {transmitting && (
                            <div className="mt-6 space-y-1 rounded-sm border border-white/10 bg-black/40 p-4 font-mono text-[11px] tracking-[0.1em] text-white/70">
                                {logLines.map((line, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <ChevronRight size={11} className="shrink-0" />
                                        {line}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                            <div className="min-h-[16px] font-mono text-[11px] tracking-[0.1em] text-[#ff5c4d]">
                                {error}
                            </div>
                            <button
                                type="button"
                                onClick={handleTransmit}
                                disabled={transmitting}
                                className="group inline-flex items-center gap-2 rounded-sm bg-[#d80f0f] px-6 py-3 font-imperial text-lg tracking-wide text-white transition-all hover:bg-[#ff3b30] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {transmitting ? "TRANSMITTING..." : "TRANSMIT"}
                                <Send size={16} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}