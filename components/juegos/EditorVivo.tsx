"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import { editorTemplates } from "@/lib/juegos";
import { buildDoc, downloadDoc, LogLine } from "./preview";

type Tab = "html" | "css" | "js";

export default function EditorVivo() {
  const [tpl, setTpl] = useState(0);
  const [tab, setTab] = useState<Tab>("html");
  const [code, setCode] = useState({
    html: editorTemplates[0].html,
    css: editorTemplates[0].css,
    js: editorTemplates[0].js,
  });
  const [doc, setDoc] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([]);

  // Actualiza la vista previa un ratito después de dejar de escribir.
  useEffect(() => {
    const t = setTimeout(() => {
      setLogs([]);
      setDoc(buildDoc(code.html, code.css, code.js, true));
    }, 450);
    return () => clearTimeout(t);
  }, [code]);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (!e.data || e.data.codeia !== true) return;
      if (e.data.kind !== "log" && e.data.kind !== "error") return; // los "checks" son de los retos
      setLogs((l) => [...l.slice(-30), { kind: e.data.kind, text: String(e.data.text) }]);
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  function loadTemplate(i: number) {
    setTpl(i);
    const t = editorTemplates[i];
    setCode({ html: t.html, css: t.css, js: t.js });
    setTab("html");
  }

  // Tab escribe espacios en vez de saltar al siguiente botón.
  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: end, value } = el;
    const nextValue = value.slice(0, s) + "  " + value.slice(end);
    setCode((c) => ({ ...c, [tab]: nextValue }));
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = s + 2;
    });
  }

  function download() {
    downloadDoc(code.html, code.css, code.js);
  }

  return (
    <div className="editor panel">
      <div className="editor-templates">
        <span className="next-label" style={{ margin: 0 }}>
          ejemplos:
        </span>
        {editorTemplates.map((t, i) => (
          <button
            key={t.name}
            type="button"
            className={`guide-tab editor-chip${tpl === i ? " is-active" : ""}`}
            onClick={() => loadTemplate(i)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="editor-split">
        <div className="editor-code">
          <div className="editor-tabs">
            {(["html", "css", "js"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                className={`editor-tab${tab === t ? " is-active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t === "html" ? "index.html" : t === "css" ? "style.css" : "script.js"}
              </button>
            ))}
          </div>
          <textarea
            className="editor-area"
            value={code[tab]}
            spellCheck={false}
            onKeyDown={onKey}
            onChange={(e) => setCode((c) => ({ ...c, [tab]: e.target.value }))}
            aria-label={`Código ${tab}`}
            placeholder={tab === "js" ? "// escribí tu JavaScript acá" : ""}
          />
        </div>

        <div className="editor-preview">
          <div className="editor-tabs">
            <span className="editor-tab is-active">👁 vista previa</span>
          </div>
          <iframe
            className="editor-frame"
            title="Vista previa"
            sandbox="allow-scripts allow-modals"
            srcDoc={doc}
          />
          <div className="editor-console">
            <div className="editor-console-head">consola</div>
            {logs.length === 0 ? (
              <div className="editor-console-empty">Usá console.log(&quot;hola&quot;) y aparece acá.</div>
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
      </div>

      <div className="game-row" style={{ marginTop: 14 }}>
        <button type="button" className="btn" onClick={download}>
          ⬇ Descargar como index.html
        </button>
        <span className="game-desc" style={{ margin: 0, fontSize: 13 }}>
          Se descarga todo junto en un solo archivo, listo para abrir con doble clic.
        </span>
      </div>
    </div>
  );
}
