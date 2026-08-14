"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Radar, FileWarning, Trophy, Radio, ArrowUpRight } from "lucide-react";

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

  return (
    <>
    <section className="teasers" ref={containerRef}>
      <div className="teaser-label">
        <span className="teaser-label-left">MODULES</span>
        <span className="teaser-label-right">CLEARANCE: OMEGA</span>
      </div>

      <div className="feature-grid">
        {MODULES.map(({ id, icon: Icon, title, desc, status, href, featured }) => (
          <a
            href={href}
            key={id}
            className={`feature-card${featured ? " feature-card--featured" : ""}`}
          >
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

            <Icon className="feature-icon" size={34} strokeWidth={1.5} />

            <div className="feature-body">
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>

            <span className="feature-cta">
              ACCESS MODULE <ArrowUpRight size={15} strokeWidth={2.5} />
            </span>
          </a>
        ))}
        </section>
      </div>
      

      <style>{`
        .teasers {
          padding: 140px 40px 180px;
          max-width: 1200px;
          margin: 0 auto;
          background: #050505;
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

        .feature-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          grid-template-rows: repeat(2, minmax(220px, auto));
          gap: 28px;
        }

        .feature-grid > a:first-child {
          grid-row: 1 / 3;
        }

        .feature-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 40px 36px;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          text-decoration: none;
          overflow: hidden;
          isolation: isolate;
          transition: border-color 0.35s ease, transform 0.35s ease,
            box-shadow 0.35s ease, background 0.35s ease;
        }

        .feature-card--featured {
          background: #b5130e;
          background-image: radial-gradient(
            ellipse 90% 70% at 30% 0%,
            rgba(255, 255, 255, 0.14),
            transparent 60%
          );
          border-color: rgba(255, 255, 255, 0.15);
          justify-content: flex-end;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(216, 15, 15, 0.6);
          box-shadow: 0 20px 50px -20px rgba(216, 15, 15, 0.45);
        }

        .feature-card--featured:hover {
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 20px 60px -18px rgba(0, 0, 0, 0.6);
        }

        /* oversized ghost numeral for visual weight */
        .feature-ghost-id {
          position: absolute;
          right: -10px;
          bottom: -40px;
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-size: 180px;
          line-height: 1;
          color: rgba(255, 255, 255, 0.035);
          z-index: -1;
          pointer-events: none;
          transition: color 0.35s ease, transform 0.6s ease;
        }

        .feature-card--featured .feature-ghost-id {
          color: rgba(0, 0, 0, 0.12);
        }

        .feature-card:hover .feature-ghost-id {
          transform: scale(1.08);
        }

        /* HUD corner brackets, hidden until hover */
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
          font-size: clamp(24px, 3vw, 34px);
          letter-spacing: 0.01em;
          margin: 0 0 12px;
          color: #fff;
        }

        .feature-desc {
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
          max-width: 38ch;
        }

        .feature-card--featured .feature-desc {
          color: rgba(255, 255, 255, 0.85);
          max-width: 30ch;
        }

        .feature-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
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
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 860px) {
          .teasers {
            padding: 96px 24px 120px;
          }
          .feature-grid {
            grid-template-columns: 1fr;
            grid-template-rows: none;
          }
          .feature-grid > a:first-child {
            grid-row: auto;
          }
          .feature-ghost-id {
            font-size: 120px;
          }
        }
      `}</style>
    
    </>
  );
}