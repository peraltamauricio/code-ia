"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AVATARES,
  FUENTES,
  FuenteKey,
  HABILIDADES_SUGERIDAS,
  PROYECTOS_BASE,
  PortfolioData,
  Proyecto,
  TEMAS,
  TemaKey,
  buildPortfolio,
  defaultPortfolio,
} from "@/lib/portfolio";

const STORE = "codeia-portfolio";
const STEPS = [
  { icon: "👤", label: "Sobre vos" },
  { icon: "🎨", label: "Estilo" },
  { icon: "🗂️", label: "Proyectos" },
  { icon: "📬", label: "Contacto" },
];
const MAX_PROYECTOS = 6;

function clone(d: PortfolioData): PortfolioData {
  return JSON.parse(JSON.stringify(d));
}

export default function PortfolioBuilder() {
  const [data, setData] = useState<PortfolioData>(() => clone(defaultPortfolio));
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"editar" | "ver">("editar");
  const [device, setDevice] = useState<"compu" | "cel">("compu");
  const [doc, setDoc] = useState("");
  const [copied, setCopied] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const loaded = useRef(false);

  // Recupero el borrador (se guarda en este navegador, así pueden seguir en la próxima clase).
  useEffect(() => {
    try {
      const v = localStorage.getItem(STORE);
      if (v) setData({ ...clone(defaultPortfolio), ...JSON.parse(v) });
    } catch {
      /* sin borrador */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORE, JSON.stringify(data));
      } catch {
        /* sin guardado */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [data]);

  // La vista previa se actualiza un ratito después de dejar de escribir.
  useEffect(() => {
    const t = setTimeout(() => setDoc(buildPortfolio(data)), 350);
    return () => clearTimeout(t);
  }, [data]);

  const html = useMemo(() => buildPortfolio(data), [data]);

  function set<K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function setProyecto(i: number, patch: Partial<Proyecto>) {
    setData((d) => ({ ...d, proyectos: d.proyectos.map((p, k) => (k === i ? { ...p, ...patch } : p)) }));
  }

  function addProyecto(p: Proyecto) {
    setData((d) => (d.proyectos.length >= MAX_PROYECTOS ? d : { ...d, proyectos: [...d.proyectos, { ...p }] }));
  }

  function removeProyecto(i: number) {
    setData((d) => ({ ...d, proyectos: d.proyectos.filter((_, k) => k !== i) }));
  }

  function moveProyecto(i: number, dir: -1 | 1) {
    setData((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.proyectos.length) return d;
      const list = [...d.proyectos];
      [list[i], list[j]] = [list[j], list[i]];
      return { ...d, proyectos: list };
    });
  }

  function toggleSkill(s: string) {
    setData((d) => ({
      ...d,
      habilidades: d.habilidades.includes(s) ? d.habilidades.filter((x) => x !== s) : [...d.habilidades, s],
    }));
  }

  function addCustomSkill() {
    const s = customSkill.trim();
    if (!s) return;
    setData((d) => (d.habilidades.includes(s) ? d : { ...d, habilidades: [...d.habilidades, s] }));
    setCustomSkill("");
  }

  function download() {
    const blob = new Blob([html], { type: "text/html" });
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = "index.html";
    a.click();
    URL.revokeObjectURL(u);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("No se pudo copiar. Usá el botón de descargar.");
    }
  }

  function reset() {
    if (!confirm("¿Empezar de cero?\n\nSe borra todo lo que completaste.")) return;
    setData(clone(defaultPortfolio));
    setStep(0);
  }

  const proyectosFaltan = Object.entries(PROYECTOS_BASE).filter(([, base]) => !data.proyectos.some((p) => p.titulo === base.titulo));

  return (
    <div>
      {/* Pasos */}
      <div className="pf-tabs-mobile">
        <button type="button" className={`guide-tab${view === "editar" ? " is-active" : ""}`} onClick={() => setView("editar")}>
          ✏️ Editar
        </button>
        <button type="button" className={`guide-tab${view === "ver" ? " is-active" : ""}`} onClick={() => setView("ver")}>
          👁 Ver mi portfolio
        </button>
      </div>

      <div className="pf-layout">
        <div className={`pf-form panel${view === "ver" ? " is-hidden-mobile" : ""}`}>
          <div className="pf-steps">
            {STEPS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                className={`pf-step${step === i ? " is-active" : ""}${i < step ? " is-past" : ""}`}
                onClick={() => setStep(i)}
              >
                <span className="pf-step-icon">{s.icon}</span>
                <span className="pf-step-label">{s.label}</span>
              </button>
            ))}
          </div>

          {step === 0 && (
            <div className="pf-fields">
              <label className="pf-label">
                Tu nombre
                <input className="pf-input" value={data.nombre} maxLength={40} placeholder="Ej: Sofía Ramírez" onChange={(e) => set("nombre", e.target.value)} />
              </label>
              <label className="pf-label">
                Una frase sobre vos
                <input className="pf-input" value={data.frase} maxLength={140} onChange={(e) => set("frase", e.target.value)} />
              </label>
              <label className="pf-label">
                Sobre mí <span className="pf-help">(escribí a mano, con tus palabras)</span>
                <textarea className="pf-input" rows={5} value={data.sobreMi} maxLength={600} onChange={(e) => set("sobreMi", e.target.value)} />
              </label>

              <div className="pf-label">
                Tu avatar
                <div className="pf-chips">
                  {AVATARES.map((a) => (
                    <button key={a} type="button" className={`pf-emoji${data.avatar === a ? " is-active" : ""}`} onClick={() => set("avatar", a)}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pf-label">
                Lo que sabés hacer
                <div className="pf-chips">
                  {[...new Set([...HABILIDADES_SUGERIDAS, ...data.habilidades])].map((s) => (
                    <button key={s} type="button" className={`pf-chip${data.habilidades.includes(s) ? " is-active" : ""}`} onClick={() => toggleSkill(s)}>
                      {data.habilidades.includes(s) ? "✓ " : ""}
                      {s}
                    </button>
                  ))}
                </div>
                <div className="pf-inline">
                  <input
                    className="pf-input"
                    value={customSkill}
                    placeholder="Sumar otra (ej: Photoshop)"
                    maxLength={24}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                  />
                  <button type="button" className="btn" onClick={addCustomSkill} style={{ padding: "10px 18px" }}>
                    + sumar
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="pf-fields">
              <div className="pf-label">
                Colores
                <div className="pf-swatches">
                  {(Object.keys(TEMAS) as TemaKey[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`pf-swatch${data.tema === k ? " is-active" : ""}`}
                      onClick={() => set("tema", k)}
                      style={{ background: `linear-gradient(135deg, ${TEMAS[k].a}, ${TEMAS[k].b})` }}
                      title={TEMAS[k].name}
                    >
                      <span>{TEMAS[k].name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pf-label">
                Modo
                <div className="pf-inline">
                  <button type="button" className={`guide-tab${data.modo === "oscuro" ? " is-active" : ""}`} onClick={() => set("modo", "oscuro")}>
                    🌙 Oscuro
                  </button>
                  <button type="button" className={`guide-tab${data.modo === "claro" ? " is-active" : ""}`} onClick={() => set("modo", "claro")}>
                    ☀️ Claro
                  </button>
                </div>
                <span className="pf-help">Tu portfolio también va a tener un botón para que cada visitante lo cambie.</span>
              </div>
              <div className="pf-label">
                Tipo de letra
                <div className="pf-inline" style={{ flexWrap: "wrap" }}>
                  {(Object.keys(FUENTES) as FuenteKey[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`guide-tab${data.fuente === k ? " is-active" : ""}`}
                      style={{ fontFamily: FUENTES[k].css }}
                      onClick={() => set("fuente", k)}
                    >
                      {FUENTES[k].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="pf-fields">
              <p className="pf-help" style={{ margin: 0 }}>
                Sumá tus proyectos del taller (hasta {MAX_PROYECTOS}). El <b>link</b> es la carpeta de cada proyecto
                dentro de tu carpeta <code>portfolio/</code>.
              </p>
              {data.proyectos.map((p, i) => (
                <div key={i} className="pf-proyecto">
                  <div className="pf-proyecto-head">
                    <input className="pf-input pf-emoji-input" value={p.emoji} maxLength={4} onChange={(e) => setProyecto(i, { emoji: e.target.value })} aria-label="Emoji" />
                    <input className="pf-input" value={p.titulo} maxLength={40} placeholder="Título del proyecto" onChange={(e) => setProyecto(i, { titulo: e.target.value })} />
                    <button type="button" className="pf-mini" onClick={() => moveProyecto(i, -1)} disabled={i === 0} title="Subir">
                      ↑
                    </button>
                    <button type="button" className="pf-mini" onClick={() => moveProyecto(i, 1)} disabled={i === data.proyectos.length - 1} title="Bajar">
                      ↓
                    </button>
                    <button type="button" className="pf-mini is-danger" onClick={() => removeProyecto(i)} title="Quitar">
                      ✕
                    </button>
                  </div>
                  <textarea className="pf-input" rows={2} value={p.desc} maxLength={140} placeholder="¿De qué trata?" onChange={(e) => setProyecto(i, { desc: e.target.value })} />
                  <label className="pf-label">
                    Link <span className="pf-help">(ej: spotify/index.html)</span>
                    <input className="pf-input" value={p.link} onChange={(e) => setProyecto(i, { link: e.target.value })} />
                  </label>
                  <label className="pf-label">
                    Captura <span className="pf-help">(opcional, ej: img/spotify.png)</span>
                    <input className="pf-input" value={p.imagen} placeholder="Si lo dejás vacío se usa el emoji" onChange={(e) => setProyecto(i, { imagen: e.target.value })} />
                  </label>
                </div>
              ))}
              {data.proyectos.length < MAX_PROYECTOS && (
                <div className="pf-chips">
                  {proyectosFaltan.map(([k, base]) => (
                    <button key={k} type="button" className="pf-chip" onClick={() => addProyecto(base)}>
                      + {base.emoji} {base.titulo}
                    </button>
                  ))}
                  <button type="button" className="pf-chip" onClick={() => addProyecto({ emoji: "✨", titulo: "", desc: "", link: "", imagen: "" })}>
                    + Otro proyecto
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="pf-fields">
              <p className="pf-help" style={{ margin: 0 }}>
                Completá solo lo que quieras mostrar. <b>Cuidado:</b> tu portfolio es público, así que no pongas tu
                teléfono ni tu dirección.
              </p>
              <label className="pf-label">
                Email
                <input className="pf-input" type="email" value={data.email} placeholder="tu@mail.com" onChange={(e) => set("email", e.target.value)} />
              </label>
              <label className="pf-label">
                Instagram <span className="pf-help">(tu usuario)</span>
                <input className="pf-input" value={data.instagram} placeholder="@tuusuario" onChange={(e) => set("instagram", e.target.value)} />
              </label>
              <label className="pf-label">
                GitHub <span className="pf-help">(opcional)</span>
                <input className="pf-input" value={data.github} placeholder="tuusuario" onChange={(e) => set("github", e.target.value)} />
              </label>
            </div>
          )}

          <div className="pf-nav">
            <button type="button" className="btn" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              ← Atrás
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" className="btn btn-solid" onClick={() => setStep((s) => s + 1)}>
                Siguiente →
              </button>
            ) : (
              <a className="btn btn-solid" href="#descargar">
                ¡Listo! Descargar ↓
              </a>
            )}
          </div>
          <button type="button" className="logout-link" onClick={reset} style={{ fontSize: 12, marginTop: 10 }}>
            ↺ empezar de cero
          </button>
        </div>

        <div className={`pf-preview${view === "editar" ? " is-hidden-mobile" : ""}`}>
          <div className="pf-toolbar">
            <span className="pf-help">Así se ve tu portfolio, en vivo 👇</span>
            <div className="pf-inline">
              <button type="button" className={`guide-tab pf-dev${device === "compu" ? " is-active" : ""}`} onClick={() => setDevice("compu")}>
                💻
              </button>
              <button type="button" className={`guide-tab pf-dev${device === "cel" ? " is-active" : ""}`} onClick={() => setDevice("cel")}>
                📱
              </button>
            </div>
          </div>
          <div className={`pf-frame-wrap${device === "cel" ? " is-cel" : ""}`}>
            <iframe className="pf-frame" title="Vista previa de tu portfolio" sandbox="allow-scripts" srcDoc={doc} />
          </div>
        </div>
      </div>

      <div id="descargar" className="pf-done panel">
        <h3 className="pf-done-title">🎉 ¿Quedó como querías? Descargalo</h3>
        <p className="game-desc" style={{ margin: "0 0 14px", maxWidth: "none" }}>
          Se descarga un solo archivo, <b>index.html</b>, con todo adentro (diseño y código). Abrilo en VS Code
          para ver cómo está hecho y cambiale lo que quieras.
        </p>
        {!data.nombre.trim() && <p className="game-best" style={{ margin: "0 0 12px" }}>⚠ Todavía no pusiste tu nombre (paso 1).</p>}
        <div className="game-row" style={{ justifyContent: "flex-start" }}>
          <button type="button" className="btn btn-solid spotlight" onClick={download}>
            ⬇ Descargar index.html
          </button>
          <button type="button" className="btn" onClick={copy}>
            {copied ? "✓ ¡Copiado!" : "📋 Copiar el código"}
          </button>
        </div>
        <div className="pf-next">
          <b>Después:</b> creá una carpeta <code>portfolio/</code>, guardá adentro este <code>index.html</code> y las
          carpetas de tus proyectos, y seguí el paso a paso de abajo para subirla a internet con Netlify 👇
        </div>
      </div>
    </div>
  );
}
