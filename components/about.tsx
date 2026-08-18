"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 1. PANEL ANIMATION
      const panelTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      panelTl
        .from(".panel-terminal p", {
          opacity: 0,
          x: -20,
          duration: 0.5,
          stagger: 0.4,
        })
        .from(
          ".panel-headline > *",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
          },
          "-=0.2"
        );

      // 2. ABOUT SECTION ANIMATION (Plays on scroll)
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      aboutTl
        .from(".about-row span", {
          opacity: 0,
          y: 10,
          duration: 0.6,
          stagger: 0.1,
        })
        .from(
          ".about-grid > *",
          {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
          },
          "-=0.4"
        );
    },
    { scope: containerRef }
  );

  return (
    <main className="briefing" ref={containerRef}>
      {/* ===== RED PANEL (Full Viewport Width) ===== */}
      <section className="panel relative w-full">
        {/* Animated Scanline Overlay */}
        <div className="absolute inset-x-0 h-0.5 bg-white/30 animate-laser-sweep pointer-events-none z-10" />

        <div className="panel-body">
          <div className="panel-terminal">
            <p>INITIALIZING UPLINK&hellip;</p>
            <p>DECRYPTING CHANNEL&hellip;</p>
            <p>CLEARANCE VERIFIED.</p>
          </div>

          <div className="panel-headline">
            <span className="panel-cta">ENTER &gt;</span>
            <h2>
              ORDER 66 IS <span className="accent">ACTIVE</span>
              <br />
              AND ONGOING
            </h2>
          </div>
        </div>
      </section>

      {/* ===== ABOUT / BRIEFING TEXT (Empire State of Mind Big on Left, Text on Right) ===== */}
      <section className="about">
        <div className="about-row">
          <span className="about-label">PROJECT</span>
          <span className="about-label about-label--right">ISB ARCHIVE DIRECTIVE</span>
        </div>

        <div className="about-grid">
          {/* BIG RED TITLE ON THE LEFT */}
          <h2 className="about-project-name">
            EMPIRE
            <br />
            STATE OF
            <br />
            MIND
          </h2>

          {/* PARAGRAPH TEXT ON THE RIGHT */}
          <p className="about-text">
            The Republic has fallen. Order 66 is in effect across every sector
            of the galaxy, and the last of the Jedi have scattered into
            hiding. <strong>Empire State of Mind</strong> is the Imperial
            Security Bureau&rsquo;s unified command portal &mdash; built to
            track sightings, coordinate hunting parties, and dismantle the
            Jedi&rsquo;s recruitment network before the so&#8209;called
            &ldquo;HCET Syndicate&rdquo; can regroup. Every dossier, broadcast,
            and holonet ping routes through this terminal. Clearance is
            absolute. Compliance is not optional.
          </p>
        </div>
      </section>

      <style>{`
        .briefing {
          background: #050505;
          color: #f5f5f5;
          font-family: "Helvetica Neue", Arial, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          width: 100%;
          padding: 0 0 60px;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          padding: 20px 28px;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: #8a8a8a;
          text-transform: uppercase;
        }

        .panel {
          width: 100%;
          background: #b5130e;
          background-image:
            radial-gradient(ellipse 80% 90% at 50% 10%, rgba(0,0,0,0.55), transparent 60%);
          border-radius: 0px;
          overflow: hidden;
        }

        .panel-body {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: 360px;
          padding: 48px 40px 48px;
          max-width: 1300px;
          margin: 0 auto;
        }

        .panel-terminal {
          position: absolute;
          left: 40px;
          top: 40px;
          max-width: 260px;
          font-size: 11px;
          line-height: 1.9;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.85);
          font-family: "Courier New", monospace;
        }

        .panel-terminal p {
          margin: 0;
          opacity: 0;
        }

        .panel-headline {
          margin-left: auto;
          text-align: right;
          max-width: 600px;
          margin-top: 100px;
        }

        .panel-cta {
          display: inline-block;
          margin-bottom: 10px;
          font-size: 13px;
          letter-spacing: 0.1em;
          font-weight: 700;
          border-bottom: 2px solid #fff;
          padding-bottom: 4px;
        }

        .panel-headline h2 {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-weight: 400;
          font-size: clamp(32px, 5.5vw, 60px);
          line-height: 1;
          margin: 0;
        }

        .accent {
          -webkit-text-stroke: 1.5px #fff;
          color: #d80f0f;
        }

        .about {
          padding: 80px 40px 40px;
          max-width: 1300px;
          margin: 0 auto;
        }

        .about-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 36px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 12px;
        }

        .about-label {
          font-size: 11px;
          letter-spacing: 0.25em;
          font-weight: 700;
          color: #d80f0f;
        }

        .about-label--right {
          color: #666;
        }

        .about-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 56px;
          align-items: center;
        }

        .about-project-name {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-size: clamp(48px, 6.5vw, 92px);
          line-height: 0.88;
          text-align: left;
          color: #d80f0f;
          margin: 0;
          white-space: nowrap;
          letter-spacing: 0.01em;
          text-shadow: 0 0 30px rgba(216, 15, 15, 0.45);
        }

        .about-text {
          font-size: 16.5px;
          line-height: 1.8;
          color: #d4d4d4;
          max-width: 680px;
          margin: 0;
        }

        .about-text strong {
          color: #fff;
          text-decoration: underline;
          text-decoration-color: #d80f0f;
          text-underline-offset: 4px;
        }

        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .about-project-name {
            font-size: clamp(42px, 10vw, 64px);
          }
          .panel-headline {
            margin-left: 0;
            text-align: left;
            margin-top: 40px;
          }
        }
      `}</style>
    </main>
  );
}