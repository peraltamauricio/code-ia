"use client";

// Editor de código con ayudas como Visual Studio Code:
//  - sugerencias mientras escribís (etiquetas, atributos, propiedades de CSS, valores),
//  - se cierran solos los paréntesis, comillas, llaves y las etiquetas (<h1> → </h1>),
//  - atajos tipo Emmet: escribí  ul>li*3  y apretá Tab,
//  - Enter mantiene la sangría, Ctrl+/ comenta, Ctrl+D duplica la línea.

import { KeyboardEvent, useCallback, useLayoutEffect, useRef, useState } from "react";

export type Lang = "html" | "css" | "js";

type Sug = { label: string; detail: string; ins: string }; // ins: "|" marca dónde queda el cursor

const VOID = new Set(["img", "br", "hr", "input", "meta", "link"]);

const TAGS: [string, string, string?][] = [
  ["h1", "Título grande"],
  ["h2", "Subtítulo"],
  ["h3", "Título chico"],
  ["p", "Párrafo"],
  ["a", "Link", 'a href="|"></a>'],
  ["img", "Imagen", 'img src="|" alt="">'],
  ["div", "Caja"],
  ["span", "Texto suelto"],
  ["ul", "Lista con puntos"],
  ["ol", "Lista numerada"],
  ["li", "Elemento de lista"],
  ["button", "Botón"],
  ["header", "Cabecera"],
  ["nav", "Menú"],
  ["section", "Sección"],
  ["footer", "Pie de página"],
  ["main", "Contenido principal"],
  ["strong", "Negrita"],
  ["em", "Cursiva"],
  ["br", "Salto de línea"],
  ["hr", "Línea separadora"],
  ["input", "Campo de texto", 'input type="text" placeholder="|">'],
  ["label", "Etiqueta de campo"],
  ["form", "Formulario"],
];
const ATTRS: [string, string, string][] = [
  ["class", "Nombre de clase para el CSS", 'class="|"'],
  ["id", "Nombre único", 'id="|"'],
  ["href", "A dónde lleva el link", 'href="|"'],
  ["src", "Dirección de la imagen", 'src="|"'],
  ["alt", "Descripción de la imagen", 'alt="|"'],
  ["target", "Abrir en pestaña nueva", 'target="_blank"'],
  ["style", "CSS directo", 'style="|"'],
  ["placeholder", "Texto de ayuda", 'placeholder="|"'],
];
const PROPS: [string, string][] = [
  ["color", "Color de la letra"],
  ["background-color", "Color de fondo"],
  ["background", "Fondo"],
  ["font-size", "Tamaño de letra"],
  ["font-family", "Tipo de letra"],
  ["font-weight", "Grosor de letra"],
  ["text-align", "Alinear texto"],
  ["margin", "Espacio de afuera"],
  ["padding", "Espacio de adentro"],
  ["border", "Borde"],
  ["border-radius", "Esquinas redondas"],
  ["width", "Ancho"],
  ["max-width", "Ancho máximo"],
  ["height", "Alto"],
  ["display", "Cómo se acomoda"],
  ["gap", "Espacio entre cajas"],
  ["box-shadow", "Sombra"],
  ["transform", "Mover / agrandar"],
  ["transition", "Animación suave"],
  ["position", "Posición"],
  ["columns", "Columnas"],
  ["cursor", "Cursor del mouse"],
  ["opacity", "Transparencia"],
  ["line-height", "Alto de línea"],
];
const VALUES: Record<string, string[]> = {
  display: ["flex", "grid", "block", "inline-block", "none"],
  "text-align": ["center", "left", "right"],
  position: ["sticky", "fixed", "relative", "absolute"],
  cursor: ["pointer", "default"],
  "font-weight": ["bold", "normal", "600"],
  "font-family": ["Arial, sans-serif", "Georgia, serif", "monospace"],
  color: ["white", "black", "tomato", "purple", "#a855f7", "#f9fafb"],
  "background-color": ["white", "black", "#111827", "#fff7ed", "tomato", "#a855f7"],
  background: ["#111827", "#fff7ed", "linear-gradient(135deg, #a855f7, #3b82f6)"],
  margin: ["0 auto", "20px", "0"],
  padding: ["20px", "10px 20px", "16px"],
  border: ["1px solid #ccc", "none", "2px solid #a855f7"],
  "border-radius": ["16px", "8px", "999px", "50%"],
  "box-shadow": ["0 10px 30px rgba(0,0,0,0.3)", "0 4px 12px rgba(0,0,0,0.2)"],
  transform: ["translateY(-4px)", "scale(1.05)", "rotate(3deg)"],
  transition: ["0.3s", "all 0.3s ease"],
  width: ["100%", "300px", "50%"],
  "max-width": ["340px", "600px", "100%"],
  gap: ["12px", "20px", "8px"],
  columns: ["2", "3", "4"],
  opacity: ["0.5", "1", "0.8"],
  "font-size": ["16px", "24px", "32px", "1.2rem"],
  "line-height": ["1.5", "1.6", "2"],
};
const JS_SNIPS: Sug[] = [
  { label: "alert", detail: "Muestra un cartel", ins: 'alert("|");' },
  { label: "console.log", detail: "Escribe en la consola", ins: "console.log(|);" },
];

