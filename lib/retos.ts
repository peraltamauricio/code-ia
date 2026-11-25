// Retos largos de /jugar → Retos.
// Cada reto tiene "misiones": el alumno escribe código y la página las va tildando sola.
// Cada misión tiene una prueba (`test`) que se evalúa ADENTRO de la vista previa del alumno.
// Ayudas disponibles dentro de las pruebas:
//   __js()                → el JavaScript que escribió el alumno (texto)
//   __rule("texto", /re/) → ¿hay una regla de CSS cuyo selector tenga "texto" y que cumpla /re/?
// Las pruebas que "tocan" botones son de retos con `interactive: true`: después de probar,
// la vista previa se recarga para que no quede el contador o los corazones cambiados.

export type Mision = { t: string; test: string; hint?: string };
export type Code = { html: string; css: string; js: string };
export type Reto = {
  id: string;
  icon: string;
  title: string;
  langs: ("HTML" | "CSS" | "JS")[];
  nivel: 1 | 2 | 3;
  minutos: string;
  intro: string;
  tab: "html" | "css" | "js";
  interactive?: boolean;
  /** Reto "pedíselo a la IA": las pistas son prompts y no se exige escribir un código en particular. */
  ai?: boolean;
  start: Code;
  misiones: Mision[];
  solution: Code;
};

const raw = String.raw;

