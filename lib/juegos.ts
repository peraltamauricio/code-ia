// Contenido de la zona de juegos (/jugar). Para sumar preguntas, bugs o pares,
// copiá una línea parecida y cambiale el texto.
//
// Todo lo marcado como "js" se esconde solo hasta que se habilite la Clase 7
// (la de JavaScript) en lib/curriculum.ts.

import { isUnlocked } from "./curriculum";

/** ¿Ya dimos JavaScript? (Clase 7 habilitada) */
export const jsUnlocked = isUnlocked(7);

export type QuizCat = "html" | "css" | "js" | "web";

export type QuizQ = {
  cat: QuizCat;
  q: string;
  opts: string[];
  /** Índice de la respuesta correcta dentro de opts (empieza en 0). */
  ok: number;
  why: string;
};

export const QUIZ_CATS: { key: QuizCat | "todo"; label: string; icon: string }[] = [
  { key: "todo", label: "Mezcla", icon: "🎲" },
  { key: "html", label: "HTML", icon: "</>" },
  { key: "css", label: "CSS", icon: "{ }" },
  { key: "web", label: "Compu e IA", icon: "💻" },
  ...(jsUnlocked ? [{ key: "js" as const, label: "JavaScript", icon: "⚡" }] : []),
];

const allQuiz: QuizQ[] = [
  // ---------- HTML ----------
  { cat: "html", q: "¿Qué etiqueta es para un TÍTULO grande?", opts: ["<h1>", "<p>", "<img>"], ok: 0, why: "<h1> es el título grande de la página." },
  { cat: "html", q: "¿Qué etiqueta es para un PÁRRAFO de texto?", opts: ["<a>", "<p>", "<h1>"], ok: 1, why: "<p> viene de \"párrafo\"." },
  { cat: "html", q: "¿Qué etiqueta muestra una IMAGEN?", opts: ["<img>", "<p>", "<link>"], ok: 0, why: "<img> = imagen." },
  { cat: "html", q: "¿Qué etiqueta hace un LINK que te lleva a otra página?", opts: ["<h2>", "<img>", "<a>"], ok: 2, why: "<a href=\"...\"> es el link." },
  { cat: "html", q: "¿Cuál es más grande: <h1> o <h3>?", opts: ["<h1>", "<h3>", "Son iguales"], ok: 0, why: "Mientras más chico el número, más grande el título." },
  { cat: "html", q: "¿Cómo termina (se cierra) un párrafo?", opts: ["<p>", "</p>", "<p/>"], ok: 1, why: "La barra / indica que la etiqueta se cierra: </p>." },
  { cat: "html", q: "¿Con qué extensión se guarda una página web?", opts: [".html", ".docx", ".jpg"], ok: 0, why: "Las páginas se guardan como .html, por ejemplo index.html." },
  { cat: "html", q: "En <img src=\"perro.jpg\">, ¿qué es perro.jpg?", opts: ["El título", "La foto que se muestra", "Un link"], ok: 1, why: "src dice qué foto mostrar." },
  { cat: "html", q: "En <a href=\"https://google.com\">, ¿qué es href?", opts: ["A dónde te lleva el link", "El color del link", "El tamaño"], ok: 0, why: "href es la dirección a la que va el link." },
  { cat: "html", q: "¿Qué etiqueta hace una lista con puntitos?", opts: ["<ul>", "<h1>", "<img>"], ok: 0, why: "<ul> es la lista, y cada ítem va en <li>." },
  { cat: "html", q: "¿Qué etiqueta crea un botón?", opts: ["<boton>", "<button>", "<click>"], ok: 1, why: "<button> (en inglés) = botón." },
  { cat: "html", q: "¿Dónde va lo que se VE en la página?", opts: ["Dentro de <body>", "Dentro de <title>", "Afuera de todo"], ok: 0, why: "body = cuerpo. Todo lo visible va ahí." },

  // ---------- CSS ----------
  { cat: "css", q: "¿Para qué sirve el CSS?", opts: ["Para darle estilo: colores, letras, tamaños", "Para escribir los textos", "Para subir la página"], ok: 0, why: "HTML es el esqueleto, CSS es la ropa." },
  { cat: "css", q: "¿Cómo se llama el archivo de estilos que usamos?", opts: ["style.css", "index.html", "foto.png"], ok: 0, why: "style.css, y se conecta al HTML con <link>." },
  { cat: "css", q: "¿Qué propiedad cambia el color de las LETRAS?", opts: ["color", "background-color", "font-size"], ok: 0, why: "color = color del texto." },
  { cat: "css", q: "¿Qué propiedad cambia el color del FONDO?", opts: ["color", "background-color", "border"], ok: 1, why: "background = fondo." },
  { cat: "css", q: "¿Qué propiedad cambia el TAMAÑO de la letra?", opts: ["font-size", "color", "margin"], ok: 0, why: "font-size = tamaño de letra." },
  { cat: "css", q: "¿Qué hace border-radius?", opts: ["Redondea las esquinas", "Cambia el color", "Agranda la letra"], ok: 0, why: "Con border-radius las esquinas quedan redondeadas, como las tarjetas de Spotify." },
  { cat: "css", q: "¿Qué hace h1 { color: red; }?", opts: ["Pone los títulos h1 en rojo", "Borra los títulos", "Pone el fondo rojo"], ok: 0, why: "Elige los h1 y les pinta las letras de rojo." },
  { cat: "css", q: "¿Qué hace font-family?", opts: ["Cambia el tipo de letra", "Cambia el color", "Agrega una imagen"], ok: 0, why: "font-family elige la tipografía, por ejemplo Arial." },
  { cat: "css", q: "¿Qué hace :hover?", opts: ["Cambia algo cuando pasás el mouse por encima", "Esconde todo", "Hace un link"], ok: 0, why: "Como las tarjetas de Spotify que se iluminan al pasar el mouse." },
  { cat: "css", q: "¿Qué es padding?", opts: ["Espacio de adentro de una caja", "El color", "Una imagen"], ok: 0, why: "padding = relleno, espacio interior. margin es el espacio de afuera." },
  { cat: "css", q: "¿Con qué signo se cierran las reglas de CSS?", opts: ["{ }", "( )", "< >"], ok: 0, why: "Las propiedades van entre llaves: h1 { color: red; }" },
  { cat: "css", q: "¿Qué va al final de cada propiedad, como color: red?", opts: [";", ".", ","], ok: 0, why: "Punto y coma. Si falta, lo de abajo se puede romper." },

  // ---------- Compu e IA ----------
  { cat: "web", q: "¿Qué programa usamos para escribir código?", opts: ["Visual Studio Code", "Paint", "WhatsApp"], ok: 0, why: "VS Code es nuestro editor de código." },
  { cat: "web", q: "¿Qué atajo GUARDA el archivo?", opts: ["Ctrl + S", "Ctrl + Z", "Ctrl + P"], ok: 0, why: "Ctrl+S = save (guardar). Si no guardás, el navegador no ve los cambios." },
  { cat: "web", q: "Cambiaste el código pero en el navegador no se ve. ¿Qué hacés?", opts: ["Guardo y refresco (F5)", "Apago la compu", "Lo escribo de nuevo"], ok: 0, why: "Ctrl+S en VS Code y F5 en el navegador." },
  { cat: "web", q: "¿Qué atajo DESHACE lo último que hiciste?", opts: ["Ctrl + Z", "Ctrl + S", "Ctrl + C"], ok: 0, why: "Ctrl+Z te salva cuando borraste algo sin querer." },
  { cat: "web", q: "¿Con qué IA armamos el Spotify y el Pinterest?", opts: ["ChatGPT", "Siri", "Google Maps"], ok: 0, why: "Le pedimos el HTML y CSS a ChatGPT." },
  { cat: "web", q: "La IA te da código que no entendés. ¿Qué conviene hacer?", opts: ["Pedirle que me lo explique", "Copiarlo sin mirar", "Cerrar todo"], ok: 0, why: "La IA es copiloto: le podés pedir que te explique cada parte." },
  { cat: "web", q: "¿Cuál prompt es mejor?", opts: ["\"Haceme una página tipo Pinterest de autos, con fondo oscuro\"", "\"página\"", "\"hola\""], ok: 0, why: "Mientras más claro digas qué querés, mejor responde." },
  { cat: "web", q: "¿Cómo se llama el archivo principal de una página?", opts: ["index.html", "hola.txt", "foto.jpg"], ok: 0, why: "index.html es el que se abre primero." },
  { cat: "web", q: "¿Qué es el proyecto final del taller?", opts: ["Un portfolio con todos mis proyectos", "Un video", "Un dibujo"], ok: 0, why: "Una página que junta la presentación, el Spotify, el Pinterest y más." },
  { cat: "web", q: "¿Con qué vamos a publicar nuestra página en internet?", opts: ["Vercel", "Word", "Instagram"], ok: 0, why: "Vercel publica la página gratis con un link propio, como este sitio del taller." },
  { cat: "web", q: "¿Qué tecla abre las herramientas del navegador?", opts: ["F12", "F1", "Enter"], ok: 0, why: "F12. Ahí podés ver y probar el CSS en vivo." },

  // ---------- JavaScript (aparece cuando se habilita la Clase 7) ----------
  { cat: "js", q: "¿Para qué sirve JavaScript?", opts: ["Para que la página HAGA cosas (botones, juegos)", "Para los colores", "Para los títulos"], ok: 0, why: "HTML = qué hay, CSS = cómo se ve, JS = qué hace." },
  { cat: "js", q: "¿Cómo se llama el archivo de JavaScript que usamos?", opts: ["script.js", "style.css", "index.html"], ok: 0, why: "script.js, y se conecta con <script src=\"script.js\">." },
  { cat: "js", q: "¿Qué hace console.log(\"hola\")?", opts: ["Escribe hola en la consola (F12)", "Pone hola en la pantalla grande", "Nada"], ok: 0, why: "Sirve para ver qué está pasando adentro del código." },
  { cat: "js", q: "¿Qué evento usamos cuando tocan un botón?", opts: ["click", "hover", "color"], ok: 0, why: "addEventListener(\"click\", ...) = cuando hagan click, hacé esto." },
  { cat: "js", q: "¿Qué hace classList.toggle(\"oscuro\")?", opts: ["Prende y apaga la clase, como un interruptor", "Borra la página", "Cambia la letra"], ok: 0, why: "Ideal para modo oscuro o el corazón de me gusta." },
];

