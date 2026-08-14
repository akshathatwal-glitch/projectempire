"use client";

import {useRef} from "react";
import gsap from "gsap";
import {useGSAP} from "@gsap/react"

import About from "@/component/about";
export default function Home() {

  const containerRef = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
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
  }
  );
  }, {scope: containerRef});
  return (
    <>
    <div ref={containerRef} className="w-full h-screen flex items-start justify-center bg-[#f41e16] overflow-hidden" id="home">

      <div ref={subHeadingRef} className="absolute top-[-2rem] left-[5rem]">
        <h1 className="text-sideways" id="subheading">
          The Empire No Longer Hunts
        </h1>
      </div>

      <h1 ref={headingRef} className="text-4xl font-bold text-white" id="heading">
        Project Empire <span className="text-spec">State</span> of Mind
      </h1>
    </div>
      <About />
      </>
      
  );
}