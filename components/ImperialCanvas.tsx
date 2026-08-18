"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  pulseSpeed: number;
}

export default function ImperialCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    const colors = [
      "rgba(255, 59, 48, ",   // Electric Red
      "rgba(216, 15, 15, ",   // Imperial Red
      "rgba(255, 120, 80, ",  // Ember Orange
      "rgba(255, 255, 255, ", // Tactical White Spark
    ];

    const particleCount = Math.min(80, Math.floor(width / 20));
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: -(Math.random() * 0.7 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      maxOpacity: Math.random() * 0.7 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    let scanLineY = 0;
    const scanSpeed = 1.2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;
      const gridSize = 80;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Moving Scan Line
      scanLineY = (scanLineY + scanSpeed) % (height + 100);
      const gradient = ctx.createLinearGradient(0, scanLineY - 40, 0, scanLineY);
      gradient.addColorStop(0, "rgba(255, 59, 48, 0)");
      gradient.addColorStop(0.5, "rgba(255, 59, 48, 0.08)");
      gradient.addColorStop(1, "rgba(255, 59, 48, 0.25)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanLineY - 40, width, 40);

      ctx.strokeStyle = "rgba(255, 59, 48, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(width, scanLineY);
      ctx.stroke();

      // Mouse Spotlight
      if (mouseRef.current.active) {
        const radGrd = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          320
        );
        radGrd.addColorStop(0, "rgba(255, 40, 30, 0.18)");
        radGrd.addColorStop(0.5, "rgba(200, 10, 10, 0.06)");
        radGrd.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = radGrd;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 320, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.3;
        p.opacity += p.pulseSpeed;

        if (p.opacity > p.maxOpacity || p.opacity < 0.1) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
        }

        let drawSize = p.size;
        let drawOpacity = Math.max(0, p.opacity);

        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const factor = 1 - dist / 150;
            drawSize += factor * 2;
            drawOpacity = Math.min(1, drawOpacity + factor * 0.4);
          }
        }

        ctx.fillStyle = `${p.color}${drawOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 block w-full h-full"
    />
  );
}
