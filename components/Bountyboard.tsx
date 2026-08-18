"use client";

import HunterCommendationsDemo from "@/components/hunter-commendations"
import { ImperialSearch } from "@/components/imperial-search"
import { BountyGrid } from "@/components/BountyGrid"
import { PostBountyModal } from "@/components/postbounty"

import { LayoutGroup } from "motion/react";
import { useState, useEffect } from "react";
import {
    Menu,
    Plus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
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

type SortKey = "PAYOUT" | "THREAT";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BountyBoard() {
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [loading, setLoading] = useState(true);
    const [sectorFilter, setSectorFilter] = useState<string>("ALL");
    const [sort, setSort] = useState<SortKey>("PAYOUT");
    const [postOpen, setPostOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    // ── Fetch bounties from API ──────────────────────────────────────
    async function fetchBounties() {
        try {
            const params = new URLSearchParams();
            if (sectorFilter !== "ALL") params.set("sector", sectorFilter);
            params.set("sort", sort);
            if (searchQuery.trim()) params.set("q", searchQuery.trim());
            const res = await fetch(`/api/bounties?${params.toString()}`);
            const data = await res.json();
            setBounties(data.bounties ?? []);
        } catch {
            // keep existing state if network fails
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBounties();
        }, 0);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectorFilter, sort, searchQuery]);

    // ── Claim a bounty via PATCH ────────────────────────────────────
    async function claim(id: string) {
        // Optimistic UI
        setBounties((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "CLAIMED" as Status } : b))
        );
        try {
            await fetch(`/api/bounties/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "CLAIMED" }),
            });
        } catch {
            // revert on failure
            setBounties((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: "ACTIVE" as Status } : b))
            );
        }
    }

    // ── Submit a new bounty via POST ────────────────────────────────
    async function handleCreateBounty(newBounty: {
        target: string;
        alias: string;
        sector: string;
        threat: 1 | 2 | 3 | 4 | 5;
        payout: number;
    }) {
        try {
            const res = await fetch("/api/bounties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBounty),
            });
            const data = await res.json();
            if (res.ok && data.bounty) {
                setBounties((prev) => [data.bounty, ...prev]);
            }
        } catch {
            // error handling
        }
    }

    const activeCount = bounties.filter((b) => b.status === "ACTIVE").length;

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

            {/* ── Hero Band ───────────────────────────────────────────── */}
            <div className="relative flex min-h-[56px] w-full items-center border-b border-white/10 bg-black px-5 sm:px-8">
                <span className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#d80f0f] to-transparent opacity-90" />

                {/* left: hamburger + label */}
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        aria-label={menuOpen ? "Close filters" : "Open filters"}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((p) => !p)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                        <Menu size={16} />
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-out ${menuOpen ? "max-w-[70vw] opacity-100 sm:max-w-[480px]" : "max-w-0 opacity-0"
                            } flex min-w-0 items-center gap-1 whitespace-nowrap`}
                    >
                        {/* Sector filter pills */}
                        {["ALL", ...SECTORS].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setSectorFilter(s)}
                                className={`shrink-0 rounded-sm border px-2.5 py-1 font-mono text-[9px] font-bold tracking-wider uppercase transition cursor-pointer ${sectorFilter === s
                                        ? "border-[#d80f0f]/70 bg-[#d80f0f]/20 text-white shadow-[0_0_10px_rgba(216,15,15,0.3)]"
                                        : "border-white/10 text-white/40 hover:text-white"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}

                        <span className="mx-1 h-4 w-px shrink-0 bg-white/20" />

                        {/* Sort toggles */}
                        {(["PAYOUT", "THREAT"] as SortKey[]).map((k) => (
                            <button
                                key={k}
                                type="button"
                                onClick={() => setSort(k)}
                                className={`shrink-0 rounded-sm border px-2 py-1 font-mono text-[9px] font-bold tracking-wider uppercase transition cursor-pointer ${sort === k
                                        ? "border-white/50 bg-white/10 text-white"
                                        : "border-white/10 text-white/40 hover:text-white"
                                    }`}
                            >
                                {k}
                            </button>
                        ))}
                    </div>
                </div>

                {/* center wordmark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-28">
                    <span className="font-imperial select-none truncate text-xl uppercase tracking-[0.18em] text-white sm:text-2xl">
                        BOUNTY&nbsp;<span className="text-[#d80f0f]">BOARD</span>
                    </span>
                </div>

                {/* right: status + post button */}
                <div className="ml-auto flex shrink-0 items-center gap-3">
                    <div className="hidden items-center gap-1.5 sm:flex">
                        <span className="relative flex h-2 w-2">
                            <span className="bb-ring absolute inline-flex h-full w-full rounded-full bg-[#d80f0f] opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d80f0f]" />
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.14em] text-white/60 uppercase">
                            {loading ? "LOADING..." : `${activeCount} ACTIVE`}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setPostOpen(true)}
                        className="flex items-center gap-1.5 rounded-sm border border-[#d80f0f]/60 bg-[#d80f0f]/15 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[#d80f0f]/30 hover:shadow-[0_0_14px_rgba(216,15,15,0.4)] cursor-pointer"
                    >
                        <Plus size={12} />
                        POST
                    </button>
                </div>
            </div>

            {/* ── Search ──────────────────────────────────────────────── */}
            <div className="border-b border-white/8 bg-[#050505] px-5 py-3 sm:px-8">
                <ImperialSearch
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    placeholder="SEARCH TARGET, ALIAS, SECTOR..."
                />
            </div>

            {/* ── Grid ────────────────────────────────────────────────── */}
            <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
                <LayoutGroup>
                    {loading ? (
                        <div className="flex items-center justify-center py-24 font-mono text-xs tracking-widest text-white/30 uppercase">
                            LOADING BOUNTIES...
                        </div>
                    ) : (
                        <BountyGrid bounties={bounties} onClaim={claim} />
                    )}
                </LayoutGroup>
            </div>

            {/* ── Hunter Commendations ────────────────────────────────── */}
            <div className="border-t border-white/10">
                <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-10">
                    <HunterCommendationsDemo />
                </div>
            </div>

            {/* ── Post Bounty Modal ───────────────────────────────────── */}
            <PostBountyModal
                open={postOpen}
                onClose={() => setPostOpen(false)}
                onSubmit={handleCreateBounty}
            />
        </section>
    );
}