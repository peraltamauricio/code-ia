"use client";

import { useEffect, useRef, useState } from "react";
import { retos, Reto, Code } from "@/lib/retos";
import { buildDoc, downloadDoc, LogLine } from "./preview";
import Jefe from "./Jefe";
import CodeArea from "./CodeArea";

type Tab = "html" | "css" | "js";

const DONE_KEY = "codeia-retos";
const draftKey = (id: string) => `codeia-reto-${id}`;

// Todo se guarda en el navegador de cada alumno (si no se puede, el reto anda igual).
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
function readDraft(id: string): Code | null {
  try {
    const v = localStorage.getItem(draftKey(id));
    return v ? (JSON.parse(v) as Code) : null;
  } catch {
    return null;
  }
}
function writeDraft(id: string, c: Code) {
  try {
    localStorage.setItem(draftKey(id), JSON.stringify(c));
  } catch {
    /* sin guardado */
  }
}

const FILE = { html: "index.html", css: "style.css", js: "script.js" } as const;

export default function Retos() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => setDone(readDone()), []);

  const open = retos.find((r) => r.id === openId);
  if (open) {
    return (
      <RetoView
        key={open.id}
        reto={open}
        onBack={() => setOpenId(null)}
        onDone={(id) => {
          const d = { ...readDone(), [id]: true };
          writeDone(d);
          setDone(d);
        }}
      />
    );
  }

  const total = retos.filter((r) => done[r.id]).length;
  return (
    <div>
      <div className="reto-top">
        <p className="game-desc" style={{ margin: 0 }}>
          Retos largos con <b>misiones</b>: escribís código y la página tilda cada misión sola cuando
          la lográs. Podés ir de a poco: se guarda lo que escribís.
        </p>
        <span className="reto-total">
          🏅 {total} de {retos.length} superados
        </span>
      </div>
      <div className="reto-grid">
        {retos.map((r) => (
          <button key={r.id} type="button" className={`reto-card panel${done[r.id] ? " is-done" : ""}`} onClick={() => setOpenId(r.id)}>
            <span className="reto-card-icon">{r.icon}</span>
            <span className="reto-card-title">{r.title}</span>
            <span className="reto-card-tags">
              {r.langs.map((l) => (
                <span key={l} className="reto-tag">
                  {l}
                </span>
              ))}
              {r.ai && <span className="reto-tag">IA</span>}
            </span>
            <span className="reto-card-meta">
              {"⭐".repeat(r.nivel)} · {r.minutos} · {r.misiones.length} misiones
            </span>
            {done[r.id] && <span className="reto-card-done">✓ Superado</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function RetoView({ reto, onBack, onDone }: { reto: Reto; onBack: () => void; onDone: (id: string) => void }) {
  const [code, setCode] = useState<Code>(reto.start);
  const [tab, setTab] = useState<Tab>(reto.tab);
  const [doc, setDoc] = useState("");
  const [results, setResults] = useState<boolean[] | null>(null);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [hints, setHints] = useState<Set<number>>(new Set());
  const [usedSolution, setUsedSolution] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  const frame = useRef<HTMLIFrameElement>(null);
  const checkId = useRef(0);
  const nonce = useRef(0);
  const skip = useRef(false);
  const loaded = useRef(false);

  // Recupero lo que ya había escrito en este reto.
  useEffect(() => {
    const d = readDraft(reto.id);
    if (d) setCode(d);
    loaded.current = true;
  }, [reto.id]);

  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => writeDraft(reto.id, code), 600);
    return () => clearTimeout(t);
  }, [code, reto.id]);

  // Actualiza la vista previa un ratito después de dejar de escribir.
  useEffect(() => {
    const t = setTimeout(() => {
      setLogs([]);
      skip.current = false;
      setDoc(buildDoc(code.html, code.css, code.js, true) + `<!--${++nonce.current}-->`);
    }, 450);
    return () => clearTimeout(t);
  }, [code]);

  // Cuando la vista previa termina de cargar, le mando las pruebas de las misiones.
  function onLoad() {
    if (skip.current) {
      skip.current = false;
      return;
    }
    const w = frame.current?.contentWindow;
    if (!w || !doc) return;
    const id = ++checkId.current;
    w.postMessage({ codeiaCheck: true, id, tests: reto.misiones.map((m) => m.test) }, "*");
  }

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data;
      if (!d || d.codeia !== true) return;
      if (d.kind === "checks") {
        if (d.id !== checkId.current) return;
        setResults(d.results as boolean[]);
        if (reto.interactive) {
          // Las pruebas tocaron los botones: recargo la vista previa para que quede como la dejó el alumno.
          skip.current = true;
          setLogs([]);
          setDoc((x) => x.replace(/<!--\w+-->$/, "") + `<!--r${++nonce.current}-->`);
        }
        return;
      }
      if (d.kind === "log" || d.kind === "error") {
        setLogs((l) => [...l.slice(-30), { kind: d.kind, text: String(d.text) }]);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [reto.interactive]);

  const total = reto.misiones.length;
  const ok = results ? results.filter(Boolean).length : 0;
  const all = results !== null && results.length === total && ok === total;

  useEffect(() => {
    if (all && !celebrated) {
      setCelebrated(true);
      if (!usedSolution) onDone(reto.id);
    }
  }, [all, celebrated, usedSolution, onDone, reto.id]);

  // Tab escribe espacios en vez de saltar al siguiente botón.
  function toggleHint(i: number) {
    setHints((h) => {
      const n = new Set(h);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  }

  function showSolution() {
    if (!confirm("¿Ver la solución?\n\nSi la cargás, este reto ya no cuenta como superado. Probá primero con las pistas 💡")) return;
    setUsedSolution(true);
    setCode(reto.solution);
    setTab(reto.tab);
  }

  function restart() {
    if (!confirm("¿Empezar de cero?\n\nSe borra todo lo que escribiste en este reto.")) return;
    setCode(reto.start);
    setUsedSolution(false);
    setCelebrated(false);
    setTab(reto.tab);
  }

  return (
    <div className="reto panel">
      <div className="reto-head">
        <button type="button" className="btn" onClick={onBack} style={{ padding: "9px 16px", fontSize: 13 }}>
          ← Todos los retos
        </button>
        <div className="reto-title">
          <span>{reto.icon}</span> {reto.title}
        </div>
        <span className="reto-count">
          {ok}/{total} misiones
        </span>
      </div>
      <div className="path-bar" style={{ margin: "12px 0" }}>
        <div className="path-bar-fill" style={{ width: `${(ok / total) * 100}%` }} />
      </div>
      <p className="reto-intro">{reto.intro}</p>

      {all &&
        (usedSolution ? (
          <div className="reto-win is-soft">
            Todas las misiones están en verde, pero como cargaste la solución este reto no cuenta. ¡Probalo de
            nuevo desde cero (botón «Empezar de cero»)!
          </div>
        ) : (
          <div className="reto-win">
            🎉 <b>¡Reto superado!</b> Cumpliste las {total} misiones.{" "}
            <button type="button" className="reto-win-btn" onClick={onBack}>
              Elegir otro reto →
            </button>
          </div>
        ))}

      <div className="reto-body">
        <Jefe
          misiones={reto.misiones}
          results={results}
          hintOf={(m) =>
            reto.ai ? `Pedile a la IA algo así: «${m.t}». Pegá el código en script.js y fijate si se tilda.` : m.hint
          }
        />

        <div className="reto-work">
          <div className="editor-code">
            <div className="editor-tabs">
              {(["html", "css", "js"] as Tab[]).map((t) => (
                <button key={t} type="button" className={`editor-tab${tab === t ? " is-active" : ""}`} onClick={() => setTab(t)}>
                  {FILE[t]}
                </button>
              ))}
            </div>
            <CodeArea
              value={code[tab]}
              lang={tab}
              onChange={(v) => setCode((c) => ({ ...c, [tab]: v }))}
              ariaLabel={`Código ${FILE[tab]}`}
            />
          </div>

          <div className="editor-preview">
            <div className="editor-tabs">
              <span className="editor-tab is-active">👁 vista previa</span>
            </div>
            <iframe
              ref={frame}
              className="editor-frame"
              title="Vista previa del reto"
              sandbox="allow-scripts allow-modals"
              srcDoc={doc}
              onLoad={onLoad}
            />
            <div className="editor-console">
              <div className="editor-console-head">consola</div>
              {logs.length === 0 ? (
                <div className="editor-console-empty">Acá aparecen tus console.log y los errores.</div>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className={`editor-console-line is-${l.kind}`}>
                    {l.kind === "error" ? "✖ " : "› "}
                    {l.text}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="game-row" style={{ justifyContent: "flex-start" }}>
            <button type="button" className="btn" onClick={() => downloadDoc(code.html, code.css, code.js)}>
              ⬇ Descargar index.html
            </button>
            <button type="button" className="btn" onClick={restart}>
              ↺ Empezar de cero
            </button>
            <button type="button" className="btn" onClick={showSolution}>
              👀 Ver solución
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
