"use client";

import { useEffect, useRef } from "react";

/** Faint neural-network particle field behind the hero text. No orb, no rings — just atmosphere. */
export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0,
      raf = 0;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const NODE_COUNT = 60;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      W = canvas!.width = rect.width;
      H = canvas!.height = rect.height;
    }
    function makeNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }));
    }
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx!.strokeStyle = `rgba(196,139,255,${0.22 * (1 - d / 130)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx!.fillStyle = "rgba(196,139,255,0.75)";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 1.7, 0, Math.PI * 2);
        ctx!.fill();
      });
      raf = requestAnimationFrame(draw);
    }

    resize();
    makeNodes();
    draw();

    const onResize = () => {
      resize();
      makeNodes();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-particles"
      aria-hidden="true"
    />
  );
}