export const retos: Reto[] = [
  // ------------------------------------------------------------------
  {
    id: "tarjeta",
    icon: "🙋",
    title: "Mi tarjeta de presentación",
    langs: ["HTML"],
    nivel: 1,
    minutos: "20-30 min",
    intro:
      "Armá tu tarjeta de presentación con HTML puro. Empezá con la caja <div class=\"tarjeta\"> y poné todo adentro. A medida que cumplís una misión, se tilda sola ✓",
    tab: "html",
    start: {
      html: `<!-- RETO 1 · Mi tarjeta de presentación
     Armá tu tarjeta de a una misión por vez.
     Empezá con <div class="tarjeta"> ... </div> y poné todo adentro. -->

`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: ``,
    },
    misiones: [
      { t: "Una caja <div class=\"tarjeta\"> con un título <h1> con tu nombre adentro", test: raw`document.querySelector('div.tarjeta h1').textContent.trim().length > 1`, hint: "<div class=\"tarjeta\"><h1>Tu nombre</h1></div>. Acordate de cerrar el div." },
      { t: "Un subtítulo <h2> (por ejemplo «Mis gustos»)", test: raw`document.querySelector('h2')`, hint: "Igual que el h1 pero con h2: <h2>Mis gustos</h2>" },
      { t: "Una imagen <img> con src y con alt (el alt describe la foto)", test: raw`(function(){var i=document.querySelector('div.tarjeta img');return !!i && !!i.getAttribute('src') && !!i.getAttribute('alt') && i.getAttribute('alt').trim().length>0})()`, hint: "<img src=\"https://picsum.photos/400/200\" alt=\"Mi foto\"> (la imagen va adentro de la tarjeta)" },
      { t: "Al menos 2 párrafos <p> con texto", test: raw`[].filter.call(document.querySelectorAll('p'),function(p){return p.textContent.trim().length>5}).length>=2`, hint: "Un <p> con algo sobre vos y otro con lo que aprendiste en el taller." },
      { t: "Una lista <ul> con al menos 3 <li>", test: raw`document.querySelectorAll('ul li').length>=3`, hint: "<ul><li>Uno</li><li>Dos</li><li>Tres</li></ul>" },
      { t: "Un link <a> con href que empiece con https://", test: raw`document.querySelector('a[href^="https://"]')`, hint: "<a href=\"https://code-ia-taller.vercel.app\">Mi taller</a>" },
      { t: "Que el link se abra en una pestaña nueva (target=\"_blank\")", test: raw`document.querySelector('a[target="_blank"]')`, hint: "Agregale target=\"_blank\" adentro de la etiqueta <a ...>" },
      { t: "Un botón <button>", test: raw`document.querySelector('div.tarjeta button')`, hint: "<button>Saludar</button> (adentro de la tarjeta)" },
    ],
    solution: {
      html: `<div class="tarjeta">
  <h1>Ana García</h1>
  <h2>Mis gustos</h2>
  <img src="https://picsum.photos/seed/ana/400/200" alt="Foto de Ana">
  <p>Tengo 15 años y me encanta la música.</p>
  <p>En el taller aprendí HTML, CSS y JavaScript.</p>
  <ul>
    <li>Fútbol</li>
    <li>Series</li>
    <li>Videojuegos</li>
  </ul>
  <a href="https://code-ia-taller.vercel.app" target="_blank">Mirá mi taller</a>
  <br><br>
  <button>Saludar</button>
</div>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: ``,
    },
  },

  // ------------------------------------------------------------------
  {
    id: "estilo",
    icon: "🎨",
    title: "Ponele estilo",
    langs: ["CSS"],
    nivel: 1,
    minutos: "25-30 min",
    intro:
      "La tarjeta ya está armada en HTML pero se ve fea. Escribí CSS para dejarla linda. Las misiones te dicen qué propiedades usar y en qué clases (.tarjeta, .boton).",
    tab: "css",
    start: {
      html: `<div class="tarjeta">
  <h1>Mi tarjeta</h1>
  <img src="https://picsum.photos/seed/tarjeta/400/200" alt="Foto">
  <p>Esta tarjeta todavía no tiene estilo. ¡Vos se lo vas a dar!</p>
  <button class="boton">Me gusta</button>
</div>`,
      css: `/* RETO 2 · Ponele estilo
   Escribí tu CSS acá y mirá cómo cambia la tarjeta. */

`,
      js: ``,
    },
    misiones: [
      { t: "Fondo oscuro en el body (background-color)", test: raw`(function(){var s=getComputedStyle(document.body).backgroundColor;if(s==='rgba(0, 0, 0, 0)'||s==='transparent')return false;var c=s.match(/[0-9.]+/g).map(Number);return (c[0]+c[1]+c[2])/3<110})()`, hint: "body { background-color: #111827; }" },
      { t: "Letras claras en el body (color)", test: raw`(function(){var c=getComputedStyle(document.body).color.match(/[0-9.]+/g).map(Number);return (c[0]+c[1]+c[2])/3>150})()`, hint: "body { color: #f9fafb; }" },
      { t: "El h1 de un color distinto al del resto del texto", test: raw`getComputedStyle(document.querySelector('h1')).color!==getComputedStyle(document.querySelector('p')).color`, hint: "h1 { color: #c084fc; }" },
      { t: "Una tipografía propia en el body (font-family)", test: raw`getComputedStyle(document.body).fontFamily.indexOf('Times')<0`, hint: "body { font-family: Arial, sans-serif; }" },
      { t: "La .tarjeta con padding de al menos 16px", test: raw`parseFloat(getComputedStyle(document.querySelector('.tarjeta')).paddingTop)>=16`, hint: ".tarjeta { padding: 20px; }" },
      { t: "La .tarjeta con esquinas redondeadas (border-radius de 8px o más)", test: raw`parseFloat(getComputedStyle(document.querySelector('.tarjeta')).borderTopLeftRadius)>=8`, hint: ".tarjeta { border-radius: 16px; }" },
      { t: "La .tarjeta centrada con un ancho máximo (max-width y margin con auto)", test: raw`__rule('tarjeta', /max-width/) && __rule('tarjeta', /margin[^;]*auto/)`, hint: ".tarjeta { max-width: 340px; margin: 20px auto; }" },
      { t: "La .tarjeta con una sombra (box-shadow) o un borde", test: raw`(function(){var s=getComputedStyle(document.querySelector('.tarjeta'));return s.boxShadow!=='none'||parseFloat(s.borderTopWidth)>0})()`, hint: ".tarjeta { box-shadow: 0 10px 30px rgba(0,0,0,0.5); }" },
      { t: "Un efecto :hover (por ejemplo, que la tarjeta se levante al pasar el mouse)", test: raw`__rule(':hover', /./)`, hint: ".tarjeta:hover { transform: translateY(-4px); }" },
      { t: "La clase .boton con color de fondo propio y esquinas redondeadas", test: raw`__rule('.boton', /background/) && __rule('.boton', /border-radius/)`, hint: ".boton { background-color: #a855f7; border-radius: 999px; border: none; color: white; padding: 10px 20px; }" },
    ],
    solution: {
      html: `<div class="tarjeta">
  <h1>Mi tarjeta</h1>
  <img src="https://picsum.photos/seed/tarjeta/400/200" alt="Foto">
  <p>Esta tarjeta todavía no tiene estilo. ¡Vos se lo vas a dar!</p>
  <button class="boton">Me gusta</button>
</div>`,
      css: `body {
  background-color: #111827;
  color: #f9fafb;
  font-family: Arial, sans-serif;
}
h1 { color: #c084fc; }
.tarjeta {
  max-width: 340px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 16px;
  background-color: #1f2937;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
}
.tarjeta:hover { transform: translateY(-4px); }
img { width: 100%; border-radius: 12px; }
.boton {
  background-color: #a855f7;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  cursor: pointer;
}
.boton:hover { background-color: #7e22ce; }`,
      js: ``,
    },
  },

  // ------------------------------------------------------------------
  {
    id: "pinterest",
    icon: "📌",
    title: "Mosaico estilo Pinterest",
    langs: ["CSS"],
    nivel: 2,
    minutos: "30-40 min",
    intro:
      "El HTML de un mini Pinterest ya está hecho: header con buscador y un mosaico de pines. Con CSS convertilo en un mosaico lindo que además se vea bien en el celular.",
    tab: "css",
    start: {
      html: `<header>
  <h1>📌 Pinteresito</h1>
  <input class="buscador" type="text" placeholder="Buscar ideas...">
</header>
<div class="mosaico">
  <div class="pin"><img src="https://picsum.photos/seed/m1/300/400" alt="Pin 1"><p>Pin 1</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m2/300/300" alt="Pin 2"><p>Pin 2</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m3/300/450" alt="Pin 3"><p>Pin 3</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m4/300/350" alt="Pin 4"><p>Pin 4</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m5/300/420" alt="Pin 5"><p>Pin 5</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m6/300/320" alt="Pin 6"><p>Pin 6</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m7/300/380" alt="Pin 7"><p>Pin 7</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m8/300/300" alt="Pin 8"><p>Pin 8</p></div>
</div>`,
      css: `/* RETO 3 · Mosaico estilo Pinterest
   Seguí las misiones de arriba hacia abajo. */

`,
      js: ``,
    },
    misiones: [
      { t: "El .mosaico con 2 o más columnas (columns o display: grid)", test: raw`(function(){var s=getComputedStyle(document.querySelector('.mosaico'));return (s.columnCount!=='auto'&&parseInt(s.columnCount)>=2)||(s.display==='grid'&&s.gridTemplateColumns.split(' ').length>=2)})()`, hint: ".mosaico { columns: 3; column-gap: 12px; }" },
      { t: "Que los .pin no se corten entre columnas (break-inside: avoid)", test: raw`getComputedStyle(document.querySelector('.pin')).breakInside==='avoid'||getComputedStyle(document.querySelector('.mosaico')).display==='grid'`, hint: ".pin { break-inside: avoid; }" },
      { t: "Las imágenes ocupan todo el ancho de su tarjeta (width: 100%)", test: raw`__rule('img', /width: ?100%/)`, hint: ".pin img { width: 100%; }" },
      { t: "Imágenes con esquinas redondeadas (border-radius de 12px o más)", test: raw`parseFloat(getComputedStyle(document.querySelector('.pin img')).borderTopLeftRadius)>=12`, hint: ".pin img { border-radius: 16px; }" },
      { t: "Separación entre tarjetas (margin-bottom de 8px o más)", test: raw`parseFloat(getComputedStyle(document.querySelector('.pin')).marginBottom)>=8||parseFloat(getComputedStyle(document.querySelector('.mosaico')).gap)>=8`, hint: ".pin { margin-bottom: 12px; }" },
      { t: "Un fondo de color en el body (que no sea blanco)", test: raw`(function(){var s=getComputedStyle(document.body).backgroundColor;return s!=='rgba(0, 0, 0, 0)'&&s!=='rgb(255, 255, 255)'})()`, hint: "body { background-color: #fff7ed; }" },
      { t: "Efecto al pasar el mouse sobre un pin (.pin:hover)", test: raw`__rule('.pin:hover', /./)`, hint: ".pin:hover { transform: scale(1.03); }" },
      { t: "El buscador (.buscador) con esquinas muy redondeadas y padding", test: raw`(function(){var s=getComputedStyle(document.querySelector('.buscador'));return parseFloat(s.borderTopLeftRadius)>=12&&parseFloat(s.paddingTop)>=8})()`, hint: ".buscador { padding: 10px 16px; border-radius: 999px; }" },
      { t: "El header se queda fijo arriba al hacer scroll (position: sticky)", test: raw`/sticky|fixed/.test(getComputedStyle(document.querySelector('header')).position)`, hint: "header { position: sticky; top: 0; background: white; }" },
      { t: "Se adapta al celular: una regla @media", test: raw`__rule('@media', /./)`, hint: "@media (max-width: 500px) { .mosaico { columns: 2; } }" },
    ],
    solution: {
      html: `<header>
  <h1>📌 Pinteresito</h1>
  <input class="buscador" type="text" placeholder="Buscar ideas...">
</header>
<div class="mosaico">
  <div class="pin"><img src="https://picsum.photos/seed/m1/300/400" alt="Pin 1"><p>Pin 1</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m2/300/300" alt="Pin 2"><p>Pin 2</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m3/300/450" alt="Pin 3"><p>Pin 3</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m4/300/350" alt="Pin 4"><p>Pin 4</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m5/300/420" alt="Pin 5"><p>Pin 5</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m6/300/320" alt="Pin 6"><p>Pin 6</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m7/300/380" alt="Pin 7"><p>Pin 7</p></div>
  <div class="pin"><img src="https://picsum.photos/seed/m8/300/300" alt="Pin 8"><p>Pin 8</p></div>
</div>`,
      css: `body {
  margin: 0;
  background-color: #fff7ed;
  font-family: Arial, sans-serif;
}
header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
header h1 { margin: 0; font-size: 20px; color: #e60023; }
.buscador {
  flex: 1;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid #ddd;
}
.mosaico {
  columns: 3;
  column-gap: 12px;
  padding: 12px;
}
.pin {
  break-inside: avoid;
  margin-bottom: 12px;
  transition: transform 0.2s;
}
.pin img {
  width: 100%;
  border-radius: 16px;
  display: block;
}
.pin:hover { transform: scale(1.03); }
@media (max-width: 500px) {
  .mosaico { columns: 2; }
}`,
      js: ``,
    },
  },

  // ------------------------------------------------------------------
  {
    id: "alert",
    icon: "💬",
    title: "Cartel con alert",
    langs: ["HTML", "CSS", "JS"],
    nivel: 1,
    minutos: "15-20 min",
    intro:
      "Tu primer JavaScript: el alert. El código de JavaScript ya está armado, vos cambiás los textos de los carteles y le sumás estilo al botón con CSS. Las alertas aparecen arriba en la vista previa.",
    tab: "js",
    start: {
      html: `<h1>🎁 Una sorpresa</h1>
<p>Tocá el botón.</p>
<button id="sorpresa">Tocame</button>`,
      css: `body { font-family: sans-serif; padding: 20px; }
/* Con CSS: pintale el título de otro color y dale estilo al botón #sorpresa */

`,
      js: `// RETO · Cartel con alert
// Este código ya está armado. Tu trabajo: cambiar los textos de las alertas por los tuyos.

// 1) Este cartel aparece apenas se abre la página:
alert("¡Bienvenido!");

// 2) Este cartel aparece cuando tocás el botón:
document.querySelector("#sorpresa").addEventListener("click", () => {
  alert("¡Sorpresa!");
});

// 3) Sumá vos un tercer alert(...) acá abajo con otro mensaje:

`,
    },
    misiones: [
      { t: "Cambiá el texto de la alerta de bienvenida (que no diga «¡Bienvenido!»)", test: raw`(function(){var m=__js().match(/^alert *\( *"([^"]*)"/m);return !!m&&m[1].trim().length>2&&m[1].trim()!=="¡Bienvenido!"})()`, hint: "Cambiá lo que está entre comillas: alert(\"Hola, soy Ana\");" },
      { t: "Cambiá el texto de la alerta del botón (que no diga «¡Sorpresa!»)", test: raw`(function(){var m=__js().match(/addEventListener[\s\S]*?alert *\( *"([^"]*)"/);return !!m&&m[1].trim().length>2&&m[1].trim()!=="¡Sorpresa!"})()`, hint: "Es el alert que está adentro de las llaves { } del botón." },
      { t: "Sumá un tercer alert(...) con otro mensaje", test: raw`(__js().match(/alert *\(/g)||[]).length>=3`, hint: "Escribí otra línea al final:  alert(\"Otro mensaje\");" },
      { t: "Con CSS, pintá el título <h1> de otro color", test: raw`getComputedStyle(document.querySelector('h1')).color!=='rgb(0, 0, 0)'`, hint: "h1 { color: purple; }" },
      { t: "Con CSS, dale al botón (#sorpresa) un color de fondo y esquinas redondeadas", test: raw`__rule('#sorpresa', /background/) && __rule('#sorpresa', /border-radius/)`, hint: "#sorpresa { background-color: orange; border-radius: 20px; border: none; padding: 10px 18px; }" },
    ],
    solution: {
      html: `<h1>🎁 Una sorpresa</h1>
<p>Tocá el botón.</p>
<button id="sorpresa">Tocame</button>`,
      css: `body { font-family: sans-serif; padding: 20px; }
h1 { color: purple; }
#sorpresa {
  background-color: orange;
  border: none;
  border-radius: 20px;
  padding: 10px 18px;
  cursor: pointer;
}`,
      js: `alert("Hola, soy Ana. ¡Bienvenidos a mi página!");

document.querySelector("#sorpresa").addEventListener("click", () => {
  alert("¡Te dije que había una sorpresa! 🎉");
});

alert("Gracias por visitarme");`,
    },
  },

  // ------------------------------------------------------------------
  {
    id: "mini-portfolio",
    icon: "💼",
    title: "Mini portfolio",
    langs: ["HTML", "CSS"],
    nivel: 3,
    minutos: "50-60 min",
    intro:
      "El reto más largo: armá un mini portfolio con HTML y CSS. Es un ensayo para el portfolio de verdad (que armás en /portfolio). Seguí las misiones de arriba hacia abajo. Bonus: pedile a la IA un botón de modo oscuro.",
    tab: "html",
    start: {
      html: `<!-- RETO 7 · Mini portfolio
     Armá tu portfolio completo. Las misiones te van diciendo qué sumar.
     Idea de estructura: header (con nav) → sección sobre mí → sección proyectos → footer. -->

`,
      css: `body { font-family: sans-serif; margin: 0; }
`,
      js: ``,
    },
    misiones: [
      { t: "Un <header> con tu nombre en un <h1>", test: raw`document.querySelector('header h1').textContent.trim().length>1`, hint: "<header><h1>Tu nombre</h1></header>" },
      { t: "Un menú <nav> (dentro del header) con 3 links internos que empiecen con #", test: raw`document.querySelectorAll('nav a[href^="#"]').length>=3`, hint: "<nav><a href=\"#sobre-mi\">Sobre mí</a> <a href=\"#proyectos\">Proyectos</a> <a href=\"#contacto\">Contacto</a></nav>" },
      { t: "Una sección con id=\"sobre-mi\" que tenga un párrafo", test: raw`document.querySelector('#sobre-mi p').textContent.trim().length>5`, hint: "<section id=\"sobre-mi\"><h2>Sobre mí</h2><p>...</p></section>" },
      { t: "Una sección con id=\"proyectos\" con 3 tarjetas (class=\"proyecto\")", test: raw`document.querySelectorAll('#proyectos .proyecto').length>=3`, hint: "Adentro de la sección, 3 <div class=\"proyecto\">." },
      { t: "Cada tarjeta tiene un título <h3>, un párrafo <p> y un link <a href=...>", test: raw`(function(){var ps=document.querySelectorAll('.proyecto');if(ps.length<3)return false;for(var i=0;i<ps.length;i++){var p=ps[i];if(!p.querySelector('h3')||!p.querySelector('p')||!p.querySelector('a[href]'))return false}return true})()`, hint: "<div class=\"proyecto\"><h3>Spotify</h3><p>Mi versión.</p><a href=\"spotify/index.html\">Ver proyecto</a></div>" },
      { t: "Un <footer id=\"contacto\"> con un link de mail (href que empiece con mailto:)", test: raw`document.querySelector('footer a[href^="mailto:"]')`, hint: "<footer id=\"contacto\"><a href=\"mailto:tu@mail.com\">Escribime</a></footer>" },
      { t: "Las tarjetas están una al lado de otra con espacio entre ellas (display: flex o grid + gap)", test: raw`(function(){var c=document.querySelector('#proyectos .proyecto').parentElement;var s=getComputedStyle(c);return (s.display==='flex'||s.display==='grid')&&(parseFloat(s.gap)>=8||parseFloat(s.columnGap)>=8)})()`, hint: "Envolvé las tarjetas en un <div class=\"grilla\"> y en el CSS: .grilla { display: flex; gap: 12px; }" },
      { t: "Las tarjetas con esquinas redondeadas (8px o más) y con sombra o borde", test: raw`(function(){var s=getComputedStyle(document.querySelector('.proyecto'));return parseFloat(s.borderTopLeftRadius)>=8&&(s.boxShadow!=='none'||parseFloat(s.borderTopWidth)>0)})()`, hint: ".proyecto { border-radius: 14px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); padding: 16px; }" },
      { t: "Se adapta al celular con una regla @media", test: raw`__rule('@media', /./)`, hint: "@media (max-width: 600px) { .grilla { flex-direction: column; } }" },
    ],
    solution: {
      html: `<header>
  <h1>Ana García</h1>
  <nav>
    <a href="#sobre-mi">Sobre mí</a>
    <a href="#proyectos">Proyectos</a>
    <a href="#contacto">Contacto</a>
  </nav>
</header>

<section id="sobre-mi">
  <h2>Sobre mí</h2>
  <p>Soy Ana, tengo 15 años y estoy aprendiendo a programar con IA.</p>
</section>

<section id="proyectos">
  <h2>Mis proyectos</h2>
  <div class="grilla">
    <div class="proyecto">
      <h3>Spotify</h3>
      <p>Mi versión de Spotify con mis playlists.</p>
      <a href="spotify/index.html">Ver proyecto</a>
    </div>
    <div class="proyecto">
      <h3>Pinterest</h3>
      <p>Mosaico de imágenes con corazones.</p>
      <a href="pinterest/index.html">Ver proyecto</a>
    </div>
    <div class="proyecto">
      <h3>Mi juego</h3>
      <p>Adiviná el número.</p>
      <a href="juego/index.html">Ver proyecto</a>
    </div>
  </div>
</section>

<footer id="contacto">
  <p>Escribime: <a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a></p>
</footer>`,
      css: `body { font-family: sans-serif; margin: 0; }
header { padding: 20px; background: #6d28d9; color: white; }
header h1 { margin: 0; }
nav a { color: white; margin-right: 12px; }
section { padding: 20px; }
.grilla { display: flex; gap: 12px; }
.proyecto {
  flex: 1;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
footer { padding: 20px; background: #eee; }
@media (max-width: 600px) {
  .grilla { flex-direction: column; }
}`,
      js: ``,
    },
  },
];
