"use client";

import { useState } from "react";
import { curriculum, AiTool } from "@/lib/curriculum";

const ICONS: Record<number, string> = {
  1: "👋",
  2: "💬",
  3: "</>",
  4: "🎨",
  5: "⚡",
  6: "🧩",
  7: "🏗️",
  8: "📋",
  9: "🐛",
  10: "✨",
  11: "🚀",
  12: "🎤",
};

const TOOL_META: Record<AiTool, { color: string; short: string }> = {
  Claude: { color: "var(--violet-soft)", short: "CL" },
  ChatGPT: { color: "var(--amber)", short: "GPT" },
  Gemini: { color: "var(--sky)", short: "GEM" },
  "Las 3 IAs": { color: "var(--ink-dim)", short: "IA" },
};

export default function Clases() {
  const [selected, setSelected] = useState(1);
  const current = curriculum.find((c) => c.n === selected)!;

  return (
    <section className="section" id="clases">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="mono-tag">clases.teoria</span>
          <h2 className="section-title">Teoría, práctica y desafíos</h2>
          <p className="section-desc">
            Elegí una clase para ver su objetivo, un ejemplo real de prompt con la IA, la
            práctica guiada y el desafío exprés.
          </p>
        </div>

        <div className="class-grid reveal">
          {curriculum.map((c) => (
            <button
              key={c.n}
              type="button"
              onClick={() => setSelected(c.n)}
              className={`class-btn panel${c.n === selected ? " is-active" : ""}`}
            >
              <span className="class-btn-top">
                <span className="class-btn-icon">{ICONS[c.n]}</span>
                <span className="class-btn-num">C{String(c.n).padStart(2, "0")}</span>
              </span>
              <span className="class-btn-title">{c.title}</span>
              <span className="class-btn-foot">
                <span
                  className="tool-dot"
                  style={{ background: TOOL_META[c.tool].color }}
                  title={c.tool}
                />
                <span className="class-btn-tool">{c.tool}</span>
                {c.desafio && <span className="class-btn-tag">⚡</span>}
              </span>
            </button>
          ))}
        </div>

        <div className="panel class-detail" key={current.n} style={{ marginTop: 20 }}>
          <div className="class-detail-bar">
            <span className="code-dot" />
            <span className="code-dot" />
            <span className="code-dot" />
            <span className="code-demo-path">
              clase-{String(current.n).padStart(2, "0")}.md — modo desarrollador
            </span>
          </div>

          <div className="class-detail-head">
            <span className="class-detail-icon">{ICONS[current.n]}</span>
            <div style={{ flex: 1 }}>
              <span className="level-tag">CLASE {String(current.n).padStart(2, "0")} DE 12</span>
              <h3 style={{ fontSize: 19, margin: "4px 0 0" }}>{current.title}</h3>
            </div>
            <span
              className="tool-badge"
              style={{ ["--tool-color" as string]: TOOL_META[current.tool].color }}
            >
              <span className="tool-badge-dot" />
              {current.tool}
            </span>
          </div>

          <blockquote className="class-objetivo">{current.objetivo}</blockquote>
          {current.toolNote && <p className="tool-note">💡 {current.toolNote}</p>}

          <div className="mono-tag" style={{ margin: "22px 0 10px" }}>
            así se lo pedimos a la IA
          </div>
          <div className="ai-chat">
            <div className="ai-chat-row user">
              <span className="ai-chat-avatar">TÚ</span>
              <span className="ai-chat-bubble">{current.promptDemo}</span>
            </div>
            <div
              className="ai-chat-row ai"
              style={{ ["--tool-color" as string]: TOOL_META[current.tool].color }}
            >
              <span className="ai-chat-avatar ai-chat-avatar-tool">
                {TOOL_META[current.tool].short}
              </span>
              <span className="ai-chat-bubble">{current.aiReply}</span>
            </div>
          </div>

          <div className="vscode-steps">
            <div className="vscode-steps-head">
              <span className="vscode-icon">🖥</span> pasos en VS Code
            </div>
            <ol className="class-list class-list-num">
              {current.vscode.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="class-detail-grid">
            <div>
              <div className="mono-tag" style={{ marginBottom: 12 }}>
                teoría
              </div>
              <ul className="class-list">
                {current.teoria.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mono-tag" style={{ marginBottom: 12 }}>
                práctica guiada
              </div>
              <ul className="class-list class-list-check">
                {current.practica.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="class-outcome">
            <span className="class-outcome-icon">🏁</span>
            <div>
              <div className="class-outcome-label">entregable</div>
              <div className="class-outcome-text">{current.entregable}</div>
            </div>
          </div>

          {current.desafio ? (
            <div className="challenge-card">
              <div className="challenge-head">
                <span className="challenge-bolt">⚡</span>
                <span>DESAFÍO EXPRÉS</span>
                <span className="challenge-time">10-15 min</span>
              </div>
              <p className="challenge-text">{current.desafio}</p>
            </div>
          ) : (
            <div className="challenge-card is-welcome">
              <div className="challenge-head">
                <span className="challenge-bolt">🎉</span>
                <span>SIN DESAFÍO — ES DE BIENVENIDA</span>
              </div>
              <p className="challenge-text">
                La Clase 1 es rompehielos: el primer desafío arranca en la Clase 2.
              </p>
            </div>
          )}

          <div className="class-detail-nav">
            <button
              type="button"
              className="btn"
              disabled={selected === 1}
              onClick={() => setSelected((n) => Math.max(1, n - 1))}
            >
              ← anterior
            </button>
            <button
              type="button"
              className="btn btn-solid"
              disabled={selected === 12}
              onClick={() => setSelected((n) => Math.min(12, n + 1))}
            >
              siguiente →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
