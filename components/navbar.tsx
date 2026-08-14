"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, LayoutDashboard, ChevronRight, ShieldAlert, Radio, FileText, Target } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Broadcast", href: "/brodcasts" },
  { label: "Dossiers", href: "/dossiers" },
  { label: "Bounties", href: "/bounties" },
  { label: "Holonet", href: "/holonet" },
];

const SEARCH_DATABASE = [
  { id: "1", title: "Target Kael-7", type: "Target Dossier", category: "Jedi Sighting", href: "/dossiers", icon: Target },
  { id: "2", title: "Target Oren-9", type: "Target Dossier", category: "Active Pursuit", href: "/dossiers", icon: Target },
  { id: "3", title: "Order 66 Directives", type: "Broadcast", category: "Imperial Command", href: "/brodcast", icon: Radio },
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
    : SEARCH_DATABASE.slice(0, 4);

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
              flex h-9 items-center gap-2 rounded-sm border px-2.5 text-xs font-mono tracking-wider transition
              ${searchOpen
                ? "border-red-500/60 bg-red-600/20 text-white"
                : "border-white/20 text-white/90 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <Search size={16} strokeWidth={2} />
            <span className="hidden md:inline text-[10px] text-white/60 uppercase">
              SEARCH <kbd className="bg-white/15 px-1 py-0.5 rounded text-[9px]">ctrl+k</kbd>
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
              text-white/90 transition
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
                    uppercase tracking-wide transition-all duration-200
                    ${active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}
                  `}
                >
                  {link.label}
                  <span
                    className={`
                      absolute bottom-0 left-1/2 h-[2px]
                      -translate-x-1/2 bg-red-500
                      transition-all duration-200
                      ${active ? "w-5 opacity-100" : "w-0 opacity-0"}
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
          onClick={() => router.push("/holonet")}
          className="
            z-10 flex items-center gap-2
            rounded-sm border border-white/25
            px-3 py-2 text-sm font-semibold
            uppercase tracking-wide text-white
            transition hover:bg-white/10
          "
        >
          <LayoutDashboard size={16} strokeWidth={2} />
          <span className="hidden sm:inline">Console</span>
        </button>
      </div>

      {/* SEARCH OVERLAY / IMPERIAL COMMAND PALETTE MODAL */}
      <div
        onClick={() => setSearchOpen(false)}
        className={`fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm transition-all duration-300 ease-out ${
          searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-xl rounded-sm border border-red-950/80 bg-[#0a0a0a] shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
            searchOpen ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 bg-black/40">
              <Search size={18} className="text-red-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH DOSSIERS, TARGETS, SECTORS..."
                className="w-full bg-transparent font-mono text-xs tracking-wider text-white placeholder-white/40 outline-none uppercase"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-white/40 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
              <div className="px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/40 uppercase">
                {query ? "Matching Dossiers & Channels" : "Quick Imperial Shortcuts"}
              </div>

              {filteredResults.map((result) => {
                const IconComponent = result.icon;
                return (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleSelectResult(result.href)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded hover:bg-red-950/30 transition text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded border border-white/10 bg-black/60 text-red-500 group-hover:border-red-500/50">
                        <IconComponent size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-white tracking-wide group-hover:text-red-400 transition">
                          {result.title}
                        </p>
                        <p className="font-mono text-[10px] text-white/40">
                          {result.type} &bull; {result.category}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white transition shrink-0" />
                  </button>
                );
              })}

              {filteredResults.length === 0 && (
                <div className="px-4 py-8 text-center font-mono text-xs text-white/40">
                  NO IMPERIAL DOSSIERS FOUND FOR &ldquo;{query}&rdquo;
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-4 py-2 border-t border-white/10 bg-black/60 font-mono text-[10px] text-white/35">
              <span>PRESS <kbd className="text-white/60 font-bold">ESC</kbd> TO CLOSE</span>
              <span>CLEARANCE LEVEL OMEGA</span>
            </div>
          </div>
        </div>
    </nav>
  );
}