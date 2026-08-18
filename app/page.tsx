"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import About from "@/components/about";
import Navbar from "@/components/navbar";
import FeatureTeasers from "@/components/FeatureTeasers";
import ImperialCanvas from "@/components/ImperialCanvas";
import TacticalOverlay from "@/components/TacticalOverlay";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const systemLogRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Subheading slides down with smooth blur-to-focus reveal
      tl.fromTo(
        subHeadingRef.current,
        {
          y: "-100vh",
          opacity: 0,
          filter: "blur(12px)",
        },
        {
          y: 0,
          opacity: 0.9,
          filter: "blur(1px)",
          duration: 1.4,
          ease: "power3.out",
        }
      );

      // 2. Cinematic 3D staggered word reveal for main heading
      tl.fromTo(
        ".heading-word",
        {
          y: 70,
          opacity: 0,
          rotateX: -65,
          scale: 0.85,
          filter: "blur(16px)",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: "blur(1px)",
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
        },
        "-=0.9"
      );

      // 3. Subtle floating / breathing ambient animation for heading
      gsap.to(headingRef.current, {
        y: "+=6",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.2,
      });

      if (systemLogRef.current) {
        gsap.fromTo(
          systemLogRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, delay: 0.5, ease: "power2.out" }
        );
      }
    },
    { scope: containerRef }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !headingRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(headingRef.current, {
      x: x * 25,
      y: y * 15,
      rotateY: x * 8,
      rotateX: -y * 8,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!headingRef.current) return;
    gsap.to(headingRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-screen flex flex-col items-end justify-end overflow-hidden bg-[#f41e16] bg-[url('/darth.png')] bg-cover bg-center bg-no-repeat px-6 pb-16 sm:px-12 sm:pb-20 md:px-16 md:pb-24"
        id="home"
      >
        {/* Ambient Canvas Particles & Tactical Scanline Overlay (non-intrusive background additions) */}
        <ImperialCanvas />
        <TacticalOverlay />

        {/* darkening layer so the floating navbar + text stay legible over the image */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" aria-hidden="true" />

        <Navbar />

        {/* Top bar info banner */}
        <div className="absolute top-20 left-0 w-full px-8 md:px-16 z-10 flex justify-between text-[11px] font-mono tracking-[0.2em] text-white/70 uppercase pointer-events-none">
          <span>CONCEPT PROJECT</span>
          <span className="hidden sm:inline">IMPERIAL SYSTEM ARCHIVE</span>
          <span>CLEARANCE OMEGA</span>
        </div>

        <div
          ref={subHeadingRef}
          className="absolute top-[-2rem] left-[5rem] z-10"
        >
          <h1 className="text-sideways" id="subheading">
            The Empire No Longer Hunts
          </h1>
        </div>

        {/* Bottom Left Serial & Intro Description */}
        <div className="absolute bottom-12 left-8 md:left-24 z-10 hidden sm:flex flex-col gap-2 font-mono text-xs text-white/70 max-w-xs">
          {/* <span className="font-bold tracking-widest text-white/90 text-sm">
            AP - 25R3F
          </span> */}
          <p className="font-sans text-xs text-white/75 leading-relaxed">
            An Imperial online network with dossiers, live Jedi tracking, and
            custom bounty features for galaxy-wide operations.
          </p>
        </div>

        {/* Vertical Socials Tag */}
        <div className="absolute bottom-28 left-6 z-10 hidden lg:flex items-center gap-3 -rotate-90 origin-left text-[10px] font-mono tracking-widest text-white/60 uppercase">
          <span>stay connected</span>
          <span className="h-px w-6 bg-white/40" />
        </div>

        <h1
          ref={headingRef}
          className="relative z-10 text-right text-white [perspective:1000px] transform-gpu "
          id="heading"
        >
          <span className="heading-word inline-block">Project</span>{" "}
          <span className="heading-word inline-block">Empire</span>{" "}
          <span className="heading-word text-spec inline-block">State</span>{" "}
          <span className="heading-word inline-block">of</span>{" "}
          <span className="heading-word inline-block">Mind</span>
        </h1>
      </div>

      {/* Red Glowing Laser Divider Bar */}
      <div className="relative h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_15px_#ff3b30] overflow-hidden z-20">
        <div className="absolute inset-0 bg-white/70 animate-laser-sweep" />
      </div>

      <About />
      <div className="relative w-full overflow-hidden border-y border-red-950/60 bg-[#050505] py-4">
        <ScrollBasedVelocity
          text="EMPIRE STATE OF MIND • ORDER 66 IS ACTIVE • GALAXY WIDE HUNT • CLEARANCE OMEGA • "
          default_velocity={2}
          className="font-mono text-2xl font-bold uppercase tracking-[0.2em] text-[#ff3b30]/85 drop-shadow-[0_0_15px_rgba(216,15,15,0.6)] sm:text-4xl"
        />
      </div>
      <FeatureTeasers />
    </>
  );
}