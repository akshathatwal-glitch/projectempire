"use client";

import { useState } from "react";
import { Search, Menu, X, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Broadcast", href: "/brodcast" },
  { label: "Dossiers", href: "/dossiers" },
  { label: "Bounties", href: "/bounties" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
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
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-sm text-white/90 transition
              hover:bg-white/10 hover:text-white
            "
          >
            <Search size={18} strokeWidth={2} />
          </button>

          {/* Divider */}
          <span
            className="h-6 w-px shrink-0 bg-white/20"
            aria-hidden="true"
          />

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
            {menuOpen ? (
              <X size={18} strokeWidth={2} />
            ) : (
              <Menu size={18} strokeWidth={2} />
            )}
          </button>

          {/* NAV LINKS */}
          <div
            className={`flex items-center gap-1 overflow-hidden transition-all duration-300 ease-out ${menuOpen
                ? "max-w-[600px] opacity-100"
                : "max-w-0 opacity-0"
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

                    ${active
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {link.label}

                  {/* Active indicator */}
                  <span
                    className={`
                      absolute bottom-0 left-1/2 h-[2px]
                      -translate-x-1/2 bg-red-500
                      transition-all duration-200

                      ${active
                        ? "w-5 opacity-100"
                        : "w-0 opacity-0"
                      }
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
                block text-lg font-black italic
                tracking-tight text-white
                sm:text-xl
              "
              style={{ fontStretch: "condensed" }}
            >
              {pathname?.includes("brodcast") ? (
                <>
                  EMPIRE
                  <span className="ml-1">BROADCAST</span>
                </>
              ) : (
                <>
                  EMPIRE
                  <span className="ml-1">STATE OF MIND</span>
                </>
              )}
            </span>
          </a>
        </div>

        {/* RIGHT CLUSTER */}
        <button
          type="button"
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
    </nav>
  );
}