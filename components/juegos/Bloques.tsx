"use client";

import { DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { Block, BReto, CATS, DEFS, Field, IMAGENES, PALETTE, bretos, generate, newBlock, snippet } from "@/lib/bloques";
import { buildDoc, downloadDoc } from "./preview";

const DONE_KEY = "codeia-bloques-done";
const draftKey = (m: string) => `codeia-bloques-${m}`;

// Todo se guarda en el navegador de cada alumno (si no se puede, anda igual).
function readDone(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(DONE_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeDone(d: Record<string, boolean>) {
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify(d));
  } catch {
    /* sin guardado */
  }
}
function readDraft(m: string): Block[] | null {
  try {
    const v = localStorage.getItem(draftKey(m));
    const list = v ? (JSON.parse(v) as Block[]) : null;
    return Array.isArray(list) ? list.filter((b) => DEFS[b.kind]) : null;
  } catch {
    return null;
  }
}
function writeDraft(m: string, blocks: Block[]) {
  try {
    localStorage.setItem(draftKey(m), JSON.stringify(blocks));
  } catch {
    /* sin guardado */
  }
}

const clone = (list: Block[]) => list.map((b) => ({ ...b, vals: { ...b.vals } }));

export default function Bloques() {
  const [mode, setMode] = useState("libre");
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => setDone(readDone()), []);

  const reto = bretos.find((r) => r.id === mode);

  return (
    <div>
      <div className="bq-modes">
        <button type="button" className={`guide-tab${mode === "libre" ? " is-active" : ""}`} onClick={() => setMode("libre")}>
          🧩 Modo libre
        </button>
        {bretos.map((r) => (
          <button key={r.id} type="button" className={`guide-tab${mode === r.id ? " is-active" : ""}`} onClick={() => setMode(r.id)}>
            {done[r.id] ? "✅" : r.icon} {r.title}
          </button>
        ))}
      </div>
      <Editor
        key={mode}
        mode={mode}
        reto={reto}
        onDone={(id) => {
          const d = { ...readDone(), [id]: true };
          writeDone(d);
          setDone(d);
        }}
      />
    </div>
  );
}

