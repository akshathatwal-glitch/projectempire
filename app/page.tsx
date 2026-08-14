"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import About from "@/components/about";
import Navbar from "@/components/navbar";
import FeatureTeasers from "@/components/FeatureTeasers";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.from(subHeadingRef.current, {
        y: "-100vh",
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(headingRef.current, {
        x: "100vw",
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-screen flex items-start justify-center overflow-hidden bg-[#f41e16] bg-[url('/images/darth.png')] bg-cover bg-center bg-no-repeat"
        id="home"
      >
        {/* darkening layer so the floating navbar + text stay legible over the image */}
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

        <Navbar />

        <div
          ref={subHeadingRef}
          className="absolute top-[-2rem] left-[5rem] z-10"
        >
          <h1 className="text-sideways" id="subheading">
            The Empire No Longer Hunts
          </h1>
        </div>

        <h1
          ref={headingRef}
          className="relative z-10 mt-32 text-4xl font-bold text-white sm:mt-40"
          id="heading"
        >
          Project Empire <span className="text-spec">State</span> of Mind
        </h1>
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