const clean = (s: string) => s.replace("|", "");
const caretIn = (s: string) => (s.includes("|") ? s.indexOf("|") : s.length);

function suggest(lang: Lang, value: string, pos: number): { items: Sug[]; start: number; end: number } | null {
  const before = value.slice(0, pos);
  const tok = /[\w-]*$/.exec(before)![0];
  const start = pos - tok.length;
  let items: Sug[] = [];

  if (lang === "html") {
    const lt = before.lastIndexOf("<");
    if (lt < 0 || lt < before.lastIndexOf(">")) return null;
    const inside = before.slice(lt + 1);
    if (/^[\w-]*$/.test(inside)) {
      items = TAGS.filter(([t]) => t.startsWith(tok.toLowerCase())).map(([t, d, ins]) => ({
        label: t,
        detail: d,
        ins: ins ?? (VOID.has(t) ? `${t}>` : `${t}>|</${t}>`),
      }));
    } else if (!/^\//.test(inside) && (inside.split('"').length - 1) % 2 === 0) {
      items = ATTRS.filter(([a]) => a.startsWith(tok.toLowerCase())).map(([a, d, ins]) => ({ label: a, detail: d, ins }));
    }
  } else if (lang === "css") {
    const open = (before.match(/{/g) || []).length - (before.match(/}/g) || []).length;
    if (open <= 0) return null;
    const stmt = before.slice(Math.max(before.lastIndexOf(";"), before.lastIndexOf("{")) + 1);
    if (stmt.includes(":")) {
      const prop = stmt.split(":")[0].trim();
      const vals = VALUES[prop] || [];
      items = vals
        .filter((v) => v.toLowerCase().startsWith(tok.toLowerCase()))
        .map((v) => ({ label: v, detail: prop, ins: `${v};` }));
    } else if (tok.length >= 1) {
      items = PROPS.filter(([p]) => p.startsWith(tok.toLowerCase())).map(([p, d]) => ({ label: p, detail: d, ins: `${p}: |;` }));
    }
  } else {
    if (tok.length < 1) return null;
    items = JS_SNIPS.filter((s) => s.label.startsWith(tok.toLowerCase()));
  }

  // En HTML, la etiqueta exacta igual se ofrece (completa el > y el cierre).
  if (lang !== "html" && items.length === 1 && items[0].label === tok) return null;
  if (items.length === 0) return null;
  return { items: items.slice(0, 8), start, end: pos };
}