function Editor({ mode, reto, onDone }: { mode: string; reto?: BReto; onDone: (id: string) => void }) {
  const [blocks, setBlocks] = useState<Block[]>(() => (reto ? clone(reto.start) : []));
  const [showCode, setShowCode] = useState(true);
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [doc, setDoc] = useState("");
  const [results, setResults] = useState<boolean[] | null>(null);
  const [hints, setHints] = useState<Set<number>>(new Set());
  const [usedSolution, setUsedSolution] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  // El lugar donde se va a soltar, también en una ref para que "soltar" lo lea al instante.
  const overRef = useRef<number | null>(null);
  const setOver = (v: number | null) => {
    overRef.current = v;
    setOverIdx(v);
  };
  const [copied, setCopied] = useState(false);

  const frame = useRef<HTMLIFrameElement>(null);
  const checkId = useRef(0);
  const nonce = useRef(0);
  const loaded = useRef(false);

  // Recupero lo que había armado.
  useEffect(() => {
    const d = readDraft(mode);
    if (d && d.length) setBlocks(d);
    loaded.current = true;
  }, [mode]);

  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => writeDraft(mode, blocks), 500);
    return () => clearTimeout(t);
  }, [blocks, mode]);

  const gen = useMemo(() => generate(blocks), [blocks]);

  // La vista previa se actualiza un ratito después de cada cambio.
  useEffect(() => {
    const t = setTimeout(() => setDoc(buildDoc(gen.html, gen.css, gen.js, true) + `<!--${++nonce.current}-->`), 400);
    return () => clearTimeout(t);
  }, [gen]);

  function onLoad() {
    if (!reto) return;
    const w = frame.current?.contentWindow;
    if (!w || !doc) return;
    const id = ++checkId.current;
    w.postMessage({ codeiaCheck: true, id, tests: reto.misiones.map((m) => m.test) }, "*");
  }

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data;
      if (d && d.codeia === true && d.kind === "checks" && d.id === checkId.current) setResults(d.results as boolean[]);
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const total = reto?.misiones.length ?? 0;
  const ok = results ? results.filter(Boolean).length : 0;
  const all = !!reto && results !== null && results.length === total && ok === total;

  useEffect(() => {
    if (reto && all && !celebrated) {
      setCelebrated(true);
      if (!usedSolution) onDone(reto.id);
    }
  }, [all, celebrated, usedSolution, onDone, reto]);

  // ---- operaciones con los bloques ----
  function add(kind: string, at?: number) {
    setBlocks((b) => {
      const i = at ?? b.length;
      return [...b.slice(0, i), newBlock(kind), ...b.slice(i)];
    });
  }
  function remove(id: string) {
    setBlocks((b) => b.filter((x) => x.id !== id));
  }
  function move(id: string, dir: -1 | 1) {
    setBlocks((b) => {
      const i = b.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= b.length) return b;
      const list = [...b];
      [list[i], list[j]] = [list[j], list[i]];
      return list;
    });
  }
  function setVal(id: string, key: string, val: string) {
    setBlocks((b) => b.map((x) => (x.id === id ? { ...x, vals: { ...x.vals, [key]: val } } : x)));
  }
  function dropAt(data: string, index: number) {
    if (data.startsWith("pal:")) {
      add(data.slice(4), index);
    } else if (data.startsWith("blk:")) {
      const id = data.slice(4);
      setBlocks((b) => {
        const from = b.findIndex((x) => x.id === id);
        if (from < 0) return b;
        const rest = b.filter((_, i) => i !== from);
        const to = index > from ? index - 1 : index;
        return [...rest.slice(0, to), b[from], ...rest.slice(to)];
      });
    }
  }

  function clearAll() {
    if (!confirm(reto ? "¿Empezar de cero?\n\nSe borra lo que armaste en este reto." : "¿Vaciar todos los bloques?")) return;
    setBlocks(reto ? clone(reto.start) : []);
    setUsedSolution(false);
    setCelebrated(false);
  }
  function showSolution() {
    if (!reto) return;
    if (!confirm("¿Ver la solución?\n\nSi la cargás, este reto ya no cuenta como superado. Probá primero con las pistas 💡")) return;
    setUsedSolution(true);
    setBlocks(clone(reto.solution));
  }
  function loadExample() {
    if (blocks.length && !confirm("Esto reemplaza los bloques que tenés. ¿Seguimos?")) return;
    setBlocks(clone(bretos[1].solution));
  }
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(gen[tab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("No se pudo copiar el código.");
    }
  }

  function renderField(f: Field, b: Block) {
    const val = b.vals[f.key] ?? f.def;
    switch (f.type) {
      case "text":
        return (
          <input
            key={f.key}
            className="sb-in"
            value={val}
            list={f.list ? "bq-imgs" : undefined}
            placeholder={f.placeholder}
            size={Math.min(Math.max(val.length + 1, 6), 28)}
            onChange={(e) => setVal(b.id, f.key, e.target.value)}
          />
        );
      case "textarea":
        return (
          <textarea
            key={f.key}
            className="sb-in sb-ta"
            value={val}
            rows={Math.min(5, Math.max(2, val.split("\n").length))}
            onChange={(e) => setVal(b.id, f.key, e.target.value)}
          />
        );
      case "color":
        return <input key={f.key} type="color" className="sb-color" value={val} onChange={(e) => setVal(b.id, f.key, e.target.value)} />;
      case "number":
        return (
          <span key={f.key} className="sb-numwrap">
            <input type="number" className="sb-in sb-num" min={f.min} max={f.max} value={val} onChange={(e) => setVal(b.id, f.key, e.target.value)} />
            {f.suffix}
          </span>
        );
      case "select":
        return (
          <select key={f.key} className="sb-in" value={val} onChange={(e) => setVal(b.id, f.key, e.target.value)}>
            {f.options.map((o) => (
              <option key={o.v} value={o.v}>
                {o.l}
              </option>
            ))}
          </select>
        );
    }
  }

  function onHandleDrag(e: DragEvent<HTMLElement>, id: string) {
    e.dataTransfer.setData("text/plain", `blk:${id}`);
    e.dataTransfer.effectAllowed = "move";
    const wrap = (e.currentTarget as HTMLElement).closest(".sb-wrap");
    if (wrap) e.dataTransfer.setDragImage(wrap as HTMLElement, 12, 12);
  }

  return (
    <div className="bq panel">
      <datalist id="bq-imgs">
        {IMAGENES.map((u) => (
          <option key={u} value={u} />
        ))}
      </datalist>

      {reto && (
        <div className="bq-reto">
          <div className="reto-head">
            <div className="reto-title">
              <span>{reto.icon}</span> {reto.title}
            </div>
            <span className="reto-count">
              {ok}/{total} misiones
            </span>
          </div>
          <div className="path-bar" style={{ margin: "10px 0" }}>
            <div className="path-bar-fill" style={{ width: `${total ? (ok / total) * 100 : 0}%` }} />
          </div>
          <p className="reto-intro">{reto.intro}</p>
          {all &&
            (usedSolution ? (
              <div className="reto-win is-soft">Todas las misiones están en verde, pero como cargaste la solución este reto no cuenta. ¡Probalo de nuevo desde cero!</div>
            ) : (
              <div className="reto-win">
                🎉 <b>¡Reto superado!</b> Cumpliste las {total} misiones.
              </div>
            ))}
          <ol className="bq-missions">
            {reto.misiones.map((m, i) => {
              const isDone = !!results?.[i];
              return (
                <li key={i} className={`reto-mission${isDone ? " is-done" : ""}`}>
                  <span className="reto-check">{isDone ? "✓" : i + 1}</span>
                  <div className="reto-mission-body">
                    <p>{m.t}</p>
                    {!isDone && m.hint && (
                      <button
                        type="button"
                        className="reto-hint-btn"
                        onClick={() =>
                          setHints((h) => {
                            const n = new Set(h);
                            if (n.has(i)) n.delete(i);
                            else n.add(i);
                            return n;
                          })
                        }
                      >
                        {hints.has(i) ? "ocultar pista" : "💡 pista"}
                      </button>
                    )}
                    {!isDone && hints.has(i) && m.hint && <p className="reto-hint">{m.hint}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="bq-grid">
        {/* Paleta de bloques */}
        <div className="bq-pal">
          {CATS.map((c) => (
            <div key={c.key} className="bq-pal-cat">
              <div className="bq-pal-head">
                {c.icon} {c.label} <span>{c.help}</span>
              </div>
              {PALETTE.filter((d) => d.cat === c.key).map((d) => (
                <div
                  key={d.kind}
                  className={`sb sb-${d.cat} is-palette`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", `pal:${d.kind}`);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onClick={() => add(d.kind)}
                  title="Arrastralo a la zona del medio, o tocalo para sumarlo"
                >
                  <span>{d.icon}</span> {d.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Zona de armado */}
        <div className="bq-mid">
          <div className="bq-toolbar">
            <label className="bq-check">
              <input type="checkbox" checked={showCode} onChange={(e) => setShowCode(e.target.checked)} /> Ver el código de cada bloque
            </label>
          </div>
          <div
            className="bq-work"
            onDragOver={(e) => {
              e.preventDefault();
              if (overRef.current === null) setOver(blocks.length);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              dropAt(e.dataTransfer.getData("text/plain"), overRef.current ?? blocks.length);
              setOver(null);
            }}
          >
            {blocks.length === 0 && <div className="bq-empty">👈 Arrastrá bloques hasta acá (o tocá uno de la izquierda) para armar tu página.</div>}
            {blocks.map((b, i) => {
              const d = DEFS[b.kind];
              return (
                <div key={b.id}>
                  <div className={`bq-drop${overIdx === i ? " is-over" : ""}`} />
                  <div
                    className="sb-wrap"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const r = e.currentTarget.getBoundingClientRect();
                      setOver(e.clientY < r.top + r.height / 2 ? i : i + 1);
                    }}
                  >
                    <div className={`sb sb-${d.cat}`}>
                      <span className="sb-handle" draggable onDragStart={(e) => onHandleDrag(e, b.id)} onDragEnd={() => setOver(null)} title="Arrastrá para cambiar de lugar">
                        ⠿
                      </span>
                      <span>{d.icon}</span>
                      {d.row.map((piece, k) =>
                        typeof piece === "string" ? (
                          <span key={k} className="sb-t">
                            {piece}
                          </span>
                        ) : (
                          renderField(d.fields.find((f) => f.key === piece.f)!, b)
                        )
                      )}
                      <span className="sb-ctl">
                        <button type="button" onClick={() => move(b.id, -1)} disabled={i === 0} aria-label="Subir">
                          ▲
                        </button>
                        <button type="button" onClick={() => move(b.id, 1)} disabled={i === blocks.length - 1} aria-label="Bajar">
                          ▼
                        </button>
                        <button type="button" onClick={() => remove(b.id)} aria-label="Quitar">
                          ✕
                        </button>
                      </span>
                    </div>
                    {showCode && <pre className="sb-code">{snippet(b)}</pre>}
                  </div>
                </div>
              );
            })}
            <div className={`bq-drop${overIdx === blocks.length ? " is-over" : ""}`} />
          </div>
          <div className="game-row" style={{ justifyContent: "flex-start", marginTop: 12 }}>
            {reto ? (
              <>
                <button type="button" className="btn" onClick={clearAll}>
                  ↺ Empezar de cero
                </button>
                <button type="button" className="btn" onClick={showSolution}>
                  👀 Ver solución
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn" onClick={loadExample}>
                  🎲 Cargar un ejemplo
                </button>
                <button type="button" className="btn" onClick={clearAll} disabled={!blocks.length}>
                  🗑 Vaciar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Vista previa y código */}
        <div className="bq-right">
          <div className="editor-preview">
            <div className="editor-tabs">
              <span className="editor-tab is-active">👁 vista previa</span>
            </div>
            <iframe ref={frame} className="bq-frame" title="Vista previa" sandbox="allow-scripts allow-modals" srcDoc={doc} onLoad={onLoad} />
          </div>

          <div className="editor-code" style={{ marginTop: 12 }}>
            <div className="editor-tabs">
              {(["html", "css", "js"] as const).map((t) => (
                <button key={t} type="button" className={`editor-tab${tab === t ? " is-active" : ""}`} onClick={() => setTab(t)}>
                  {t === "html" ? "index.html" : t === "css" ? "style.css" : "script.js"}
                </button>
              ))}
              <button type="button" className="editor-tab" style={{ marginLeft: "auto" }} onClick={copyCode}>
                {copied ? "✓ copiado" : "📋 copiar"}
              </button>
            </div>
            <pre className="bq-code">
              <code>{gen[tab] || "/* Todavía no hay nada acá. ¡Sumá bloques! */"}</code>
            </pre>
          </div>

          <div className="game-row" style={{ justifyContent: "flex-start", marginTop: 12 }}>
            <button type="button" className="btn" onClick={() => downloadDoc(gen.html, gen.css, gen.js)} disabled={!blocks.length}>
              ⬇ Descargar index.html
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
