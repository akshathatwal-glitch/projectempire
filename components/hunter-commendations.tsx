"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Crosshair,
    Radar,
    ShieldAlert,
    Skull,
    Target,
    Flame,
    ArrowLeft,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  cn() fallback — swap for your own "@/lib/utils" import if you      */
/*  already have shadcn's cn(clsx + tailwind-merge) set up.            */
/* ------------------------------------------------------------------ */
function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export type Commendation = {
    quote: string;
    name: string;
    designation: string;
    icon: LucideIcon;
    threatLevel?: string;
};

// deterministic "random" tilt so cards don't jitter on every re-render
function useTilts(count: number) {
    return useMemo(
        () => Array.from({ length: count }, (_, i) => ((i * 37) % 17) - 8),
        [count]
    );
}

export function HunterCommendations({
    entries,
    autoplay = false,
    className,
}: {
    entries: Commendation[];
    autoplay?: boolean;
    className?: string;
}) {
    const [active, setActive] = useState(0);
    const n = entries.length;
    const tilts = useTilts(n);

    const next = () => setActive((p) => (p + 1) % n);
    const prev = () => setActive((p) => (p - 1 + n) % n);
    const isActive = (i: number) => i === active;

    // shortest circular distance from `active`, e.g. -2 -1 0 1 2
    const diffFromActive = (i: number) => {
        let d = i - active;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        return d;
    };

    useEffect(() => {
        if (!autoplay) return;
        const id = setInterval(next, 5000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoplay]);

    return (
        <section className={cn("relative w-full overflow-hidden bg-[#050505] text-white", className)}>
            <style>{`
        .font-imperial {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
        }
        @keyframes umbra-scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 48px; }
        }
        @keyframes umbra-flicker {
          0%, 92%, 100% { opacity: 1; }
          93% { opacity: 0.4; }
          95% { opacity: 0.85; }
          96% { opacity: 0.3; }
          97% { opacity: 1; }
        }
        .umbra-flicker { animation: umbra-flicker 4.5s infinite; }
      `}</style>

            {/* ambient grain, sits over the whole section */}
            <div
                className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            <div className="relative z-[2] mx-auto max-w-6xl px-6 py-16 sm:px-10">
                <div className="mb-10 flex items-center justify-between font-mono text-[11px] tracking-[0.3em] text-white/40">
                    <span>FIELD REPORTS</span>
                    <span className="text-[#ff3b30]/60">
                        {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
                    {/* fanned icon deck */}
                    <div className="relative h-72 w-full sm:h-80">
                        {entries.map((entry, index) => {
                            const Icon = entry.icon;
                            const diff = diffFromActive(index);
                            const abs = Math.abs(diff);
                            const cardIsActive = isActive(index);

                            // only render nearby cards, keeps the fan from getting cluttered
                            if (abs > 2) return null;

                            return (
                                <motion.div
                                    key={entry.name}
                                    animate={{
                                        x: diff * 42,
                                        y: cardIsActive ? [0, -20, 0] : abs * 6,
                                        scale: cardIsActive ? 1 : 1 - abs * 0.1,
                                        rotate: cardIsActive ? 0 : tilts[index] + diff * 4,
                                        opacity: cardIsActive ? 1 : Math.max(0.18, 0.55 - abs * 0.18),
                                        zIndex: cardIsActive ? 40 : 20 - abs,
                                    }}
                                    transition={{ duration: 0.45, ease: "easeInOut" }}
                                    className="absolute inset-0 flex origin-bottom items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-[#0a0a0a]"
                                    style={{
                                        boxShadow: cardIsActive
                                            ? "0 30px 60px -25px rgba(216,15,15,0.45), inset 0 0 0 1px rgba(255,59,48,0.25)"
                                            : "none",
                                    }}
                                >
                                    {/* scanline sweep */}
                                    {cardIsActive && (
                                        <div
                                            className="pointer-events-none absolute inset-0 opacity-[0.12]"
                                            style={{
                                                backgroundImage:
                                                    "repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 4px)",
                                                animation: "umbra-scan 5s linear infinite",
                                            }}
                                        />
                                    )}

                                    {/* radar sweep */}
                                    {cardIsActive && (
                                        <motion.div
                                            className="pointer-events-none absolute inset-0 opacity-40"
                                            style={{
                                                background:
                                                    "conic-gradient(from 0deg, transparent 0deg, rgba(255,59,48,0.55) 12deg, transparent 45deg)",
                                            }}
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                                        />
                                    )}

                                    {/* classified stamp on the recessed cards */}
                                    {!cardIsActive && abs <= 1 && (
                                        <span className="pointer-events-none absolute rotate-[-14deg] select-none border-2 border-[#ff3b30]/25 px-3 py-1 font-mono text-[9px] tracking-[0.3em] text-[#ff3b30]/25">
                                            CLASSIFIED
                                        </span>
                                    )}

                                    {/* corner brackets, active card only */}
                                    {cardIsActive && (
                                        <>
                                            <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-[#ff3b30]/60" />
                                            <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-[#ff3b30]/60" />
                                            <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-[#ff3b30]/60" />
                                            <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[#ff3b30]/60" />
                                        </>
                                    )}

                                    <span className="font-imperial pointer-events-none absolute -bottom-6 -right-2 select-none text-[130px] leading-none text-white/[0.04]">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {/* pulsing threat ring behind the icon */}
                                    {cardIsActive && (
                                        <motion.div
                                            className="absolute h-28 w-28 rounded-full border border-[#ff3b30]/40"
                                            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                                        />
                                    )}

                                    <Icon
                                        size={64}
                                        strokeWidth={1}
                                        className={cn(
                                            cardIsActive ? "text-[#ff3b30] umbra-flicker" : "text-white/25"
                                        )}
                                    />

                                    {/* threat badge, active card only */}
                                    {cardIsActive && (
                                        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-sm border border-[#ff3b30]/40 bg-black/70 px-2 py-1 font-mono text-[9px] tracking-widest text-[#ff3b30]">
                                            <Flame size={10} strokeWidth={2} />
                                            {entry.threatLevel ?? "HIGH THREAT"}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* text side */}
                    <div className="flex flex-col justify-between py-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                exit={{ y: -16, opacity: 0, filter: "blur(6px)" }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                            >
                                <h3 className="font-imperial text-2xl tracking-wide text-white">
                                    {entries[active].name}
                                </h3>

                                <motion.p
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
                                    className="mt-1 font-mono text-[11px] tracking-[0.1em] text-[#d80f0f]"
                                >
                                    {entries[active].designation}
                                </motion.p>

                                <p className="mt-8 text-[15px] leading-relaxed text-white/60">
                                    {entries[active].quote.split(" ").map((word, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                                            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25, ease: "easeOut", delay: 0.15 + 0.018 * i }}
                                            className="inline-block"
                                        >
                                            {word}&nbsp;
                                        </motion.span>
                                    ))}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-12 flex items-center gap-3 pt-4 md:mt-0">
                            <motion.button
                                type="button"
                                onClick={prev}
                                aria-label="Previous report"
                                whileHover={{
                                    scale: 1.08,
                                    boxShadow: "0 0 26px rgba(216,15,15,0.55)",
                                }}
                                whileTap={{ scale: 0.9 }}
                                className="group/btn relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm border border-white/15 bg-[#0a0a0a] transition-colors hover:border-[#ff3b30]/70 hover:bg-[#1a0505]"
                            >
                                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ff3b30]/25 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
                                <ArrowLeft
                                    size={15}
                                    className="relative text-white/60 transition-transform group-hover/btn:-translate-x-0.5 group-hover/btn:text-[#ff3b30]"
                                />
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={next}
                                aria-label="Next report"
                                whileHover={{
                                    scale: 1.08,
                                    boxShadow: "0 0 26px rgba(216,15,15,0.55)",
                                }}
                                whileTap={{ scale: 0.9 }}
                                className="group/btn relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm border border-white/15 bg-[#0a0a0a] transition-colors hover:border-[#ff3b30]/70 hover:bg-[#1a0505]"
                            >
                                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ff3b30]/25 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
                                <ArrowRight
                                    size={15}
                                    className="relative text-white/60 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:text-[#ff3b30]"
                                />
                            </motion.button>

                            <div className="ml-2 flex gap-1.5">
                                {entries.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActive(i)}
                                        aria-label={`Go to report ${i + 1}`}
                                        className="h-1 w-5 rounded-[1px] transition-all duration-300"
                                        style={{
                                            background: i === active ? "#d80f0f" : "rgba(255,255,255,0.12)",
                                            boxShadow: i === active ? "0 0 8px rgba(216,15,15,0.8)" : "none",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Demo instance — drop this above the bounty filter bar              */
/* ------------------------------------------------------------------ */
export default function HunterCommendationsDemo() {
    const entries: Commendation[] = [
        {
            quote:
                "Tracked the target through three jump points before the trail went cold near the Corellian run. Recommend increasing the bounty — this one knows how to disappear.",
            name: "Vantiss Kray",
            designation: "Bounty Hunter · Outer Rim Registry",
            icon: Radar,
            threatLevel: "ELUSIVE",
        },
        {
            quote:
                "Confirmed lightsaber signature at close range. Target evaded capture but sustained damage. Contract remains open pending relocation.",
            name: "ISB Agent Dorne",
            designation: "Imperial Security Bureau · Field Division",
            icon: Crosshair,
            threatLevel: "ARMED",
        },
        {
            quote:
                "Contract closed. Target apprehended without incident. Recommend this office for future high-threat assignments.",
            name: "Sull Marrec",
            designation: "Independent Contractor · Guild Registered",
            icon: Skull,
            threatLevel: "TERMINATED",
        },
        {
            quote:
                "Surveillance confirms the target is coordinating with known sympathizers. Escalating threat classification and notifying regional command.",
            name: "Commander Yarik Thess",
            designation: "Imperial Garrison · Mid Rim Command",
            icon: ShieldAlert,
            threatLevel: "ESCALATED",
        },
        {
            quote:
                "Payout received in full. Target's last known associates are now under watch. Filing follow-up contracts shortly.",
            name: "Renna Osk",
            designation: "Bounty Hunter · Guild Registered",
            icon: Target,
            threatLevel: "MONITORED",
        },
    ];

    return <HunterCommendations entries={entries} />;
}