"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, LayoutDashboard, ChevronRight, ShieldAlert, Radio, FileText, Target, Command } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Broadcast", href: "/brodcasts" },
  { label: "Dossiers", href: "/dossiers" },
  { label: "Bounties", href: "/bounties" },
  { label: "Holonet", href: "/holonet" },
];

const SEARCH_DATABASE = [
  { id: "0", title: "Imperial Command Console", type: "Command Console", category: "System Control", href: "/console", icon: LayoutDashboard },
  { id: "1", title: "Target Kael-7", type: "Target Dossier", category: "Jedi Sighting", href: "/dossiers", icon: Target },
  { id: "2", title: "Target Oren-9", type: "Target Dossier", category: "Active Pursuit", href: "/dossiers", icon: Target },
  { id: "3", title: "Order 66 Directives", type: "Broadcast", category: "Imperial Command", href: "/brodcasts", icon: Radio },
  { id: "4", title: "Holonet Surveillance Radar", type: "Sector Map", category: "Surveillance", href: "/holonet", icon: ShieldAlert },
  { id: "5", title: "Active Bounty Registry", type: "Bounty Board", category: "Guild Clearance", href: "/bounties", icon: FileText },
  { id: "6", title: "Outer Rim Sector Log", type: "Sector", category: "Relay Scan", href: "/holonet", icon: ShieldAlert },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  const filteredResults = query.trim()
    ? SEARCH_DATABASE.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
    )
    : SEARCH_DATABASE.slice(0, 5);

  const handleSelectResult = (href: string) => {
    setSearchOpen(false);
    router.push(href);
  };

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 w-full">
      <div
        className="
          pointer-events-auto relative mx-auto flex w-[100vw] max-w-[100vw]
          items-center justify-between rounded-sm border border-white/25
          bg-white/[0.06] px-4 py-3 backdrop-blur-md
          sm:px-6
        "
      >
        {/* LEFT CLUSTER */}
        <div className="z-10 flex items-center gap-3 sm:gap-4">
          {/* Search Button */}
          <button
            type="button"
            aria-label="Toggle Search"
            onClick={() => setSearchOpen((prev) => !prev)}
            className={`
              flex h-9 items-center gap-2 rounded-sm border px-2.5 text-xs font-mono tracking-wider transition cursor-pointer
              ${searchOpen
                ? "border-red-500/60 bg-red-600/20 text-white shadow-[0_0_12px_rgba(255,59,48,0.4)]"
                : "border-white/20 text-white/90 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <Search size={16} strokeWidth={2} className="text-red-400" />
            <span className="hidden md:inline text-[10px] text-white/60 uppercase font-bold tracking-widest">
              SEARCH <kbd className="bg-white/15 px-1 py-0.5 rounded text-[9px] font-mono border border-white/10">Ctrl+K</kbd>
            </span>
          </button>

          {/* Divider */}
          <span className="h-6 w-px shrink-0 bg-white/20" aria-hidden="true" />

          {/* Menu */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-sm border border-white/25
              text-white/90 transition cursor-pointer
              hover:bg-white/10 hover:text-white
            "
          >
            {menuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>

          {/* NAV LINKS */}
          <div
            className={`flex items-center gap-1 overflow-hidden transition-all duration-300 ease-out ${menuOpen ? "max-w-[600px] opacity-100" : "max-w-0 opacity-0"
              }`}
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`
                    relative whitespace-nowrap rounded-sm
                    px-3 py-2 text-sm font-semibold
                    uppercase tracking-wide transition-all duration-200 cursor-pointer
                    ${active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}
                  `}
                >
                  {link.label}
                  <span
                    className={`
                      absolute bottom-0 left-1/2 h-[2px]
                      -translate-x-1/2 bg-red-500
                      transition-all duration-200
                      ${active ? "w-5 opacity-100 shadow-[0_0_8px_#ff3b30]" : "w-0 opacity-0"}
                    `}
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* CENTER WORDMARK — LOCKED */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <a
            href="/"
            className="pointer-events-auto select-none text-center leading-none"
            aria-label="Empire home"
          >
            <span
              className="
                block text-lg font-bold
                tracking-widest text-white uppercase
                sm:text-2xl
              "
              style={{ fontFamily: "'Impact', sans-serif" }}
            >
              {pathname?.includes("brodcast") ? (
                <>
                  EMPIRE <span>BROADCAST</span>
                </>
              ) : (
                <>
                  EMPIRE <span>STATE</span> OF MIND
                </>
              )}
            </span>
          </a>
        </div>

        {/* RIGHT CLUSTER */}
        <button
          type="button"
          onClick={() => router.push("/console")}
          className="
            z-10 flex items-center gap-2
            rounded-sm border border-white/25
            px-3 py-2 text-sm font-semibold
            uppercase tracking-wide text-white
            transition hover:bg-white/10 cursor-pointer
          "
        >
          <LayoutDashboard size={16} strokeWidth={2} />
          <span className="hidden sm:inline">Console</span>
        </button>
      </div>

      {/* SEARCH OVERLAY / IMPERIAL COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -16 }}
              transition={{ type: "spring", damping: 26, stiffness: 340 }}
              className="relative w-full max-w-2xl rounded-sm border border-red-600/40 bg-[#0a0a0c] shadow-[0_0_50px_rgba(216,15,15,0.3)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HUD Brackets */}
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500 z-10" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500 z-10" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500 z-10" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500 z-10" />

              {/* Glowing Top Laser Line Accent */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent animate-laser-sweep" />

              {/* Input Header */}
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 bg-black/60">
                <Search size={18} className="text-red-500 shrink-0 animate-pulse" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SEARCH DOSSIERS, TARGETS, SECTORS, DIRECTIVES..."
                  className="w-full bg-transparent font-mono text-xs tracking-widest text-white placeholder-white/40 outline-none uppercase"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-white/40 hover:text-white font-mono text-[10px] tracking-wider uppercase mr-2"
                  >
                    CLEAR
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-white/40 hover:text-white transition cursor-pointer p-1 rounded hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Results List */}
              <div className="max-h-96 overflow-y-auto p-3 space-y-1">
                <div className="px-3 py-2 flex items-center justify-between font-mono text-[10px] tracking-widest text-white/40 uppercase border-b border-white/5 mb-1">
                  <span>{query ? `Matching Query: "${query}"` : "Quick Imperial Directives & Dossiers"}</span>
                  <span>{filteredResults.length} FOUND</span>
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredResults.map((result, index) => {
                    const IconComponent = result.icon;
                    return (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15, delay: index * 0.03 }}
                        type="button"
                        onClick={() => handleSelectResult(result.href)}
                        className="w-full flex items-center justify-between px-3.5 py-3 rounded-sm border border-transparent hover:border-red-500/40 hover:bg-red-950/20 transition-all duration-200 text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="p-2 rounded-sm border border-white/10 bg-black/60 text-red-500 group-hover:border-red-500/60 group-hover:bg-red-600/20 group-hover:text-red-400 group-hover:scale-105 transition-all duration-200">
                            <IconComponent size={15} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono text-xs font-bold text-white tracking-wider group-hover:text-red-400 transition-colors">
                              {result.title}
                            </p>
                            <p className="font-mono text-[10px] text-white/40 group-hover:text-white/60">
                              {result.type} &bull; <span className="text-white/30">{result.category}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] tracking-widest text-white/20 group-hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                            SELECT
                          </span>
                          <ChevronRight size={14} className="text-white/20 group-hover:text-red-400 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>

                {filteredResults.length === 0 && (
                  <div className="px-4 py-12 text-center font-mono text-xs text-white/40 uppercase tracking-widest">
                    NO IMPERIAL RECORDS MATCHING &ldquo;{query}&rdquo;
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-4 py-2.5 border-t border-white/10 bg-black/80 font-mono text-[10px] text-white/40">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white/10 border border-white/15 px-1.5 py-0.5 rounded text-[9px] font-bold text-white/80">ESC</kbd> CLOSE
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white/10 border border-white/15 px-1.5 py-0.5 rounded text-[9px] font-bold text-white/80">↵</kbd> OPEN
                  </span>
                </div>
                <div className="flex items-center gap-2 text-red-500 font-bold tracking-widest">
                  <Command size={10} />
                  <span>CLEARANCE OMEGA</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}