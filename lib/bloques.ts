// Bloques estilo Scratch (/jugar → Bloques).
// Cada bloque genera un pedacito de HTML, de CSS o un alert. Juntos arman la página,
// y el código que se genera se muestra al lado para ir aprendiendo.
// JavaScript solo con alert: es lo único que se vio.

import type { Mision } from "./retos";

export type Cat = "html" | "css" | "js";

type Opt = { v: string; l: string };
export type Field =
  | { key: string; type: "text"; def: string; placeholder?: string; list?: boolean }
  | { key: string; type: "textarea"; def: string; placeholder?: string }
  | { key: string; type: "color"; def: string }
  | { key: string; type: "number"; def: string; min: number; max: number; suffix?: string }
  | { key: string; type: "select"; def: string; options: Opt[] };

export type Block = { id: string; kind: string; vals: Record<string, string> };

type Gen = {
  html?: string;
  rules?: { sel: string; props: [string, string][] }[];
  css?: string;
  js?: string;
};

export type BlockDef = {
  kind: string;
  cat: Cat;
  icon: string;
  name: string;
  /** La frase del bloque: textos sueltos y campos ({ f: "clave" }). */
  row: (string | { f: string })[];
  fields: Field[];
  gen: (v: Record<string, string>) => Gen;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Para meter texto del alumno adentro de un alert("...") sin romper el <script>.
const jsStr = (s: string) => JSON.stringify(s).replace(/<\//g, "<\\/");

export const IMAGENES = ["paisaje", "gato", "auto", "comida", "musica", "deporte"].map(
  (n) => `https://picsum.photos/seed/${n}/400/250`
);

const TARGETS: Opt[] = [
  { v: "body", l: "la página" },
  { v: ".tarjeta", l: "la tarjeta" },
  { v: "h1", l: "el título" },
  { v: "h2", l: "el subtítulo" },
  { v: "p", l: "los párrafos" },
  { v: "img", l: "la imagen" },
  { v: "button", l: "el botón" },
  { v: "a", l: "el link" },
];

const target = (def: string): Field => ({ key: "t", type: "select", def, options: TARGETS });
const color = (def: string): Field => ({ key: "c", type: "color", def });
const num = (def: string, min: number, max: number): Field => ({ key: "n", type: "number", def, min, max, suffix: "px" });

const css1 = (sel: string, prop: string, value: string): Gen => ({ rules: [{ sel, props: [[prop, value]] }] });

const FUENTES: Opt[] = [
  { v: "Arial, sans-serif", l: "Arial" },
  { v: "Georgia, serif", l: "Georgia" },
  { v: '"Courier New", monospace', l: "Courier New" },
  { v: "Verdana, sans-serif", l: "Verdana" },
  { v: '"Trebuchet MS", sans-serif', l: "Trebuchet" },
];

const defs: BlockDef[] = [
  // ---------------- HTML (azul) ----------------
  { kind: "h1", cat: "html", icon: "🔠", name: "Título grande", row: ["Título grande:", { f: "x" }], fields: [{ key: "x", type: "text", def: "Mi título", placeholder: "Tu nombre" }], gen: (v) => ({ html: `<h1>${esc(v.x)}</h1>` }) },
  { kind: "h2", cat: "html", icon: "🔡", name: "Subtítulo", row: ["Subtítulo:", { f: "x" }], fields: [{ key: "x", type: "text", def: "Un subtítulo" }], gen: (v) => ({ html: `<h2>${esc(v.x)}</h2>` }) },
  { kind: "p", cat: "html", icon: "📝", name: "Párrafo", row: ["Párrafo:", { f: "x" }], fields: [{ key: "x", type: "text", def: "Escribí algo acá" }], gen: (v) => ({ html: `<p>${esc(v.x)}</p>` }) },
  { kind: "img", cat: "html", icon: "🖼️", name: "Imagen", row: ["Imagen:", { f: "src" }, "descripción:", { f: "alt" }], fields: [{ key: "src", type: "text", def: IMAGENES[0], list: true }, { key: "alt", type: "text", def: "Una foto" }], gen: (v) => ({ html: `<img src="${esc(v.src)}" alt="${esc(v.alt)}" width="300">` }) },
  { kind: "btn", cat: "html", icon: "🔘", name: "Botón", row: ["Botón:", { f: "x" }], fields: [{ key: "x", type: "text", def: "Tocame" }], gen: (v) => ({ html: `<button>${esc(v.x)}</button>` }) },
  { kind: "link", cat: "html", icon: "🔗", name: "Link", row: ["Link:", { f: "x" }, "a", { f: "u" }], fields: [{ key: "x", type: "text", def: "Mi taller" }, { key: "u", type: "text", def: "https://code-ia-taller.vercel.app" }], gen: (v) => ({ html: `<a href="${esc(v.u)}" target="_blank">${esc(v.x)}</a>` }) },
  {
    kind: "list", cat: "html", icon: "📋", name: "Lista", row: ["Lista (una por línea):", { f: "x" }], fields: [{ key: "x", type: "textarea", def: "Uno\nDos\nTres" }],
    gen: (v) => {
      const items = v.x.split("\n").map((l) => l.trim()).filter(Boolean);
      return { html: `<ul>\n${items.map((i) => `  <li>${esc(i)}</li>`).join("\n")}\n</ul>` };
    },
  },
  { kind: "htmlcode", cat: "html", icon: "✍️", name: "Mi código HTML", row: ["✍️ Mi código HTML:", { f: "x" }], fields: [{ key: "x", type: "textarea", def: "<hr>" }], gen: (v) => ({ html: v.x.trim() }) },

  // ---------------- CSS (violeta) ----------------
  { kind: "bg", cat: "css", icon: "🎨", name: "Color de fondo", row: ["Fondo de", { f: "t" }, "→", { f: "c" }], fields: [target("body"), color("#111827")], gen: (v) => css1(v.t, "background-color", v.c) },
  { kind: "color", cat: "css", icon: "🖍️", name: "Color de letra", row: ["Color de letra de", { f: "t" }, "→", { f: "c" }], fields: [target("body"), color("#f9fafb")], gen: (v) => css1(v.t, "color", v.c) },
  { kind: "size", cat: "css", icon: "🔎", name: "Tamaño de letra", row: ["Tamaño de letra de", { f: "t" }, "→", { f: "n" }], fields: [target("h1"), num("32", 10, 80)], gen: (v) => css1(v.t, "font-size", `${v.n}px`) },
  { kind: "font", cat: "css", icon: "🔤", name: "Tipo de letra", row: ["Tipo de letra de", { f: "t" }, "→", { f: "f" }], fields: [target("body"), { key: "f", type: "select", def: FUENTES[0].v, options: FUENTES }], gen: (v) => css1(v.t, "font-family", v.f) },
  { kind: "radius", cat: "css", icon: "⭕", name: "Esquinas redondeadas", row: ["Esquinas redondeadas de", { f: "t" }, "→", { f: "n" }], fields: [target(".tarjeta"), num("16", 0, 60)], gen: (v) => css1(v.t, "border-radius", `${v.n}px`) },
  { kind: "padding", cat: "css", icon: "📦", name: "Espacio de adentro", row: ["Espacio de adentro de", { f: "t" }, "→", { f: "n" }], fields: [target(".tarjeta"), num("20", 0, 60)], gen: (v) => css1(v.t, "padding", `${v.n}px`) },
  { kind: "margin", cat: "css", icon: "↔️", name: "Espacio de afuera", row: ["Espacio de afuera de", { f: "t" }, "→", { f: "n" }], fields: [target("img"), num("10", 0, 60)], gen: (v) => css1(v.t, "margin", `${v.n}px`) },
  { kind: "width", cat: "css", icon: "📏", name: "Ancho máximo", row: ["Ancho máximo de", { f: "t" }, "→", { f: "n" }], fields: [target(".tarjeta"), num("340", 100, 800)], gen: (v) => css1(v.t, "max-width", `${v.n}px`) },
  { kind: "centerbox", cat: "css", icon: "🎯", name: "Centrar la caja", row: ["Centrar la caja de", { f: "t" }], fields: [target(".tarjeta")], gen: (v) => css1(v.t, "margin", "20px auto") },
  { kind: "textcenter", cat: "css", icon: "☰", name: "Centrar el texto", row: ["Centrar el texto de", { f: "t" }], fields: [target(".tarjeta")], gen: (v) => css1(v.t, "text-align", "center") },
  { kind: "border", cat: "css", icon: "🔲", name: "Borde", row: ["Borde de", { f: "t" }, "grosor", { f: "n" }, "color", { f: "c" }], fields: [target(".tarjeta"), { key: "n", type: "number", def: "2", min: 1, max: 10, suffix: "px" }, color("#a855f7")], gen: (v) => css1(v.t, "border", `${v.n}px solid ${v.c}`) },
  { kind: "shadow", cat: "css", icon: "🌫️", name: "Sombra", row: ["Sombra en", { f: "t" }], fields: [target(".tarjeta")], gen: (v) => css1(v.t, "box-shadow", "0 10px 30px rgba(0, 0, 0, 0.35)") },
  { kind: "hover", cat: "css", icon: "👆", name: "Al pasar el mouse", row: ["Al pasar el mouse, el fondo de", { f: "t" }, "→", { f: "c" }], fields: [target("button"), color("#7e22ce")], gen: (v) => css1(`${v.t}:hover`, "background-color", v.c) },
  { kind: "csscode", cat: "css", icon: "✍️", name: "Mi código CSS", row: ["✍️ Mi código CSS:", { f: "x" }], fields: [{ key: "x", type: "textarea", def: "h1 {\n  letter-spacing: 2px;\n}" }], gen: (v) => ({ css: v.x.trim() }) },

  // ---------------- JavaScript (naranja): solo alert ----------------
  { kind: "alertload", cat: "js", icon: "💬", name: "Alerta al abrir", row: ["Al abrir la página → alerta:", { f: "x" }], fields: [{ key: "x", type: "text", def: "¡Bienvenido a mi página!" }], gen: (v) => ({ js: `alert(${jsStr(v.x)});` }) },
  {
    kind: "alertclick", cat: "js", icon: "👉", name: "Alerta al tocar", row: ["Cuando toco", { f: "t" }, "→ alerta:", { f: "x" }],
    fields: [
      { key: "t", type: "select", def: "button", options: [{ v: "button", l: "el botón" }, { v: "h1", l: "el título" }, { v: "img", l: "la imagen" }, { v: "p", l: "el párrafo" }] },
      { key: "x", type: "text", def: "¡Hola desde mi página!" },
    ],
    gen: (v) => ({ js: `document.querySelector("${v.t}").addEventListener("click", () => {\n  alert(${jsStr(v.x)});\n});` }),
  },
];

export const DEFS: Record<string, BlockDef> = Object.fromEntries(defs.map((d) => [d.kind, d]));
export const PALETTE = defs;

export const CATS: { key: Cat; icon: string; label: string; help: string }[] = [
  { key: "html", icon: "🧱", label: "HTML", help: "Lo que hay en la página" },
  { key: "css", icon: "🎨", label: "CSS", help: "Cómo se ve" },
  { key: "js", icon: "⚡", label: "JavaScript", help: "Solo alert" },
];

// --- armar bloques ----------------------------------------------------------

export function defaults(kind: string): Record<string, string> {
  const d = DEFS[kind];
  return d ? Object.fromEntries(d.fields.map((f) => [f.key, f.def])) : {};
}

let counter = 0;
export function newBlock(kind: string, vals: Record<string, string> = {}, id?: string): Block {
  counter += 1;
  return { id: id ?? `b${counter}${Math.random().toString(36).slice(2, 6)}`, kind, vals: { ...defaults(kind), ...vals } };
}

const filled = (b: Block) => ({ ...defaults(b.kind), ...b.vals });

/** Convierte los bloques en HTML, CSS y JavaScript. */
export function generate(blocks: Block[]) {
  const html: string[] = [];
  const rules = new Map<string, Map<string, string>>();
  const css: string[] = [];
  const js: string[] = [];

  for (const b of blocks) {
    const d = DEFS[b.kind];
    if (!d) continue;
    const g = d.gen(filled(b));
    if (g.html) html.push(g.html);
    if (g.css) css.push(g.css);
    if (g.js) js.push(g.js);
    for (const r of g.rules ?? []) {
      const props = rules.get(r.sel) ?? new Map<string, string>();
      for (const [p, v] of r.props) props.set(p, v); // si repiten una propiedad, gana la última (como en CSS)
      rules.set(r.sel, props);
    }
  }

  const htmlOut = html.length
    ? `<div class="tarjeta">\n${html.map((h) => h.split("\n").map((l) => "  " + l).join("\n")).join("\n")}\n</div>`
    : "";
  const cssOut = [...rules.entries()]
    .map(([sel, props]) => `${sel} {\n${[...props].map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`)
    .concat(css)
    .join("\n\n");
  return { html: htmlOut, css: cssOut, js: js.join("\n\n") };
}

/** El código de UN bloque (para mostrarlo debajo de él). */
export function snippet(b: Block): string {
  const d = DEFS[b.kind];
  if (!d) return "";
  const g = d.gen(filled(b));
  if (g.html) return g.html;
  if (g.js) return g.js;
  if (g.css) return g.css;
  return (g.rules ?? []).map((r) => `${r.sel} {\n${r.props.map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`).join("\n");
}

// --- retos con bloques ------------------------------------------------------

export type BReto = {
  id: string;
  icon: string;
  title: string;
  intro: string;
  start: Block[];
  misiones: Mision[];
  solution: Block[];
};

const raw = String.raw;
let sid = 0;
const S = (kind: string, vals: Record<string, string> = {}) => newBlock(kind, vals, `s${++sid}`);

// Pruebas que se repiten en varios retos
const T = {
  h1Propio: raw`(function(){var h=document.querySelector('div.tarjeta h1');return !!h&&h.textContent.trim().length>1&&h.textContent.trim()!=='Mi título'})()`,
  imgAlt: raw`(function(){var i=document.querySelector('div.tarjeta img');return !!i&&!!i.getAttribute('src')&&!!i.getAttribute('alt')&&i.getAttribute('alt').trim().length>0})()`,
  lista3: raw`document.querySelectorAll('div.tarjeta ul li').length>=3`,
  alertClick: raw`/alert *\(/.test(__js()) && /addEventListener *\( *["']click["']/.test(__js())`,
  bodyOscuro: raw`(function(){var s=getComputedStyle(document.body).backgroundColor;if(s==='rgba(0, 0, 0, 0)'||s==='transparent')return false;var c=s.match(/[0-9.]+/g).map(Number);return (c[0]+c[1]+c[2])/3<110})()`,
  letraClara: raw`(function(){var c=getComputedStyle(document.body).color.match(/[0-9.]+/g).map(Number);return (c[0]+c[1]+c[2])/3>150})()`,
  h1OtroColor: raw`getComputedStyle(document.querySelector('h1')).color!==getComputedStyle(document.querySelector('p')).color`,
  fuente: raw`getComputedStyle(document.body).fontFamily.indexOf('Times')<0`,
  tarjetaCentrada: raw`__rule('=.tarjeta', /max-width/) && __rule('=.tarjeta', /margin[^;]*auto/)`,
  tarjetaRedonda: raw`parseFloat(getComputedStyle(document.querySelector('.tarjeta')).borderTopLeftRadius)>=8`,
  tarjetaSombra: raw`(function(){var s=getComputedStyle(document.querySelector('.tarjeta'));return s.boxShadow!=='none'||parseFloat(s.borderTopWidth)>0})()`,
  botonEstilo: raw`__rule('=button', /background/) && __rule('=button', /border-radius/)`,
};

export const bretos: BReto[] = [
  {
    id: "b-tarjeta",
    icon: "🙋",
    title: "Mi tarjeta de presentación",
    intro: "Armá tu tarjeta con bloques azules (HTML). Cambiá el texto de cada bloque por el tuyo y mirá el código que se va escribiendo.",
    start: [],
    misiones: [
      { t: "Un título grande con tu nombre (cambiale el texto al bloque)", test: T.h1Propio, hint: "Sumá el bloque «Título grande» y escribí tu nombre." },
      { t: "Un subtítulo", test: raw`document.querySelector('div.tarjeta h2')`, hint: "Bloque «Subtítulo»." },
      { t: "Una imagen con descripción (alt)", test: T.imgAlt, hint: "Bloque «Imagen»: la descripción va en el segundo campo." },
      { t: "Dos párrafos con tu propio texto", test: raw`[].filter.call(document.querySelectorAll('div.tarjeta p'),function(p){var t=p.textContent.trim();return t.length>5&&t!=='Escribí algo acá'}).length>=2`, hint: "Sumá dos bloques «Párrafo» y escribí algo en cada uno." },
      { t: "Una lista con 3 ítems", test: T.lista3, hint: "Bloque «Lista»: un ítem por línea." },
      { t: "Un link a una página (que empiece con https://)", test: raw`document.querySelector('div.tarjeta a[href^="https://"]')`, hint: "Bloque «Link»." },
      { t: "Un botón", test: raw`document.querySelector('div.tarjeta button')`, hint: "Bloque «Botón»." },
      { t: "Una alerta al tocar el botón (bloque naranja)", test: T.alertClick, hint: "Bloque naranja «Alerta al tocar», con el botón elegido." },
    ],
    solution: [
      S("h1", { x: "Ana García" }), S("h2", { x: "Mis gustos" }), S("img", { alt: "Foto de Ana" }),
      S("p", { x: "Tengo 15 años y me encanta la música." }), S("p", { x: "En el taller aprendí HTML y CSS." }),
      S("list", { x: "Fútbol\nSeries\nJuegos" }), S("link"), S("btn", { x: "Saludar" }), S("alertclick", { x: "¡Hola! Gracias por visitarme" }),
    ],
  },
  {
    id: "b-estilo",
    icon: "🎨",
    title: "Ponele estilo",
    intro: "La tarjeta ya está armada pero se ve fea. Sumá bloques violetas (CSS) para darle colores, esquinas redondeadas y sombra. Elegí en cada bloque a qué se lo aplicás.",
    start: [S("h1", { x: "Mi tarjeta" }), S("img", { alt: "Foto" }), S("p", { x: "Esta tarjeta todavía no tiene estilo. ¡Vos se lo vas a dar!" }), S("btn", { x: "Me gusta" })],
    misiones: [
      { t: "Fondo oscuro en la página", test: T.bodyOscuro, hint: "Bloque «Color de fondo» → la página → un color oscuro." },
      { t: "Letras claras en la página", test: T.letraClara, hint: "Bloque «Color de letra» → la página → un color claro." },
      { t: "El título de otro color que el resto del texto", test: T.h1OtroColor, hint: "Bloque «Color de letra» → el título." },
      { t: "Un tipo de letra propio para la página", test: T.fuente, hint: "Bloque «Tipo de letra» → la página." },
      { t: "La tarjeta con espacio de adentro (16 o más)", test: raw`parseFloat(getComputedStyle(document.querySelector('.tarjeta')).paddingTop)>=16`, hint: "Bloque «Espacio de adentro» → la tarjeta." },
      { t: "La tarjeta con esquinas redondeadas (8 o más)", test: T.tarjetaRedonda, hint: "Bloque «Esquinas redondeadas» → la tarjeta." },
      { t: "La tarjeta centrada y con ancho máximo", test: T.tarjetaCentrada, hint: "Bloques «Ancho máximo» y «Centrar la caja» → la tarjeta." },
      { t: "La tarjeta con sombra o borde", test: T.tarjetaSombra, hint: "Bloque «Sombra» o «Borde» → la tarjeta." },
      { t: "Un efecto al pasar el mouse", test: raw`__rule(':hover', /./)`, hint: "Bloque «Al pasar el mouse»." },
      { t: "El botón con color de fondo y esquinas redondeadas", test: T.botonEstilo, hint: "Bloques «Color de fondo» y «Esquinas redondeadas» → el botón." },
    ],
    solution: [
      S("h1", { x: "Mi tarjeta" }), S("img", { alt: "Foto" }), S("p", { x: "Esta tarjeta todavía no tiene estilo. ¡Vos se lo vas a dar!" }), S("btn", { x: "Me gusta" }),
      S("bg", { t: "body", c: "#111827" }), S("color", { t: "body", c: "#f9fafb" }), S("color", { t: "h1", c: "#c084fc" }), S("font", { t: "body", f: "Georgia, serif" }),
      S("padding", { t: ".tarjeta", n: "20" }), S("radius", { t: ".tarjeta", n: "16" }), S("width", { t: ".tarjeta", n: "340" }), S("centerbox", { t: ".tarjeta" }),
      S("shadow", { t: ".tarjeta" }), S("hover", { t: "button", c: "#7e22ce" }), S("bg", { t: "button", c: "#a855f7" }), S("radius", { t: "button", n: "20" }),
    ],
  },
  {
    id: "b-alert",
    icon: "💬",
    title: "Cartel de bienvenida (alert)",
    intro: "Tu primer JavaScript con bloques naranjas: las alertas. Las alertas aparecen arriba en la vista previa. Además, dale estilo al botón y al título.",
    start: [S("h1", { x: "¡Hola!" }), S("p", { x: "Tocá el botón." }), S("btn", { x: "Tocame" })],
    misiones: [
      { t: "Una alerta al tocar el botón", test: T.alertClick, hint: "Bloque naranja «Alerta al tocar» → el botón." },
      { t: "Una alerta apenas se abre la página", test: raw`/^alert *\(/m.test(__js())`, hint: "Bloque naranja «Alerta al abrir»." },
      { t: "Cambiá el texto de las alertas por uno tuyo", test: raw`(function(){var m=__js().match(/alert *\( *"[^"]*"/g)||[];return m.length>=1&&m.every(function(x){var t=x.replace(/^alert *\( *"/,'').replace(/"$/,'');return t!=="¡Hola desde mi página!"&&t!=="¡Bienvenido a mi página!"})})()`, hint: "Escribí otro mensaje adentro de cada bloque naranja." },
      { t: "El botón con color de fondo y esquinas redondeadas", test: T.botonEstilo, hint: "Bloques violetas «Color de fondo» y «Esquinas redondeadas» → el botón." },
      { t: "El título de otro color", test: raw`getComputedStyle(document.querySelector('h1')).color!=='rgb(0, 0, 0)'`, hint: "Bloque «Color de letra» → el título." },
    ],
    solution: [
      S("h1", { x: "¡Hola!" }), S("p", { x: "Tocá el botón." }), S("btn", { x: "Tocame" }),
      S("alertload", { x: "Hola, soy Ana" }), S("alertclick", { x: "¡Gracias por tocar!" }),
      S("bg", { t: "button", c: "#f59e0b" }), S("radius", { t: "button", n: "20" }), S("color", { t: "h1", c: "#7c3aed" }),
    ],
  },
  {
    id: "b-portfolio",
    icon: "💼",
    title: "Mini portfolio con bloques",
    intro: "El más largo: armá un mini portfolio mezclando bloques azules (HTML), violetas (CSS) y una alerta naranja. Es un ensayo para tu portfolio de verdad.",
    start: [],
    misiones: [
      { t: "Un título grande con tu nombre", test: T.h1Propio },
      { t: "Un subtítulo (por ejemplo «Sobre mí»)", test: raw`document.querySelector('div.tarjeta h2')` },
      { t: "Un párrafo sobre vos (más de 20 letras)", test: raw`[].some.call(document.querySelectorAll('div.tarjeta p'),function(p){var t=p.textContent.trim();return t.length>20&&t!=='Escribí algo acá'})` },
      { t: "Una imagen con descripción (alt)", test: T.imgAlt },
      { t: "Una lista de 3 proyectos o gustos", test: T.lista3 },
      { t: "Dos links", test: raw`document.querySelectorAll('div.tarjeta a[href]').length>=2` },
      { t: "Un fondo de color en la página (que no sea blanco)", test: raw`(function(){var s=getComputedStyle(document.body).backgroundColor;return s!=='rgba(0, 0, 0, 0)'&&s!=='rgb(255, 255, 255)'})()` },
      { t: "La tarjeta centrada y con ancho máximo", test: T.tarjetaCentrada },
      { t: "La tarjeta con esquinas redondeadas y sombra o borde", test: raw`(function(){var s=getComputedStyle(document.querySelector('.tarjeta'));return parseFloat(s.borderTopLeftRadius)>=8&&(s.boxShadow!=='none'||parseFloat(s.borderTopWidth)>0)})()` },
      { t: "El título de otro color que el resto", test: T.h1OtroColor },
      { t: "Un tipo de letra propio", test: T.fuente },
      { t: "Un botón «Contactame» con una alerta al tocarlo", test: raw`!!document.querySelector('div.tarjeta button')&&/alert *\(/.test(__js())&&/addEventListener *\( *["']click["']/.test(__js())` },
    ],
    solution: [
      S("h1", { x: "Ana García" }), S("h2", { x: "Sobre mí" }), S("p", { x: "Soy Ana, tengo 15 años y estoy aprendiendo a programar con IA." }),
      S("img", { alt: "Foto de Ana" }), S("list", { x: "Spotify\nPinterest\nMi juego" }), S("link", { x: "Mi Spotify", u: "https://example.com/spotify" }),
      S("link", { x: "Mi Pinterest", u: "https://example.com/pinterest" }), S("btn", { x: "Contactame" }), S("alertclick", { x: "Escribime a ana@ejemplo.com" }),
      S("bg", { t: "body", c: "#0f172a" }), S("color", { t: "body", c: "#f8fafc" }), S("color", { t: "h1", c: "#38bdf8" }), S("font", { t: "body", f: "Verdana, sans-serif" }),
      S("width", { t: ".tarjeta", n: "400" }), S("centerbox", { t: ".tarjeta" }), S("radius", { t: ".tarjeta", n: "18" }), S("shadow", { t: ".tarjeta" }),
    ],
  },
];
