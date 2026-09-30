"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { guide, CATS, GuideEntry } from "@/lib/guide";

export default function GuiaPage() {
  const [cat, setCat] = useState<GuideEntry["cat"]>("html");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const byCat = guide.filter((g) => g.cat === cat);
    if (!q.trim()) return byCat;
    const needle = q.trim().toLowerCase();
    return byCat.filter(
      (g) => g.name.toLowerCase().includes(needle) || g.desc.toLowerCase().includes(needle)
    );
  }, [cat, q]);

  return (
    <>
      <div className="bg-grid" />
      <header className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            <div className="brand-mark">+</div>
            CODE<span style={{ color: "var(--violet-soft)" }}>+IA</span>
          </Link>
          <Link className="btn nav-cta" href="/">
            ← volver al sitio
          </Link>
        </div>
      </header>

      <section className="section" style={{ borderTop: "none" }}>
        <div className="wrap">
          <div className="section-head center">
            <span className="mono-tag">guia.machete</span>
            <h2 className="section-title">Guía rápida</h2>
            <p className="section-desc">
              El machete de HTML, CSS y JavaScript para tener a mano durante las clases. Buscá lo
              que necesites o mirá por lenguaje.
            </p>
          </div>

          <div className="guide-tabs">
            {CATS.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`guide-tab${cat === c.key ? " is-active" : ""}`}
                onClick={() => setCat(c.key)}
              >
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="guide-search"
            placeholder="Buscar (ej: flexbox, botón, for)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="guide-grid">
            {items.map((item) => (
              <div key={item.name} className="panel guide-card">
                <h3 className="guide-card-title">{item.name}</h3>
                <p className="guide-card-desc">{item.desc}</p>
                <pre className="guide-code">
                  <code>{item.code}</code>
                </pre>
              </div>
            ))}
            {items.length === 0 && (
              <p className="level-desc" style={{ textAlign: "center", gridColumn: "1 / -1" }}>
                No encontré nada con &quot;{q}&quot; en {CATS.find((c) => c.key === cat)?.label}.
              </p>
            )}
          </div>
        </div>
      </section>

      <footer>
        <span className="brand-mini">
          CODE<span style={{ color: "var(--violet-soft)" }}>+IA</span>
        </span>
        hecho con IA, para la próxima generación de programadores
      </footer>
    </>
  );
}
