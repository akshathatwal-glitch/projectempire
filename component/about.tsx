import Image from "next/image";


export default function About() {
  return (
    <main className="briefing">
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

        /* ---------- HERO ---------- */
        .hero {
          position: relative;
          height: 100vh; /* Changed to cover the complete screen */
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-image {
          object-fit: cover;
          object-position: center 30%;
          opacity: 0.9;
          filter: contrast(1.05) saturate(1.1);
        }

        .hero-glow {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 60% 55% at 50% 40%, rgba(214, 12, 12, 0.55), transparent 70%),
            linear-gradient(180deg, rgba(5, 5, 5, 0) 0%, rgba(5, 5, 5, 0.4) 70%, #050505 100%);
          animation: glow-pulse 5s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 16px;
        }

        .wordmark {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", "Arial Narrow Bold", sans-serif;
          font-weight: 400;
          font-size: clamp(64px, 14vw, 168px);
          line-height: 0.85;
          letter-spacing: 0.01em;
          margin: 0;
          color: #fff;
          text-shadow: 0 0 40px rgba(214, 12, 12, 0.5);
        }

        .wordmark-sub {
          margin: 14px 0 0;
          font-size: clamp(11px, 1.4vw, 14px);
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: #d0d0d0;
        }

        /* ---------- RED PANEL ---------- */
        .panel {
          margin:0 1px; /* Adjusted to account for removed sidebar */
          background: #f71413;
          background-image:
            radial-gradient(ellipse 70% 90% at 50% 10%, rgba(0,0,0,0.55), transparent 60%);
          border-radius: 2px;
          overflow: hidden;
        }

        .panel-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.25);
        }

        .panel-icons {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 16px;
        }

        .icon-glyph {
          opacity: 0.85;
        }

        .panel-wordmark {
          font-family: Impact, Haettenschweiler, "Franklin Gothic Bold", sans-serif;
          font-size: 18px;
          letter-spacing: 0.05em;
        }

        .panel-cta-mini {
          font-size: 11px;
          letter-spacing: 0.15em;
          border: 1px solid rgba(255,255,255,0.6);
          padding: 6px 10px;
          border-radius: 999px;
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
          left: 24px; /* Adjusted spacing since sidebar is removed */
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
        }

        .panel-headline {
          margin-left: auto;
          text-align: right;
          max-width: 560px;
          margin-top: 120px; /* Provides spacing below absolute positioned terminal */
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

        /* ---------- ABOUT ---------- */
        .about {
          padding: 64px 28px 96px;
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