/** Las preguntas que se pueden jugar hoy (sin JS hasta la Clase 7). */
export const quiz: QuizQ[] = allQuiz.filter((q) => q.cat !== "js" || jsUnlocked);

// ---------- Cazá el bug ----------
export type Bug = {
  title: string;
  lang: "html" | "css" | "js";
  lines: string[];
  /** Índice (desde 0) de la línea con el error. */
  bad: number;
  why: string;
  fix: string;
};

const allBugs: Bug[] = [
  { title: "La imagen no aparece", lang: "html", lines: ["<h1>Mi perro</h1>", "<img scr=\"perro.jpg\" alt=\"Mi perro\">", "<p>Se llama Toby.</p>"], bad: 1, why: "Dice scr en vez de src.", fix: "<img src=\"perro.jpg\" alt=\"Mi perro\">" },
  { title: "El link no lleva a ningún lado", lang: "html", lines: ["<p>Mirá mi Spotify:</p>", "<a src=\"spotify/index.html\">Ver proyecto</a>", "<p>¡Gracias!</p>"], bad: 1, why: "Los links usan href, no src.", fix: "<a href=\"spotify/index.html\">Ver proyecto</a>" },
  { title: "Todo lo de abajo cambió", lang: "html", lines: ["<h1>Mi página</h1>", "<p>Hola, soy Ana.", "<h2>Mis proyectos</h2>", "<p>Spotify y Pinterest.</p>"], bad: 1, why: "El <p> no se cerró: falta </p>.", fix: "<p>Hola, soy Ana.</p>" },
  { title: "El título se ve raro", lang: "html", lines: ["<h1>Bienvenidos</h2>", "<p>Esta es mi página.</p>"], bad: 0, why: "Abre con <h1> pero cierra con </h2>. Tienen que coincidir.", fix: "<h1>Bienvenidos</h1>" },
  { title: "El CSS no se aplica", lang: "html", lines: ["<head>", "  <title>Mi página</title>", "  <link rel=\"stylesheet\" href=\"estilo.css\">", "</head>"], bad: 2, why: "El archivo se llama style.css pero el link dice estilo.css.", fix: "  <link rel=\"stylesheet\" href=\"style.css\">" },
  { title: "El título no se pinta", lang: "css", lines: ["h1 {", "  colour: violet;", "  font-size: 40px;", "}"], bad: 1, why: "En CSS es color, sin la u.", fix: "  color: violet;" },
  { title: "Las tarjetas no toman el estilo", lang: "css", lines: ["tarjeta {", "  padding: 20px;", "  border-radius: 12px;", "}"], bad: 0, why: "Falta el punto: para una clase es .tarjeta.", fix: ".tarjeta {" },
  { title: "Se rompe lo de abajo", lang: "css", lines: [".pin {", "  margin: 10px", "  border-radius: 16px;", "}"], bad: 1, why: "Falta el punto y coma al final de margin: 10px.", fix: "  margin: 10px;" },
  { title: "El hover no anda", lang: "css", lines: [".tarjeta:hober {", "  transform: scale(1.05);", "}"], bad: 0, why: "Es :hover, con v.", fix: ".tarjeta:hover {" },
  { title: "El fondo no cambia", lang: "css", lines: ["body {", "  background-color: azul;", "}"], bad: 1, why: "Los colores van en inglés: blue (o en código, como #2563eb).", fix: "  background-color: blue;" },
  { title: "El botón no hace nada", lang: "js", lines: ["const boton = document.querySelector(\"#like\");", "boton.addEventListener(\"clik\", () => {", "  boton.classList.toggle(\"activo\");", "});"], bad: 1, why: "El evento se llama \"click\", con c-k.", fix: "boton.addEventListener(\"click\", () => {" },
  { title: "No encuentra el elemento", lang: "js", lines: ["// en el HTML: <div class=\"marcador\">0</div>", "const marcador = document.querySelector(\"marcador\");", "marcador.textContent = \"10\";"], bad: 1, why: "Le falta el punto: querySelector(\".marcador\") igual que en CSS.", fix: "const marcador = document.querySelector(\".marcador\");" },
];

