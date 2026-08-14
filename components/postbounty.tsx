"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, X, Send, Skull, Coins } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Config — swap for your real constants                              */
/* ------------------------------------------------------------------ */
const SECTORS = ["OUTER RIM", "MID RIM", "CORE WORLDS", "WILD SPACE", "UNKNOWN REGIONS"];

const ACCENT = "#d80f0f";
const ACCENT_BRIGHT = "#ff3b30";

const THREAT_TIER: Record<number, string> = {
    1: "MINIMAL",
    2: "LOW",
    3: "MODERATE",
    4: "HIGH",
    5: "EXTREME",
};

type Threat = 1 | 2 | 3 | 4 | 5;

/* ------------------------------------------------------------------ */
/*  Post Bounty Modal                                                  */
/* ------------------------------------------------------------------ */
export function PostBountyModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [target, setTarget] = useState("");
    const [alias, setAlias] = useState("");
    const [sector, setSector] = useState(SECTORS[0]);
    const [threat, setThreat] = useState<Threat>(3);
    const [payout, setPayout] = useState("");
    const [error, setError] = useState<string | null>(null);

    const submitBounty = () => {
        if (!target.trim()) return setError("TARGET DESIGNATION REQUIRED");
        if (!payout || Number(payout) <= 0) return setError("ENTER A VALID PAYOUT");
        setError(null);
        // hand off to your real submit handler here
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 14, scale: 0.97 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-sm border border-white/12 bg-[#0a0a0a]"
                    >
                        <style>{`
              .font-imperial {
                font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
                font-weight: 400;
              }
              @keyframes umbra-breathe {
                0%, 100% { box-shadow: 0 0 70px -20px rgba(216,15,15,0.35), inset 0 0 0 1px rgba(255,59,48,0.15); }
                50% { box-shadow: 0 0 95px -15px rgba(216,15,15,0.6), inset 0 0 0 1px rgba(255,59,48,0.3); }
              }
              .umbra-breathe { animation: umbra-breathe 3.2s ease-in-out infinite; }
              @keyframes umbra-scan-y {
                0% { background-position: 0 0; }
                100% { background-position: 0 60px; }
              }
              .umbra-slider {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 6px;
                background: transparent;
                outline: none;
                cursor: pointer;
              }
              .umbra-slider::-webkit-slider-runnable-track { height: 6px; background: transparent; }
              .umbra-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                margin-top: -7px;
                border-radius: 50%;
                background: #ff3b30;
                border: 2px solid #fff;
                box-shadow: 0 0 16px 3px rgba(255,59,48,0.75);
                transition: transform 0.15s ease;
              }
              .umbra-slider::-webkit-slider-thumb:hover { transform: scale(1.18); }
              .umbra-slider::-moz-range-track { height: 6px; background: transparent; }
              .umbra-slider::-moz-range-thumb {
                width: 20px; height: 20px; border-radius: 50%;
                background: #ff3b30; border: 2px solid #fff;
                box-shadow: 0 0 16px 3px rgba(255,59,48,0.75);
              }
            `}</style>

                        {/* ambient breathing red glow around the whole panel */}
                        <div className="umbra-breathe pointer-events-none absolute inset-0 z-0" />

                        {/* grain */}
                        <div
                            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05] mix-blend-overlay"
                            style={{
                                backgroundImage:
                                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                            }}
                        />

                        {/* drifting scanlines */}
                        <div
                            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06]"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 4px)",
                                animation: "umbra-scan-y 6s linear infinite",
                            }}
                        />

                        {/* giant faint skull watermark */}
                        <Skull
                            size={340}
                            strokeWidth={0.6}
                            className="pointer-events-none absolute -bottom-16 -right-20 z-[1] rotate-[8deg] text-white/[0.035]"
                        />

                        {/* corner brackets */}
                        <span className="pointer-events-none absolute left-3 top-3 z-[2] h-4 w-4 border-l border-t border-[#ff3b30]/40" />
                        <span className="pointer-events-none absolute right-3 top-3 z-[2] h-4 w-4 border-r border-t border-[#ff3b30]/40" />
                        <span className="pointer-events-none absolute bottom-3 left-3 z-[2] h-4 w-4 border-b border-l border-[#ff3b30]/40" />
                        <span className="pointer-events-none absolute bottom-3 right-3 z-[2] h-4 w-4 border-b border-r border-[#ff3b30]/40" />

                        {/* hazard stripe bar */}
                        <div
                            className="relative z-[2] h-1.5 w-full"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(-45deg, #d80f0f 0px, #d80f0f 10px, #0a0a0a 10px, #0a0a0a 20px)",
                            }}
                        />

                        <div className="relative z-[2] max-h-[calc(90vh-6px)] overflow-y-auto p-6 sm:p-8">
                            <div className="mb-1 flex items-center justify-between">
                                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-white/50">
                                    <Terminal size={14} />
                                    POST NEW CONTRACT
                                </div>
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="rounded-sm p-1 text-white/40 transition-colors hover:text-[#ff3b30]"
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </motion.button>
                            </div>
                            <p className="mb-6 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.3em] text-[#ff3b30]/70">
                                <Skull size={10} />
                                IMPERIAL AUTHORIZATION REQUIRED
                            </p>

                            <div className="space-y-6">
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
                                        {SECTORS.map((s) => {
                                            const selected = sector === s;
                                            return (
                                                <motion.button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setSector(s)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.94 }}
                                                    animate={
                                                        selected
                                                            ? { boxShadow: "0 0 18px 1px rgba(216,15,15,0.55)" }
                                                            : { boxShadow: "0 0 0px 0px rgba(216,15,15,0)" }
                                                    }
                                                    className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] transition-colors duration-200 ${selected
                                                            ? "border-[#ff3b30] bg-[#d80f0f] text-white"
                                                            : "border-white/12 text-white/50 hover:border-white/35 hover:text-white"
                                                        }`}
                                                >
                                                    {s}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2.5 flex items-center justify-between">
                                        <label className="font-mono text-[11px] tracking-[0.2em] text-white/40">
                                            THREAT LEVEL
                                        </label>
                                        <motion.span
                                            key={threat}
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="font-mono text-[11px] font-bold tracking-[0.15em]"
                                            style={{ color: ACCENT_BRIGHT }}
                                        >
                                            {THREAT_TIER[threat]} ({threat}/5)
                                        </motion.span>
                                    </div>

                                    {/* Smooth Custom Progress Bar + Slider Container */}
                                    <div className="relative py-2 select-none">
                                        {/* Background Track with Click-to-Jump */}
                                        <div
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const clickX = e.clientX - rect.left;
                                                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                                                const newThreat = (Math.round(pct * 4) + 1) as Threat;
                                                setThreat(newThreat);
                                            }}
                                            className="relative h-3 w-full cursor-pointer overflow-hidden rounded-full border border-white/15 bg-white/10 p-0.5"
                                        >
                                            {/* Animated Progress Fill */}
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{
                                                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BRIGHT})`,
                                                    boxShadow: `0 0 16px 2px ${ACCENT_BRIGHT}cc`,
                                                }}
                                                animate={{ width: `${((threat - 1) / 4) * 100}%` }}
                                                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                            />
                                        </div>

                                        {/* Native Range Slider Overlay for smooth dragging */}
                                        <input
                                            type="range"
                                            min={1}
                                            max={5}
                                            step={1}
                                            value={threat}
                                            onChange={(e) => setThreat(Number(e.target.value) as Threat)}
                                            className="umbra-slider absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                        />

                                        {/* Step Nodes / Markers along the track for tactile feel */}
                                        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-0.5">
                                            {[1, 2, 3, 4, 5].map((n) => {
                                                const active = n <= threat;
                                                const isCurrent = n === threat;
                                                return (
                                                    <motion.div
                                                        key={n}
                                                        animate={{
                                                            scale: isCurrent ? 1.4 : 1,
                                                            backgroundColor: isCurrent ? "#ffffff" : active ? ACCENT_BRIGHT : "#333333",
                                                            boxShadow: isCurrent ? `0 0 12px 3px ${ACCENT_BRIGHT}` : "none",
                                                        }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                        className="h-3 w-3 rounded-full border border-black/80"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* skull rating — quick-select buttons with spring bounce feedback */}
                                    <div className="mt-3 flex items-center justify-between px-1">
                                        {[1, 2, 3, 4, 5].map((n) => {
                                            const filled = n <= threat;
                                            const isSelected = n === threat;
                                            return (
                                                <motion.button
                                                    key={n}
                                                    type="button"
                                                    onClick={() => setThreat(n as Threat)}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.85 }}
                                                    animate={{ scale: isSelected ? 1.15 : 1 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                    aria-label={`Set threat level ${n}`}
                                                    className="flex flex-col items-center gap-1 p-1.5 focus:outline-none"
                                                >
                                                    <Skull
                                                        size={20}
                                                        strokeWidth={isSelected ? 2 : 1.5}
                                                        className="transition-colors duration-200"
                                                        style={{
                                                            color: filled ? ACCENT_BRIGHT : "rgba(255,255,255,0.2)",
                                                            filter: filled
                                                                ? `drop-shadow(0 0 8px ${ACCENT_BRIGHT}dd)`
                                                                : "none",
                                                        }}
                                                    />
                                                    <span className="font-mono text-[9px] tracking-wider text-white/40">
                                                        L{n}
                                                    </span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-white/40">
                                        PAYOUT (CREDITS)
                                    </label>
                                    <div className="relative">
                                        <Coins
                                            size={14}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
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
                                <motion.div
                                    key={error ?? "no-error"}
                                    initial={error ? { x: -6 } : false}
                                    animate={error ? { x: [-6, 6, -4, 4, 0] } : {}}
                                    transition={{ duration: 0.35 }}
                                    className="min-h-[16px] font-mono text-[11px] tracking-[0.1em] text-[#ff5c4d]"
                                >
                                    {error}
                                </motion.div>
                                <motion.button
                                    type="button"
                                    onClick={submitBounty}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-sm bg-[#d80f0f] px-6 py-3 font-imperial text-lg tracking-wide text-white transition-colors hover:bg-[#ff3b30]"
                                >
                                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                                    POST CONTRACT
                                    <Send size={16} className="transition-transform group-hover:translate-x-1" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ------------------------------------------------------------------ */
/*  Demo                                                                */
/* ------------------------------------------------------------------ */
export default function PostBountyModalDemo() {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex min-h-[300px] items-center justify-center bg-[#050505]">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="border border-white/15 bg-[#0a0a0a] px-6 py-3 font-mono text-xs tracking-[0.2em] text-white hover:border-[#ff3b30]/70"
            >
                POST BOUNTY
            </button>
            <PostBountyModal open={open} onClose={() => setOpen(false)} />
        </div>
    );
}