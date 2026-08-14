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
} from "lucide-react";

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
      gsap.from(".teaser-label span", {
        opacity: 0,
        y: 10,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".teaser-label",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".feature-card", {
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
      <section className="teasers" ref={containerRef}>
        <div className="teaser-label">
          <span className="teaser-label-left">MODULES</span>
          <span className="teaser-label-right">CLEARANCE: OMEGA</span>
        </div>

        <div className="feature-grid">
          {/* Hero module — full width */}
          <a href={featured.href} className="feature-card feature-card--featured">
            <span className="corner corner-tl" />
            <span className="corner corner-tr" />
            <span className="corner corner-bl" />
            <span className="corner corner-br" />

            <div className="feature-hero-left">
              <div className="feature-card-top">
                <span className="feature-id">MOD.{featured.id}</span>
                <span className="feature-status">
                  <span className="feature-dot" />
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
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </span>
            </div>

            <div className="feature-hero-right" aria-hidden="true">
              <span className="radar-ring radar-ring-1" />
              <span className="radar-ring radar-ring-2" />
              <span className="radar-ring radar-ring-3" />
              <featured.icon className="feature-icon feature-icon--hero" strokeWidth={1} />
            </div>
          </a>

          {/* Secondary modules — even row */}
          {rest.map(({ id, icon: Icon, title, desc, status, href }) => (
            <a href={href} key={id} className="feature-card">
              <span className="feature-ghost-id">{id}</span>

              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />

              <div className="feature-card-top">
                <span className="feature-id">MOD.{id}</span>
                <span className="feature-status">
                  <span className="feature-dot" />
                  {status}
                </span>
              </div>

              <Icon className="feature-icon" size={30} strokeWidth={1.5} />

              <div className="feature-body">
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>

              <span className="feature-cta">
                ACCESS MODULE
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <style>{`
        .teasers {
          width: 100%;
          padding: 140px 40px 180px;
          background: #050505;
          box-sizing: border-box;
        }

        .teaser-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 56px;
          font-family: "Courier New", monospace;
        }

        .teaser-label-left,
        .teaser-label-right {
          font-size: 12px;
          letter-spacing: 0.3em;
          font-weight: 700;
          color: #8a8a8a;
        }

        .teaser-label-right {
          color: #d80f0f;
        }

        /* ---- Grid: hero row (full width) + 3 even cards ---- */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          width: 100%;
        }

        .feature-card {
          position: relative;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 36px 32px;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          text-decoration: none;
          overflow: hidden;
          isolation: isolate;
          height: 300px;
          transition:
            border-color 0.35s ease,
            transform 0.35s ease,
            box-shadow 0.35s ease,
            background 0.35s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(216, 15, 15, 0.6);
          box-shadow: 0 20px 50px -20px rgba(216, 15, 15, 0.45);
        }

        /* Hero card spans full width, its own internal layout */
        .feature-card--featured {
          grid-column: 1 / -1;
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
            rgba(255, 255, 255, 0.16),
            transparent 60%
          );
          border-color: rgba(255, 255, 255, 0.15);
        }

        .feature-card--featured:hover {
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 20px 60px -18px rgba(0, 0, 0, 0.6);
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
          border: 1px solid rgba(255, 255, 255, 0.35);
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

        /* ghost numeral only on the 3 secondary cards */
        .feature-ghost-id {
          position: absolute;
          right: -10px;
          bottom: -40px;
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-size: 150px;
          line-height: 1;
          color: rgba(255, 255, 255, 0.035);
          z-index: -1;
          pointer-events: none;
          transition: transform 0.6s ease;
        }

        .feature-card:hover .feature-ghost-id {
          transform: scale(1.08);
        }

        .corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border: 1.5px solid #fff;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; transform: translate(4px, 4px); }
        .corner-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; transform: translate(-4px, 4px); }
        .corner-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; transform: translate(4px, -4px); }
        .corner-br { bottom: 10px; right: 10px; border-left: none; border-top: none; transform: translate(-4px, -4px); }

        .feature-card:hover .corner {
          opacity: 0.5;
          transform: translate(0, 0);
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
          color: rgba(255, 255, 255, 0.75);
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
          transform: rotate(-8deg) scale(1.12);
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
          font-size: clamp(22px, 2.4vw, 28px);
          letter-spacing: 0.01em;
          margin: 0 0 10px;
          color: #fff;
        }

        .feature-title--hero {
          font-size: clamp(30px, 4vw, 46px);
          margin: 0 0 12px;
        }

        .feature-desc {
          font-size: 14.5px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
          max-width: 42ch;
        }

        .feature-card--featured .feature-desc {
          color: rgba(255, 255, 255, 0.88);
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
          color: rgba(255, 255, 255, 0.45);
          transition: gap 0.3s ease, color 0.3s ease;
        }

        .feature-card:hover .feature-cta {
          gap: 12px;
          color: #fff;
        }

        .feature-card--featured .feature-cta {
          color: rgba(255, 255, 255, 0.85);
        }

        @media (max-width: 900px) {
          .feature-hero-right { display: none; }
        }

        @media (max-width: 860px) {
          .teasers {
            padding: 96px 24px 120px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            height: auto;
            min-height: 220px;
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