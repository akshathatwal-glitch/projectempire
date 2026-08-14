"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { MapPin, Crosshair, Check, Plus } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types — swap for your real Bounty type / data source               */
/* ------------------------------------------------------------------ */
export type Bounty = {
    id: string;
    sector: string;
    status: "ACTIVE" | "CLAIMED";
    threat: 1 | 2 | 3 | 4 | 5;
    target: string;
    alias: string;
    lastSeen: string;
    payout: number;
};

const ACCENT = "#d80f0f";
const ACCENT_BRIGHT = "#ff3b30";
const SUCCESS = "#2ecc71";

const THREAT_TIER: Record<number, string> = {
    1: "MINIMAL",
    2: "LOW",
    3: "MODERATE",
    4: "HIGH",
    5: "EXTREME",
};

/* ------------------------------------------------------------------ */
/*  TiltCard — light parallax tilt on mouse move                       */
/* ------------------------------------------------------------------ */
export function TiltCard({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 220, damping: 22 });
    const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 220, damping: 22 });

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const onLeave = () => {
        mx.set(0);
        my.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ rotateX: rX, rotateY: rY, transformPerspective: 900 }}
        >
            {children}
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Bounty card                                                        */
/* ------------------------------------------------------------------ */
export function BountyCard({ b, onClaim }: { b: Bounty; onClaim: (id: string) => void }) {
    const claimed = b.status === "CLAIMED";
    const [hover, setHover] = useState(false);
    const threatPct = (b.threat / 5) * 100;

    return (
        <TiltCard>
            <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={`group relative overflow-hidden border p-7 transition-colors duration-300 [transform-style:preserve-3d] ${claimed ? "border-white/8 bg-[#0a0a0a]/50" : "border-white/12 bg-[#0a0a0a] hover:border-white/25"
                    }`}
                style={{
                    boxShadow: !claimed && hover ? `0 24px 60px -30px ${ACCENT}88` : "none",
                }}
            >
                {/* thin accent line, grows in on hover */}
                <motion.span
                    className="absolute left-0 top-0 h-[2px] bg-[#ff3b30]"
                    initial={{ width: "0%" }}
                    animate={{ width: !claimed && hover ? "100%" : "0%" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                />

                {/* ghost id watermark */}
                <span className="font-imperial pointer-events-none absolute -bottom-8 -right-3 select-none text-[110px] leading-none text-white/[0.03]">
                    {b.id.slice(-2).toUpperCase()}
                </span>

                <div className={claimed ? "opacity-50" : ""}>
                    {/* header row — minor */}
                    <div className="relative flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] text-white/30">
                            <MapPin size={10} />
                            {b.sector}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] text-white/30">
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ background: claimed ? SUCCESS : ACCENT_BRIGHT }}
                            />
                            {claimed ? "CLAIMED" : "ACTIVE"}
                        </span>
                    </div>

                    {/* icon mark */}
                    <div className="relative mt-5 flex h-11 w-11 items-center justify-center border border-white/10 bg-black/40">
                        <Crosshair size={18} strokeWidth={1.5} className={claimed ? "text-white/25" : "text-white/70"} />
                    </div>

                    {/* target name */}
                    <h3 className="font-imperial relative mt-4 text-[24px] leading-[0.95] tracking-wide text-white">
                        {b.target}
                    </h3>

                    {/* alias + last seen — folded into one tiny, muted caption */}
                    <p className="relative mt-1 truncate font-mono text-[9px] tracking-wide text-white/20">
                        {b.alias} · LAST SEEN {b.lastSeen}
                    </p>

                    {/* threat — glowing progress bar */}
                    <div className="relative mt-5">
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="font-mono text-[9px] tracking-[0.2em] text-white/30">THREAT LEVEL</span>
                            <span
                                className="font-mono text-[9px] font-bold tracking-[0.15em]"
                                style={{ color: ACCENT_BRIGHT }}
                            >
                                {THREAT_TIER[b.threat]}
                            </span>
                        </div>
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                            <motion.div
                                className="absolute inset-y-0 left-0 rounded-full blur-[5px]"
                                style={{ background: ACCENT_BRIGHT }}
                                initial={{ width: 0, opacity: 0.5 }}
                                animate={{ width: `${threatPct}%`, opacity: [0.4, 0.75, 0.4] }}
                                transition={{
                                    width: { duration: 0.7, ease: "easeOut" },
                                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                }}
                            />
                            <motion.div
                                className="relative h-full rounded-full"
                                style={{
                                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BRIGHT})`,
                                    boxShadow: `0 0 10px 1px ${ACCENT_BRIGHT}cc`,
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${threatPct}%` }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* payout + claim — the hero row, stays vivid even when claimed */}
                <div className="relative mt-6 flex items-end justify-between border-t border-white/10 pt-5">
                    <div>
                        <p className="font-mono text-[9px] tracking-[0.25em] text-white/30">PAYOUT</p>
                        <p
                            className="font-imperial mt-1 text-[38px] leading-none tracking-wide"
                            style={{ color: claimed ? "rgba(255,255,255,0.5)" : "#fff" }}
                        >
                            {b.payout.toLocaleString()}
                            <span className="ml-1.5 text-[13px] font-mono tracking-normal text-white/40">CR</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                        <motion.button
                            type="button"
                            disabled={claimed}
                            onClick={() => onClaim(b.id)}
                            aria-label={claimed ? "Bounty claimed" : "Claim bounty"}
                            whileHover={!claimed ? { scale: 1.08 } : undefined}
                            whileTap={!claimed ? { scale: 0.92 } : undefined}
                            className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-300 ${claimed ? "cursor-default border-[#2ecc71] bg-[#2ecc71]/15" : "border-white/25 bg-black/40 hover:border-[#2ecc71] hover:bg-[#2ecc71]/10"
                                }`}
                            style={{ boxShadow: claimed ? `0 0 22px 4px ${SUCCESS}66` : undefined }}
                        >
                            <AnimatePresence>
                                {claimed && (
                                    <motion.span
                                        initial={{ scale: 1, opacity: 0.7 }}
                                        animate={{ scale: 1.6, opacity: 0 }}
                                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                                        className="absolute inset-0 rounded-full border-2"
                                        style={{ borderColor: SUCCESS }}
                                    />
                                )}
                            </AnimatePresence>
                            <motion.span
                                key={claimed ? "on" : "off"}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                                <Check
                                    size={20}
                                    strokeWidth={2.5}
                                    className={claimed ? "text-[#2ecc71]" : "text-white/50 group-hover:text-[#2ecc71]"}
                                />
                            </motion.span>
                        </motion.button>
                        <span
                            className="font-mono text-[8px] tracking-[0.2em]"
                            style={{ color: claimed ? SUCCESS : "rgba(255,255,255,0.3)" }}
                        >
                            {claimed ? "CLAIMED" : "CLAIM"}
                        </span>
                    </div>
                </div>
            </div>
        </TiltCard>
    );
}

/* ------------------------------------------------------------------ */
/*  Grid                                                                */
/* ------------------------------------------------------------------ */
export function BountyGrid({
    bounties,
    onClaim,
    onPostBounty,
}: {
    bounties: Bounty[];
    onClaim: (id: string) => void;
    onPostBounty?: () => void;
}) {
    return (
        <section className="bg-[#050505]">
            <style>{`
        .font-imperial {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
        }
      `}</style>

            <div className="mx-auto max-w-6xl px-6 pb-10 sm:px-10">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {bounties.map((b, i) => (
                            <motion.div
                                key={b.id}
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.3, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <BountyCard b={b} onClaim={onClaim} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {bounties.length === 0 && (
                    <div className="border border-white/10 bg-[#0a0a0a] py-16 text-center font-mono text-[12px] tracking-[0.1em] text-white/30">
                        NO CONTRACTS FOUND IN THIS SECTOR
                    </div>
                )}

                <div className="mt-10 flex justify-center">
                    <button
                        type="button"
                        onClick={onPostBounty}
                        className="group inline-flex items-center gap-2 border border-white/15 bg-[#0a0a0a] px-7 py-3.5 font-imperial text-lg tracking-wide text-white transition-colors hover:border-[#ff3b30]/70 hover:bg-[#d80f0f]"
                    >
                        <Plus size={17} className="transition-transform group-hover:rotate-90" />
                        POST BOUNTY
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Demo                                                                */
/* ------------------------------------------------------------------ */
export default function BountyGridDemo() {
    const [bounties, setBounties] = useState<Bounty[]>([
        { id: "b-01", sector: "OUTER RIM", status: "ACTIVE", threat: 4, target: "Vantiss Kray", alias: "\"The Ghost of Corellia\"", lastSeen: "3 CYCLES AGO", payout: 24500 },
        { id: "b-02", sector: "MID RIM", status: "ACTIVE", threat: 2, target: "Renna Osk", alias: "\"Silent Hand\"", lastSeen: "1 CYCLE AGO", payout: 8200 },
        { id: "b-03", sector: "CORE WORLDS", status: "CLAIMED", threat: 5, target: "Sull Marrec", alias: "\"Iron Reaper\"", lastSeen: "12 CYCLES AGO", payout: 61000 },
    ]);

    const claim = (id: string) =>
        setBounties((prev) => prev.map((b) => (b.id === id ? { ...b, status: "CLAIMED" } : b)));

    return <BountyGrid bounties={bounties} onClaim={claim} />;
}