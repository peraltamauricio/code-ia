"use client";

import { useMemo, useState } from "react";
import SubNav from "@/components/SubNav";
import { guide, CATS, GuideEntry } from "@/lib/guide";
import { guias } from "@/lib/guias";

type Tab = GuideEntry["cat"] | "pasos";

export default function GuiaPage() {
  const [cat, setCat] = useState<Tab>("pasos");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(guias[0].id);

  const needle = q.trim().toLowerCase();

  const items = useMemo(() => {
    if (cat === "pasos") return [];
    const byCat = guide.filter((g) => g.cat === cat);
    if (!needle) return byCat;
    return byCat.filter(
      (g) => g.name.toLowerCase().includes(needle) || g.desc.toLowerCase().includes(needle)
    );
  }, [cat, needle]);

  const pasos = useMemo(() => {
    if (!needle) return guias;
    return guias.filter((g) =>
      [g.title, g.intro, ...g.pasos.map((p) => p.t + (p.code ?? ""))]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [needle]);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "pasos", label: "Paso a paso", icon: "🧭" },
    ...CATS,
  ];

  return (
    <>
      <div className="bg-grid" />
      <SubNav links={[{ href: "/jugar", label: "🎮 jugar" }]} />

      <section className="section" style={{ borderTop: "none" }}>
        <div className="wrap">
          <div className="section-head center">
            <span className="mono-tag">guia.machete</span>
            <h2 className="section-title">Guía rápida</h2>
            <p className="section-desc">
              Guías paso a paso para lo importante (portfolio, subir tu página a internet) y el
              machete de HTML, CSS y JavaScript para tener a mano en clase.
            </p>
          </div>

          <div className="guide-tabs">
            {tabs.map((c) => (
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
            placeholder={cat === "pasos" ? "Buscar (ej: vercel, imagen, botón)…" : "Buscar (ej: flexbox, botón, for)…"}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          {cat === "pasos" ? (
            <div className="howto-list">
              {pasos.map((g) => {
                const open = openId === g.id || !!needle;
                return (
                  <div key={g.id} className={`howto panel${open ? " is-open" : ""}`}>
                    <button
                      type="button"
                      className="howto-head"
                      aria-expanded={open}
                      onClick={() => setOpenId(openId === g.id ? null : g.id)}
                    >
                      <span className="howto-icon">{g.icon}</span>
                      <span style={{ flex: 1, textAlign: "left" }}>
                        <span className="howto-title">{g.title}</span>
                        <span className="howto-when">{g.when}</span>
                      </span>
                      <span className="howto-chevron">{open ? "−" : "+"}</span>
                    </button>
                    {open && (
                      <div className="howto-body">
                        <p className="howto-intro">{g.intro}</p>
                        <ol className="howto-steps">
                          {g.pasos.map((p, i) => (
                            <li key={i}>
                              <span className="howto-num">{i + 1}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p>{p.t}</p>
                                {p.code && (
                                  <pre className="guide-code">
                                    <code>{p.code}</code>
                                  </pre>
                                )}
                                {p.tip && <p className="howto-tip">💡 {p.tip}</p>}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })}
              {pasos.length === 0 && (
                <p className="level-desc" style={{ textAlign: "center" }}>
                  No encontré guías con &quot;{q}&quot;.
                </p>
              )}
            </div>
          ) : (
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
          )}
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