// Atajo tipo Emmet: "ul>li*3" → <ul><li></li><li></li><li></li></ul>
const MARK = "\u0000";
function emmet(abbr: string): { text: string; caret: number } | null {
  const parts = abbr.split(">");
  let inner = "";
  for (let i = parts.length - 1; i >= 0; i--) {
    const m = /^([a-z][a-z0-9]*)((?:[.#][\w-]+)*)(?:\*(\d{1,2}))?$/i.exec(parts[i]);
    if (!m || !TAGS.some(([t]) => t === m[1].toLowerCase())) return null;
    const tag = m[1].toLowerCase();
    const classes = [...m[2].matchAll(/\.([\w-]+)/g)].map((x) => x[1]);
    const id = /#([\w-]+)/.exec(m[2])?.[1];
    let attrs = "";
    if (id) attrs += ` id="${id}"`;
    if (classes.length) attrs += ` class="${classes.join(" ")}"`;
    if (tag === "a") attrs += ` href="${i === parts.length - 1 ? MARK : ""}"`;
    if (tag === "img") attrs += ` src="${i === parts.length - 1 ? MARK : ""}" alt=""`;
    const hasMark = attrs.includes(MARK);
    if (i === parts.length - 1) inner = hasMark || VOID.has(tag) ? "" : MARK;
    const el = VOID.has(tag) ? `<${tag}${attrs}>` : `<${tag}${attrs}>${inner}</${tag}>`;
    inner = el.repeat(m[3] ? Math.max(1, parseInt(m[3], 10)) : 1);
  }
  const first = inner.indexOf(MARK);
  const text = inner.split(MARK).join("");
  // Si había varias marcas, el cursor va a la primera.
  return { text, caret: first < 0 ? text.length : first };
}

function caretXY(el: HTMLTextAreaElement, pos: number) {
  const d = document.createElement("div");
  const cs = getComputedStyle(el);
  const st = d.style as unknown as Record<string, string>;
  ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "paddingTop", "paddingLeft", "paddingRight", "paddingBottom", "tabSize"].forEach(
    (k) => (st[k] = cs[k as keyof CSSStyleDeclaration] as string),
  );
  d.style.position = "absolute";
  d.style.visibility = "hidden";
  d.style.whiteSpace = "pre-wrap";
  d.style.wordWrap = "break-word";
  d.style.boxSizing = "border-box";
  d.style.width = `${el.clientWidth}px`;
  d.textContent = el.value.slice(0, pos);
  const span = document.createElement("span");
  span.textContent = "​";
  d.appendChild(span);
  document.body.appendChild(d);
  const r = { left: span.offsetLeft, top: span.offsetTop };
  document.body.removeChild(d);
  return r;
}

const COMMENT: Record<Lang, [string, string]> = { html: ["<!-- ", " -->"], css: ["/* ", " */"], js: ["// ", ""] };
const PAIRS: Record<string, string> = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };

const HINTS: Record<Lang, string> = {
  html: "💡 Escribí < y elegí una etiqueta · h1 + Tab → <h1></h1> · ul>li*3 + Tab · Ctrl+/ comenta",
  css: "💡 Escribí una propiedad (col…) y elegí con ↑ ↓ + Enter · se cierran solas las { } · Ctrl+/ comenta",
  js: "💡 Escribí al… y elegí alert · se cierran solos los ( ) y las comillas · Ctrl+/ comenta",
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  lang: Lang;
  ariaLabel?: string;
  placeholder?: string;
};

export default function CodeArea({ value, onChange, lang, ariaLabel, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [pop, setPop] = useState<{ items: Sug[]; idx: number; start: number; end: number; left: number; top: number } | null>(null);

  // El cursor se acomoda DESPUÉS de que React pinta el texto nuevo (si no, salta al final).
  const sel = useRef<[number, number] | null>(null);
  const [, bump] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (sel.current && el) {
      el.setSelectionRange(sel.current[0], sel.current[1]);
      sel.current = null;
    }
  });

  const apply = useCallback(
    (v: string, caret: number, caretEnd = caret) => {
      sel.current = [caret, caretEnd];
      onChange(v);
      setPop(null);
      bump((n) => n + 1);
    },
    [onChange],
  );

  function recompute(v: string, pos: number) {
    const el = ref.current;
    const s = el && suggest(lang, v, pos);
    if (!el || !s) return setPop(null);
    const xy = caretXY(el, pos);
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 22;
    let top = xy.top - el.scrollTop + lh + 2;
    if (top > el.clientHeight - 190) top = Math.max(0, xy.top - el.scrollTop - 190);
    const left = Math.max(0, Math.min(xy.left - el.scrollLeft, el.clientWidth - 260));
    setPop({ items: s.items, idx: 0, start: s.start, end: s.end, left, top });
  }

  function accept(i: number) {
    if (!pop) return;
    const it = pop.items[i];
    const nv = value.slice(0, pop.start) + clean(it.ins) + value.slice(pop.end);
    apply(nv, pop.start + caretIn(it.ins));
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const s = el.selectionStart;
    const end = el.selectionEnd;
    const v = el.value;

    if (pop) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const n = pop.items.length;
        setPop({ ...pop, idx: (pop.idx + (e.key === "ArrowDown" ? 1 : n - 1)) % n });
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        accept(pop.idx);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setPop(null);
        return;
      }
    }

    // Ctrl+/ → comentar o descomentar las líneas
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault();
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      let le = v.indexOf("\n", end);
      if (le < 0) le = v.length;
      const [a, b] = COMMENT[lang];
      const lines = v.slice(ls, le).split("\n");
      const all = lines.filter((l) => l.trim()).every((l) => l.trim().startsWith(a.trim()));
      const out = lines
        .map((l) => {
          if (!l.trim()) return l;
          const ind = /^\s*/.exec(l)![0];
          const body = l.slice(ind.length);
          if (all) {
            let t = body.slice(a.trim().length).replace(/^ /, "");
            if (b && t.endsWith(b.trim())) t = t.slice(0, t.length - b.trim().length).replace(/ $/, "");
            return ind + t;
          }
          return ind + a + body + b;
        })
        .join("\n");
      apply(v.slice(0, ls) + out + v.slice(le), ls, ls + out.length);
      return;
    }
    // Ctrl+D → duplicar línea
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
      e.preventDefault();
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      let le = v.indexOf("\n", end);
      if (le < 0) le = v.length;
      const line = v.slice(ls, le);
      apply(v.slice(0, le) + "\n" + line + v.slice(le), s + line.length + 1, end + line.length + 1);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (lang === "html" && s === end) {
        const ls = v.lastIndexOf("\n", s - 1) + 1;
        const abbr = /(\S+)$/.exec(v.slice(ls, s))?.[1];
        const ex = abbr && emmet(abbr);
        if (ex) {
          const st = s - abbr!.length;
          apply(v.slice(0, st) + ex.text + v.slice(s), st + ex.caret);
          return;
        }
      }
      apply(v.slice(0, s) + "  " + v.slice(end), s + 2);
      return;
    }

    // Al escribir ">" de una etiqueta, se agrega solo el cierre
    if (e.key === ">" && lang === "html" && s === end) {
      const before = v.slice(0, s);
      const lt = before.lastIndexOf("<");
      if (lt >= 0 && lt > before.lastIndexOf(">")) {
        const inside = before.slice(lt + 1);
        const m = /^([a-zA-Z][\w-]*)(\s[^<>]*)?$/.exec(inside);
        if (m && !VOID.has(m[1].toLowerCase()) && !inside.endsWith("/") && (inside.split('"').length - 1) % 2 === 0) {
          e.preventDefault();
          apply(before + `></${m[1]}>` + v.slice(s), s + 1);
          return;
        }
      }
    }

    // Enter: mantiene la sangría y abre espacio entre { } o <x></x>
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      const ind = /^[ \t]*/.exec(v.slice(ls, s))![0];
      const prev = v[s - 1];
      const between = (prev === "{" && v[end] === "}") || (prev === ">" && v.slice(end, end + 2) === "</");
      if (between) {
        const mid = "\n" + ind + "  ";
        apply(v.slice(0, s) + mid + "\n" + ind + v.slice(end), s + mid.length);
      } else {
        const extra = prev === "{" ? "  " : "";
        apply(v.slice(0, s) + "\n" + ind + extra + v.slice(end), s + 1 + ind.length + extra.length);
      }
      return;
    }

    // Cierre automático de ( [ { " ' y "saltar" el cierre si ya está
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const close = PAIRS[e.key];
      if (close && s !== end) {
        e.preventDefault();
        apply(v.slice(0, s) + e.key + v.slice(s, end) + close + v.slice(end), s + 1, end + 1);
        return;
      }
      const isQuote = e.key === '"' || e.key === "'";
      if (isQuote && v[s] === e.key) {
        e.preventDefault();
        apply(v, s + 1);
        return;
      }
      if (")]}".includes(e.key) && v[s] === e.key) {
        e.preventDefault();
        apply(v, s + 1);
        return;
      }
      if (close && !(isQuote && /\w/.test(v[s - 1] || ""))) {
        e.preventDefault();
        apply(v.slice(0, s) + e.key + close + v.slice(end), s + 1);
        return;
      }
    }
  }

  return (
    <div className="ca-wrap">
      <textarea
        ref={ref}
        className="editor-area"
        value={value}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        onKeyDown={onKey}
        onChange={(e) => {
          onChange(e.target.value);
          recompute(e.target.value, e.target.selectionStart);
        }}
        onClick={() => setPop(null)}
        onBlur={() => setTimeout(() => setPop(null), 120)}
        aria-label={ariaLabel}
        placeholder={placeholder}
      />
      {pop && (
        <ul className="ca-pop" style={{ left: pop.left, top: pop.top }} role="listbox">
          {pop.items.map((it, i) => (
            <li
              key={it.label}
              className={`ca-item${i === pop.idx ? " is-on" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                accept(i);
              }}
              onMouseEnter={() => setPop((p) => (p ? { ...p, idx: i } : p))}
              role="option"
              aria-selected={i === pop.idx}
            >
              <span className="ca-label">{it.label}</span>
              <span className="ca-detail">{it.detail}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="ca-hint">{HINTS[lang]}</div>
    </div>
  );
}
