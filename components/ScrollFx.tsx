"use client";

import { useEffect } from "react";

export default function ScrollFx() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in-view"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }

    const nav = document.querySelector("header.nav");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // count-up for numeric stat values — always ends at the real value,
    // even if the animated path is skipped (reduced motion, no rAF, etc.)
    const counters = document.querySelectorAll<HTMLElement>("[data-count-to]");
    counters.forEach((el) => {
      const target = Number(el.dataset.countTo);
      if (!Number.isFinite(target)) return;
      if (reduceMotion) {
        el.textContent = String(target);
        return;
      }
      const start = performance.now();
      const duration = 1100;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = String(Math.floor(p * target));
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = String(target);
      };
      requestAnimationFrame(tick);
    });

    // cursor-following glow on any .spotlight element (buttons, cards)
    const onPointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(".spotlight, .panel");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      target.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    if (!reduceMotion) document.addEventListener("pointermove", onPointerMove);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return null;
}
