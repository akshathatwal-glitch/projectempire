"use client";

import { Search, Menu, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isBroadcast = pathname?.includes("brodcast") || false;

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 w-full">
      <div
        className="
          pointer-events-auto mx-auto flex w-[100vw] max-w-[100vw] items-center
          justify-between rounded-sm border border-white/25
          bg-white/[0.06] px-4 py-3 backdrop-blur-md
          sm:px-6
        "
      >
        {/* Left cluster: search + menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-sm text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <Search size={18} strokeWidth={2} />
          </button>

          <span className="h-6 w-px bg-white/20" aria-hidden="true" />

          <button
            type="button"
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/25 text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <Menu size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Center: wordmark */}
        <a
          href="#"
          className="select-none text-center leading-none"
          aria-label="Star Wars home"
        >
          <span
            className="
              block text-lg font-black italic tracking-tight text-white
              sm:text-xl
            "
            style={{ fontStretch: "condensed" }}
          >
            {isBroadcast ? (
              <>
                EMPIRE<span className="ml-1">BROADCAST</span>
              </>
            ) : (
              <>
                EMPIRE<span className="ml-1">STATE OF MIND</span>
              </>
            )}
          </span>
        </a>

        {/* Right cluster: cart */}
        <button
          type="button"
          className="
            flex items-center gap-2 rounded-sm border border-white/25
            px-3 py-2 text-sm font-semibold uppercase tracking-wide text-white
            transition hover:bg-white/10
          "
        >
          <LayoutDashboard size={16} strokeWidth={2} />
          <span className="hidden sm:inline">Console</span>
        </button>
      </div>
    </nav>
  );
}