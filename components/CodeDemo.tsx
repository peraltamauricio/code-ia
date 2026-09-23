"use client";

import { useEffect, useState } from "react";

type Token = { t: string; c?: "tag" | "str" | "plain" | "com" };

const TOKENS: Token[] = [
  { t: "<", c: "tag" },
  { t: "div", c: "tag" },
  { t: " class=", c: "plain" },
  { t: '"card"', c: "str" },
  { t: ">", c: "tag" },
  { t: "\n  ", c: "plain" },
  { t: "<", c: "tag" },
  { t: "h2", c: "tag" },
  { t: ">", c: "tag" },
  { t: "CODE +IA", c: "plain" },
  { t: "</", c: "tag" },
  { t: "h2", c: "tag" },
  { t: ">\n  ", c: "tag" },
  { t: "<", c: "tag" },
  { t: "p", c: "tag" },
  { t: ">", c: "tag" },
  { t: "Tu primer sitio, con ayuda de IA.", c: "plain" },
  { t: "</", c: "tag" },
  { t: "p", c: "tag" },
  { t: ">\n", c: "tag" },
  { t: "</", c: "tag" },
  { t: "div", c: "tag" },
  { t: ">", c: "tag" },
];

const TOTAL = TOKENS.reduce((n, tok) => n + tok.t.length, 0);

function renderTyped(count: number) {
  let remaining = count;
  return TOKENS.map((tok, i) => {
    if (remaining <= 0) return null;
    const slice = tok.t.slice(0, remaining);
    remaining -= tok.t.length;
    return (
      <span key={i} className={tok.c ? `code-${tok.c}` : undefined}>
        {slice}
      </span>
    );
  });
}

export default function CodeDemo() {
  const [typed, setTyped] = useState(0);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    let raf = 0;
    let i = 0;
    let last = performance.now();
    const step = (now: number) => {
      if (now - last > 22) {
        i = Math.min(TOTAL, i + 1);
        setTyped(i);
        last = now;
      }
      if (i < TOTAL) {
        raf = requestAnimationFrame(step);
      } else {
        setTimeout(() => setShowAI(true), 400);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="code-demo panel">
      <div className="code-demo-bar">
        <span className="code-dot" />
        <span className="code-dot" />
        <span className="code-dot" />
        <span className="code-demo-path">index.html</span>
      </div>
      <pre className="code-demo-body">
        <code>
          {renderTyped(typed)}
          {typed < TOTAL && <span className="code-cursor" />}
        </code>
      </pre>
      <div className={`ai-bubble${showAI ? " is-visible" : ""}`}>
        <span className="ai-bubble-dot" />
        IA: ¿le agrego una animación al botón?
      </div>
    </div>
  );
}
