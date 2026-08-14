"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // ==========================================
    // 1. PANEL ANIMATION (Plays immediately on load)
    // ==========================================
    const panelTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    panelTl
      .from(".panel-terminal p", {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.4,
      })
      .from(".panel-headline > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
      }, "-=0.2");

    // ==========================================
    // 2. ABOUT SECTION ANIMATION (Plays on scroll)
    // ==========================================
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".about",
        start: "top 80%", // Animates when the top of the .about section reaches 80% down the screen
        toggleActions: "play none none none", // Only plays once
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
      .from(".about-grid > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
      }, "-=0.4");
      
  }, { scope: containerRef });

  return (
    <main className="briefing" ref={containerRef}>
      {/* ===== RED PANEL ===== */}
      <section className="panel">
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

      {/* ===== ABOUT / BRIEFING TEXT ===== */}
      <section className="about">
        <div className="about-row">
          <span className="about-label">ABOUT</span>
          <span className="about-label about-label--right">PROJECT</span>
        </div>
        <div className="about-grid">
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
          <p className="about-project-name">
            EMPIRE
            <br />
            STATE OF
            <br />
            MIND
          </p>
        </div>
      </section>

      <style>{`
        /* Keep all your previous CSS exactly the same here */
        .briefing {
          background: #050505;
          color: #f5f5f5;
          font-family: "Helvetica Neue", Arial, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          width: 100vw;
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
          margin:0 1px;
          background: #b5130e;
          background-image:
            radial-gradient(ellipse 70% 90% at 50% 10%, rgba(0,0,0,0.55), transparent 60%);
          border-radius: 2px;
          overflow: hidden;
        }

        .panel-body {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: 340px;
          padding: 32px 24px 40px;
        }

        .panel-terminal {
          position: absolute;
          left: 24px;
          top: 32px;
          max-width: 220px;
          font-size: 11px;
          line-height: 1.9;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.85);
          font-family: "Courier New", monospace;
        }

        .panel-terminal p {
          margin: 0;
          opacity: 0; /* Prevents flash before GSAP kicks in */
        }

        .panel-headline {
          margin-left: auto;
          text-align: right;
          max-width: 560px;
          margin-top: 120px;
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
          font-size: clamp(28px, 5vw, 52px);
          line-height: 1;
          margin: 0;
        }

        .accent {
          -webkit-text-stroke: 1.5px #fff;
          color: #d80f0f;
        }

        .about {
          padding: 64px 28px 36px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .about-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .about-label {
          font-size: 11px;
          letter-spacing: 0.25em;
          font-weight: 700;
          color: #8a8a8a;
        }

        .about-label--right {
          color: #444;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          align-items: start;
        }

        .about-text {
          font-size: 15px;
          line-height: 1.75;
          color: #c9c9c9;
          max-width: 640px;
        }

        .about-text strong {
          color: #fff;
        }

        .about-project-name {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-size: clamp(22px, 3vw, 34px);
          line-height: 0.95;
          text-align: right;
          color: #d80f0f;
          margin: 0;
          white-space: nowrap;
        }

        @media (max-width: 720px) {
          .panel-terminal {
            left: 24px;
            top: 32px;
            position: relative;
            margin-bottom: 40px;
          }
          .panel-headline {
            margin-left: 0;
            text-align: left;
            margin-top: 0;
          }
          .about-grid {
            grid-template-columns: 1fr;
          }
          .about-project-name {
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}