export const bugs: Bug[] = allBugs.filter((b) => b.lang !== "js" || jsUnlocked);

// ---------- Memotest ----------
export const memoPairs: { a: string; b: string }[] = [
  { a: "<h1>", b: "Título grande" },
  { a: "<a>", b: "Link" },
  { a: "<img>", b: "Imagen" },
  { a: "<p>", b: "Párrafo" },
  { a: "<ul>", b: "Lista" },
  { a: "<button>", b: "Botón" },
  { a: "color", b: "Color de la letra" },
  { a: "background", b: "Fondo" },
  { a: "font-size", b: "Tamaño de letra" },
  { a: "border-radius", b: "Esquinas redondas" },
  { a: ":hover", b: "Al pasar el mouse" },
  { a: "Ctrl + S", b: "Guardar" },
];

// ---------- Editor en vivo: ejemplos para arrancar ----------
export type EditorTemplate = { name: string; html: string; css: string; js: string };

export const editorTemplates: EditorTemplate[] = [
  {
    name: "👋 Presentación",
    html: `<h1>Hola, soy Ana</h1>
<p>Me gusta el fútbol, la música y programar.</p>
<img src="https://picsum.photos/seed/codeia/400/200" alt="Foto de ejemplo">
<p><a href="https://code-ia-taller.vercel.app" target="_blank">Mi taller</a></p>`,
    css: `body {
  font-family: sans-serif;
  background: #1e1b4b;
  color: white;
  padding: 20px;
}
h1 {
  color: #c084fc;
}
img {
  border-radius: 16px;
  max-width: 100%;
}
a {
  color: #fbbf24;
}`,
    js: ``,
  },
  {
    name: "🎧 Tarjeta Spotify",
    html: `<div class="tarjeta">
  <img src="https://picsum.photos/seed/musica/300/300" alt="Tapa">
  <h3>Mis favoritas</h3>
  <p>Playlist · 24 canciones</p>
  <button id="play">▶</button>
</div>`,
    css: `body {
  background: #121212;
  font-family: sans-serif;
  color: white;
  display: grid;
  place-items: center;
  min-height: 90vh;
}
.tarjeta {
  background: #181818;
  padding: 16px;
  border-radius: 10px;
  width: 200px;
  position: relative;
  transition: background 0.3s;
}
.tarjeta:hover {
  background: #282828;
}
.tarjeta img {
  width: 100%;
  border-radius: 6px;
}
p { color: #b3b3b3; font-size: 14px; }
#play {
  position: absolute;
  right: 22px;
  top: 170px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #1ed760;
  font-size: 18px;
  cursor: pointer;
}`,
    js: `const play = document.querySelector("#play");

play.addEventListener("click", () => {
  if (play.textContent === "▶") {
    play.textContent = "⏸";
  } else {
    play.textContent = "▶";
  }
});`,
  },
  {
    name: "📌 Pin con me gusta",
    html: `<div class="pin">
  <img src="https://picsum.photos/seed/pin/300/400" alt="Pin">
  <button class="corazon">🤍</button>
  <p>Me gusta: <span id="cuenta">0</span></p>
</div>`,
    css: `body {
  font-family: sans-serif;
  display: grid;
  place-items: center;
  min-height: 90vh;
  background: #fafafa;
}
.pin {
  width: 220px;
  position: relative;
}
.pin img {
  width: 100%;
  border-radius: 16px;
}
.corazon {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
}`,
    js: `const corazon = document.querySelector(".corazon");
const cuenta = document.querySelector("#cuenta");
let likes = 0;

corazon.addEventListener("click", () => {
  likes++;
  corazon.textContent = "❤️";
  cuenta.textContent = likes;
});`,
  },
  {
    name: "🌙 Modo oscuro",
    html: `<h1>Mi página</h1>
<p>Tocá el botón para cambiar el tema.</p>
<button id="tema">🌙 Modo oscuro</button>`,
    css: `body {
  font-family: sans-serif;
  padding: 30px;
  background: white;
  color: #111;
  transition: background 0.4s, color 0.4s;
}
body.oscuro {
  background: #0f0a1f;
  color: white;
}
button {
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
}`,
    js: `const boton = document.querySelector("#tema");

boton.addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
});`,
  },
  {
    name: "🎮 Piedra, papel o tijera",
    html: `<h1>Piedra, papel o tijera</h1>
<div class="botones">
  <button data-jugada="piedra">✊</button>
  <button data-jugada="papel">✋</button>
  <button data-jugada="tijera">✌️</button>
</div>
<p id="resultado">Elegí tu jugada</p>
<p>Vos <b id="yo">0</b> - <b id="compu">0</b> Compu</p>`,
    css: `body {
  font-family: sans-serif;
  text-align: center;
  background: #1e1b4b;
  color: white;
  padding: 20px;
}
.botones button {
  font-size: 40px;
  margin: 8px;
  padding: 10px 16px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
}
.botones button:hover {
  transform: scale(1.1);
}
#resultado {
  font-size: 22px;
  color: #fbbf24;
}`,
    js: `const opciones = ["piedra", "papel", "tijera"];
let yo = 0;
let compu = 0;

document.querySelectorAll("[data-jugada]").forEach((boton) => {
  boton.addEventListener("click", () => {
    const mia = boton.dataset.jugada;
    const suya = opciones[Math.floor(Math.random() * 3)];
    let texto;

    if (mia === suya) {
      texto = "Empate: los dos eligieron " + mia;
    } else if (
      (mia === "piedra" && suya === "tijera") ||
      (mia === "papel" && suya === "piedra") ||
      (mia === "tijera" && suya === "papel")
    ) {
      yo++;
      texto = "¡Ganaste! La compu eligió " + suya;
    } else {
      compu++;
      texto = "Perdiste: la compu eligió " + suya;
    }

    document.querySelector("#resultado").textContent = texto;
    document.querySelector("#yo").textContent = yo;
    document.querySelector("#compu").textContent = compu;
  });
});`,
  },
  {
    name: "⬜ En blanco",
    html: `<h1>Probá acá</h1>`,
    css: `body { font-family: sans-serif; }`,
    js: ``,
  },
];
