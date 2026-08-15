"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Radar,
  FileWarning,
  Trophy,
  Radio,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

const MODULES = [
  {
    id: "01",
    icon: Radar,
    title: "Holonet War Map",
    desc: "Live sector-by-sector tracking of confirmed and suspected Jedi sightings across the galaxy.",
    status: "ONLINE",
    href: "/holonet",
    featured: true,
  },
  {
    id: "02",
    icon: FileWarning,
    title: "Dossiers",
    desc: "Full case files on every known target — last known position, affiliations, threat rating.",
    status: "247 FILES",
    href: "/dossiers",
  },
  {
    id: "03",
    icon: Trophy,
    title: "Bounty Board",
    desc: "Active contracts ranked by payout. Claim a hunt before another party gets there first.",
    status: "14 ACTIVE",
    href: "/bounties",
  },
  {
    id: "04",
    icon: Radio,
    title: "Broadcast Console",
    desc: "Draft and transmit Imperial messaging across occupied sectors. Compliance is not optional.",
    status: "STANDBY",
    href: "/broadcasts",
  },
];

export default function FeatureTeasers() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".teaser-header", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".teaser-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".feature-card-wrapper", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".feature-grid",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef }
  );

  const featured = MODULES.find((m) => m.featured)!;
  const rest = MODULES.filter((m) => !m.featured);

  return (
    <>
      <section className="teasers relative overflow-hidden" ref={containerRef}>
        {/* Subtle Background Glow Accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-40 [background:radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(216,15,15,0.25),transparent_70%)]" />

        {/* Section Header */}
        <div className="teaser-header flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-6 mb-12 max-w-7xl mx-auto">
          <div>
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-red-500 uppercase flex items-center gap-2 mb-2">
              <ShieldAlert size={14} className="animate-pulse" />
              SYSTEM MODULES & ARCHIVE DIRECTIVES
            </span>
            <h2 className="font-imperial text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider text-white">
              IMPERIAL <span className="text-red-500 drop-shadow-[0_0_20px_rgba(255,59,48,0.8)]">COMMAND</span> MODULES
            </h2>
          </div>
          <span className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mt-4 md:mt-0">
            CLEARANCE: OMEGA LEVEL
          </span>
        </div>

        <div className="feature-grid max-w-7xl mx-auto">
          {/* Hero Featured Module — Full Width */}
          <div className="feature-card-wrapper feature-card-wrapper--featured">
            <a href={featured.href} className="feature-card feature-card--featured group">
              {/* HUD Corner Brackets */}
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />

              {/* Laser Shimmer Sweep Effect */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

              <div className="feature-hero-left">
                <div className="feature-card-top">
                  <span className="feature-id">MOD.{featured.id}</span>
                  <span className="feature-status">
                    <span className="feature-dot animate-ping" />
                    {featured.status}
                  </span>
                </div>

                <div className="feature-body">
                  <h3 className="feature-title feature-title--hero">
                    {featured.title}
                  </h3>
                  <p className="feature-desc">{featured.desc}</p>
                </div>

                <span className="feature-cta">
                  ACCESS MODULE
                  <ArrowUpRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1.5 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
              </div>

              <div className="feature-hero-right" aria-hidden="true">
                <span className="radar-ring radar-ring-1" />
                <span className="radar-ring radar-ring-2" />
                <span className="radar-ring radar-ring-3" />
                <featured.icon className="feature-icon feature-icon--hero group-hover:rotate-12 transition-transform duration-500" strokeWidth={1} />
              </div>
            </a>
          </div>

          {/* Secondary Modules Grid */}
          {rest.map(({ id, icon: Icon, title, desc, status, href }) => (
            <div key={id} className="feature-card-wrapper">
              <a href={href} className="feature-card group">
                <span className="feature-ghost-id">{id}</span>

                {/* HUD Corner Brackets */}
                <span className="corner corner-tl" />
                <span className="corner corner-tr" />
                <span className="corner corner-bl" />
                <span className="corner corner-br" />

                {/* Laser Shimmer Sweep Effect */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                <div className="feature-card-top">
                  <span className="feature-id">MOD.{id}</span>
                  <span className="feature-status">
                    <span className="feature-dot" />
                    {status}
                  </span>
                </div>

                <Icon className="feature-icon" size={32} strokeWidth={1.5} />

                <div className="feature-body">
                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-desc">{desc}</p>
                </div>

                <span className="feature-cta">
                  ACCESS MODULE
                  <ArrowUpRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1.5 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
              </a>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .font-imperial {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
        }

        .teasers {
          width: 100%;
          padding: 80px 40px 140px;
          background: #050505;
          box-sizing: border-box;
        }

        /* ---- Grid: hero row (full width) + 3 even cards ---- */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          width: 100%;
        }

        .feature-card-wrapper--featured {
          grid-column: 1 / -1;
        }

        .feature-card {
          position: relative;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 36px 32px;
          background: #0a0a0c;
          border: 1px solid rgba(216, 15, 15, 0.25);
          border-radius: 4px;
          text-decoration: none;
          overflow: hidden;
          isolation: isolate;
          height: 320px;
          transition:
            border-color 0.35s ease,
            transform 0.35s ease,
            box-shadow 0.35s ease,
            background 0.35s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px) scale(1.015);
          border-color: rgba(255, 59, 48, 0.7);
          box-shadow: 0 25px 60px -15px rgba(216, 15, 15, 0.55);
          background: #0e0606;
        }

        /* Hero card spans full width */
        .feature-card--featured {
          height: auto;
          min-height: 320px;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          padding: 48px 56px;
          background: #b5130e;
          background-image: radial-gradient(
            ellipse 90% 90% at 20% 10%,
            rgba(255, 255, 255, 0.22),
            transparent 65%
          );
          border-color: rgba(255, 255, 255, 0.25);
        }

        .feature-card--featured:hover {
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 30px 70px -15px rgba(216, 15, 15, 0.75);
        }

        .feature-hero-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1 1 auto;
          min-width: 0;
        }

        .feature-hero-right {
          position: relative;
          width: 180px;
          height: 180px;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radar-ring {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          animation: radar-pulse 3s ease-out infinite;
        }
        .radar-ring-1 { width: 60px; height: 60px; animation-delay: 0s; }
        .radar-ring-2 { width: 60px; height: 60px; animation-delay: 1s; }
        .radar-ring-3 { width: 60px; height: 60px; animation-delay: 2s; }

        @keyframes radar-pulse {
          0% { width: 60px; height: 60px; opacity: 0.9; }
          100% { width: 180px; height: 180px; opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .radar-ring { animation: none; opacity: 0.25; }
        }

        .feature-icon--hero {
          position: relative;
          z-index: 1;
          color: #fff;
          width: 64px;
          height: 64px;
        }

        /* Ghost numerals on secondary cards */
        .feature-ghost-id {
          position: absolute;
          right: -10px;
          bottom: -40px;
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-size: 160px;
          line-height: 1;
          color: rgba(255, 255, 255, 0.04);
          z-index: -1;
          pointer-events: none;
          transition: transform 0.6s ease, color 0.6s ease;
        }

        .feature-card:hover .feature-ghost-id {
          transform: scale(1.15);
          color: rgba(255, 59, 48, 0.12);
        }

        .corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border: 2px solid #fff;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
        }
        .corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; transform: translate(4px, 4px); }
        .corner-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; transform: translate(-4px, 4px); }
        .corner-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; transform: translate(4px, -4px); }
        .corner-br { bottom: 10px; right: 10px; border-left: none; border-top: none; transform: translate(-4px, -4px); }

        .feature-card:hover .corner {
          opacity: 0.9;
          transform: translate(0, 0);
          border-color: #ff3b30;
        }

        .feature-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .feature-id {
          font-family: "Courier New", monospace;
          font-size: 12px;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.4);
        }

        .feature-card--featured .feature-id {
          color: rgba(255, 255, 255, 0.8);
        }

        .feature-status {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: "Courier New", monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #a3a3a3;
        }

        .feature-card--featured .feature-status {
          color: rgba(255, 255, 255, 0.9);
        }

        .feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff3b30;
          box-shadow: 0 0 8px #ff3b30;
        }

        .feature-card--featured .feature-dot {
          background: #fff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }

        .feature-icon {
          color: #f5f5f5;
          transition: color 0.35s ease, transform 0.45s ease;
        }

        .feature-card:hover .feature-icon {
          transform: rotate(-10deg) scale(1.18);
        }

        .feature-card:not(.feature-card--featured):hover .feature-icon {
          color: #ff3b30;
        }

        .feature-body {
          margin-top: auto;
        }

        .feature-title {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
          font-size: clamp(26px, 2.6vw, 32px);
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin: 0 0 10px;
          color: #fff;
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }

        .feature-card:hover .feature-title {
          color: #fff;
          text-shadow: 0 0 15px rgba(255, 59, 48, 0.6);
        }

        .feature-title--hero {
          font-size: clamp(34px, 4.5vw, 54px);
          margin: 0 0 12px;
        }

        .feature-desc {
          font-size: 14.5px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          max-width: 42ch;
        }

        .feature-card--featured .feature-desc {
          color: rgba(255, 255, 255, 0.9);
          max-width: 46ch;
        }

        .feature-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: auto;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.5);
          transition: gap 0.3s ease, color 0.3s ease;
        }

        .feature-card:hover .feature-cta {
          gap: 12px;
          color: #ff3b30;
        }

        .feature-card--featured:hover .feature-cta {
          color: #fff;
        }

        @media (max-width: 900px) {
          .feature-hero-right { display: none; }
        }

        @media (max-width: 860px) {
          .teasers {
            padding: 60px 24px 100px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            height: auto;
            min-height: 240px;
          }

          .feature-card--featured {
            flex-direction: column;
            align-items: flex-start;
            padding: 36px 28px;
            min-height: auto;
          }

          .feature-ghost-id {
            font-size: 110px;
          }
        }
      `}</style>
    </>
  );
}