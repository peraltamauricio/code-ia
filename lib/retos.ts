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
    id: "botones",
    icon: "🕹️",
    title: "Que los botones hagan algo",
    langs: ["JS", "CSS"],
    nivel: 2,
    minutos: "25-35 min",
    intro:
      "Hay cinco botones en el HTML que todavía no hacen nada. Con JavaScript dales vida: una alerta, cambiar texto y color, modo oscuro y un contador. Receta: BUSCAR → ESCUCHAR → HACER.",
    tab: "js",
    interactive: true,
    start: {
      html: `<h2>Reto JavaScript</h2>
<p id="mensaje">Hola, soy un mensaje.</p>

<button id="saludo">👋 Saludar</button>
<button id="cambiar-texto">✏️ Cambiar texto</button>
<button id="cambiar-color">🎨 Cambiar color</button>
<button id="fondo">🌙 Fondo oscuro</button>

<hr>
<p>Contador: <b id="contador">0</b></p>
<button id="sumar">+1</button>
<p id="aviso"></p>`,
      css: `body { font-family: sans-serif; padding: 20px; }
button { padding: 10px 14px; margin: 4px; cursor: pointer; }
`,
      js: `// RETO 4 · Que los botones hagan algo
// Receta: BUSCAR el botón → ESCUCHAR el click → HACER algo.
// Ejemplo de cómo se escribe:
//   const boton = document.querySelector("#id");
//   boton.addEventListener("click", () => { ... });

`,
    },
    misiones: [
      { t: "«Saludar» muestra una alerta con alert(...) al hacer click", test: raw`/alert *\(/.test(__js()) && /addEventListener *\( *["']click["']/.test(__js())`, hint: "saludo.addEventListener(\"click\", () => { alert(\"¡Hola!\"); });" },
      { t: "«Cambiar texto» cambia el texto del párrafo #mensaje (textContent)", test: raw`(function(){var m=document.querySelector('#mensaje');var a=m.textContent;document.querySelector('#cambiar-texto').click();return m.textContent!==a})()`, hint: "mensaje.textContent = \"¡Cambié el texto!\";" },
      { t: "«Cambiar color» cambia el color del mensaje (style.color)", test: raw`(function(){var m=document.querySelector('#mensaje');var a=m.getAttribute('style')+'|'+m.className;document.querySelector('#cambiar-color').click();return a!==m.getAttribute('style')+'|'+m.className})()`, hint: "mensaje.style.color = \"orchid\";" },
      { t: "«Fondo oscuro» prende y apaga la clase oscuro del body (classList.toggle)", test: raw`(function(){var b=document.querySelector('#fondo');b.click();var a=document.body.classList.contains('oscuro');b.click();var c=document.body.classList.contains('oscuro');return a&&!c})()`, hint: "document.body.classList.toggle(\"oscuro\");" },
      { t: "En el CSS, la clase .oscuro cambia el fondo (background)", test: raw`__rule('.oscuro', /background/)`, hint: "body.oscuro { background-color: #111; color: white; }  (andá a la pestaña style.css)" },
      { t: "Guardás la cuenta en una variable con let", test: raw`/(^|[^a-z])let +[a-z_]/i.test(__js())`, hint: "let cuenta = 0;" },
      { t: "Cada click en «+1» suma 1 al número de #contador", test: raw`(function(){var b=document.querySelector('#sumar'),n=document.querySelector('#contador');var a=parseInt(n.textContent);b.click();b.click();return parseInt(n.textContent)===a+2})()`, hint: "cuenta++;  y después  contador.textContent = cuenta;" },
      { t: "Con un if: al llegar a 5 o más, se escribe un mensaje en #aviso", test: raw`(function(){var b=document.querySelector('#sumar'),m=document.querySelector('#aviso');for(var i=0;i<6;i++)b.click();return /(^|[^a-z])if *\(/.test(__js())&&m.textContent.trim().length>0})()`, hint: "if (cuenta >= 5) { aviso.textContent = \"¡Llegaste a 5!\"; }" },
    ],
    solution: {
      html: `<h2>Reto JavaScript</h2>
<p id="mensaje">Hola, soy un mensaje.</p>

<button id="saludo">👋 Saludar</button>
<button id="cambiar-texto">✏️ Cambiar texto</button>
<button id="cambiar-color">🎨 Cambiar color</button>
<button id="fondo">🌙 Fondo oscuro</button>

<hr>
<p>Contador: <b id="contador">0</b></p>
<button id="sumar">+1</button>
<p id="aviso"></p>`,
      css: `body { font-family: sans-serif; padding: 20px; }
button { padding: 10px 14px; margin: 4px; cursor: pointer; }
body.oscuro { background-color: #111; color: white; }
`,
      js: `// 1. Alerta
const saludo = document.querySelector("#saludo");
saludo.addEventListener("click", () => {
  alert("¡Hola! 👋");
});

// 2. Cambiar el texto
const mensaje = document.querySelector("#mensaje");
document.querySelector("#cambiar-texto").addEventListener("click", () => {
  mensaje.textContent = "¡Cambié el texto con JavaScript!";
});

// 3. Cambiar el color
document.querySelector("#cambiar-color").addEventListener("click", () => {
  mensaje.style.color = "orchid";
});

// 4. Fondo oscuro (interruptor)
document.querySelector("#fondo").addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
});

// 5. Contador
let cuenta = 0;
const contador = document.querySelector("#contador");
const aviso = document.querySelector("#aviso");
document.querySelector("#sumar").addEventListener("click", () => {
  cuenta++;
  contador.textContent = cuenta;
  if (cuenta >= 5) {
    aviso.textContent = "¡Llegaste a 5!";
  }
});`,
    },
  },

  // ------------------------------------------------------------------
  {
    id: "corazones",
    icon: "❤️",
    title: "Pinterest con corazones",
    langs: ["JS"],
    nivel: 2,
    minutos: "30-40 min",
    intro:
      "Lo mismo que hiciste en tu Pinterest de la clase: cada pin tiene un corazón 🤍 que se pone rojo ❤️, hay un contador de me gusta y un modo oscuro. Pero esta vez con misiones paso a paso.",
    tab: "js",
    interactive: true,
    start: {
      html: `<button id="oscuro">🌙 Modo oscuro</button>
<p>❤️ Me gusta: <span id="total">0</span></p>

<div class="fila">
  <div class="pin"><img src="https://picsum.photos/seed/c1/200/250" alt="Pin 1"><button class="corazon">🤍</button></div>
  <div class="pin"><img src="https://picsum.photos/seed/c2/200/250" alt="Pin 2"><button class="corazon">🤍</button></div>
  <div class="pin"><img src="https://picsum.photos/seed/c3/200/250" alt="Pin 3"><button class="corazon">🤍</button></div>
  <div class="pin"><img src="https://picsum.photos/seed/c4/200/250" alt="Pin 4"><button class="corazon">🤍</button></div>
</div>`,
      css: `body { font-family: sans-serif; padding: 16px; }
.fila { display: flex; gap: 10px; flex-wrap: wrap; }
.pin { position: relative; width: 140px; }
.pin img { width: 100%; border-radius: 14px; display: block; }
.corazon {
  position: absolute; top: 8px; right: 8px;
  width: 36px; height: 36px;
  border: none; border-radius: 50%;
  background: white; font-size: 16px; cursor: pointer;
}
`,
      js: `// RETO 5 · Pinterest con corazones
// Hay 4 corazones con class="corazon". Recordá: BUSCAR → ESCUCHAR → HACER.
// Para buscar VARIOS elementos usá querySelectorAll y recorrelos con forEach.

`,
    },
    misiones: [
      { t: "Buscás todos los corazones con querySelectorAll y escuchás el click con addEventListener", test: raw`/querySelectorAll *\(/.test(__js()) && /addEventListener *\(/.test(__js())`, hint: "const corazones = document.querySelectorAll(\".corazon\");" },
      { t: "Al tocar un corazón pasa de 🤍 a ❤️", test: raw`(function(){var c=document.querySelectorAll('.corazon')[0];var a=c.textContent;c.click();var b=c.textContent;c.click();return a.indexOf('❤')<0&&b.indexOf('❤')>=0})()`, hint: "corazones.forEach((corazon) => { corazon.addEventListener(\"click\", () => { ... }); });" },
      { t: "Al tocarlo de nuevo vuelve a 🤍 (con if / else)", test: raw`(function(){var c=document.querySelectorAll('.corazon')[1];var a=c.textContent;c.click();var b=c.textContent;c.click();return b!==a&&c.textContent===a})()`, hint: "if (corazon.textContent === \"🤍\") { ... } else { ... }" },
      { t: "Funciona en TODOS los corazones, no solo en el primero", test: raw`(function(){var cs=document.querySelectorAll('.corazon');if(cs.length<4)return false;for(var i=0;i<cs.length;i++){var a=cs[i].textContent;cs[i].click();if(cs[i].textContent===a)return false;cs[i].click();}return true})()`, hint: "Si usás forEach sobre todos los corazones, ya funciona en todos." },
      { t: "El contador #total suma 1 por cada me gusta", test: raw`(function(){var t=document.querySelector('#total');var cs=document.querySelectorAll('.corazon');var a=parseInt(t.textContent);cs[0].click();cs[1].click();var b=parseInt(t.textContent);cs[0].click();cs[1].click();return b===a+2})()`, hint: "let meGusta = 0;  y al dar me gusta:  meGusta++;  total.textContent = meGusta;" },
      { t: "Y resta 1 cuando sacás el me gusta (el total vuelve a bajar)", test: raw`(function(){var t=document.querySelector('#total');var c=document.querySelectorAll('.corazon')[2];var a=parseInt(t.textContent);c.click();var b=parseInt(t.textContent);c.click();var d=parseInt(t.textContent);return b===a+1&&d===a})()`, hint: "En el else: meGusta--; y volvés a escribir total.textContent = meGusta;" },
      { t: "El botón #oscuro prende y apaga la clase oscuro del body (toggle)", test: raw`(function(){var b=document.querySelector('#oscuro');b.click();var a=document.body.classList.contains('oscuro');b.click();var c=document.body.classList.contains('oscuro');return a&&!c})()`, hint: "document.body.classList.toggle(\"oscuro\");" },
      { t: "En el CSS: la clase .oscuro cambia el fondo y el corazón tiene efecto :hover", test: raw`__rule('.oscuro', /background/) && __rule('.corazon:hover', /./)`, hint: "body.oscuro { background-color: #111; color: white; }  y  .corazon:hover { transform: scale(1.15); }" },
    ],
    solution: {
      html: `<button id="oscuro">🌙 Modo oscuro</button>
<p>❤️ Me gusta: <span id="total">0</span></p>

<div class="fila">
  <div class="pin"><img src="https://picsum.photos/seed/c1/200/250" alt="Pin 1"><button class="corazon">🤍</button></div>
  <div class="pin"><img src="https://picsum.photos/seed/c2/200/250" alt="Pin 2"><button class="corazon">🤍</button></div>
  <div class="pin"><img src="https://picsum.photos/seed/c3/200/250" alt="Pin 3"><button class="corazon">🤍</button></div>
  <div class="pin"><img src="https://picsum.photos/seed/c4/200/250" alt="Pin 4"><button class="corazon">🤍</button></div>
</div>`,
      css: `body { font-family: sans-serif; padding: 16px; }
.fila { display: flex; gap: 10px; flex-wrap: wrap; }
.pin { position: relative; width: 140px; }
.pin img { width: 100%; border-radius: 14px; display: block; }
.corazon {
  position: absolute; top: 8px; right: 8px;
  width: 36px; height: 36px;
  border: none; border-radius: 50%;
  background: white; font-size: 16px; cursor: pointer;
}
.corazon:hover { transform: scale(1.15); }
body.oscuro { background-color: #111; color: white; }
`,
      js: `const corazones = document.querySelectorAll(".corazon");
const total = document.querySelector("#total");
let meGusta = 0;

corazones.forEach((corazon) => {
  corazon.addEventListener("click", () => {
    if (corazon.textContent === "🤍") {
      corazon.textContent = "❤️";
      meGusta++;
    } else {
      corazon.textContent = "🤍";
      meGusta--;
    }
    total.textContent = meGusta;
  });
});

document.querySelector("#oscuro").addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
});`,
    },
  },

  // ------------------------------------------------------------------
  {
    id: "adivina",
    icon: "🎯",
    title: "Adiviná el número",
    langs: ["JS"],
    nivel: 3,
    minutos: "40-50 min",
    intro:
      "Armá un juego completo: la compu piensa un número del 1 al 10 y vos tenés que adivinarlo, con pistas, contador de intentos y botón de reiniciar. Es el reto más difícil de JavaScript: usá la IA para pedir pistas, no soluciones.",
    tab: "js",
    interactive: true,
    start: {
      html: `<h1>🎯 Adiviná el número</h1>
<p>Pensé un número del 1 al 10.</p>

<input id="numero" type="number" min="1" max="10" placeholder="Tu número">
<button id="adivinar">Adivinar</button>
<button id="reiniciar">Jugar de nuevo</button>

<p id="resultado"></p>
<p>Intentos: <b id="intentos">0</b></p>`,
      css: `body { font-family: sans-serif; padding: 20px; text-align: center; }
input, button { padding: 10px 14px; font-size: 16px; }
#resultado { font-size: 22px; min-height: 30px; }
`,
      js: `// RETO 6 · Adiviná el número
// Ideas que vas a necesitar: Math.random(), Math.floor(), let, if / else if / else.
// Un número al azar del 1 al 10:  Math.floor(Math.random() * 10) + 1
// El valor de un input se lee con  input.value  (y es texto: usá Number(...)).

`,
    },
    misiones: [
      { t: "Pensás un número secreto al azar con Math.random() y Math.floor()", test: raw`/Math\.random *\(/.test(__js()) && /Math\.floor/.test(__js())`, hint: "let secreto = Math.floor(Math.random() * 10) + 1;" },
      { t: "Al tocar «Adivinar» se escribe un mensaje en #resultado", test: raw`(function(){var i=document.querySelector('#numero'),b=document.querySelector('#adivinar'),m=document.querySelector('#resultado');i.value=5;b.click();return m.textContent.trim().length>0})()`, hint: "Buscá el botón, escuchá el click y escribí en resultado.textContent." },
      { t: "Entre 0 y 10 hay exactamente UN número que dice «Ganaste»", test: raw`(function(){var i=document.querySelector('#numero'),b=document.querySelector('#adivinar'),m=document.querySelector('#resultado');var w=0;for(var k=0;k<=10;k++){i.value=k;b.click();if(/ganaste/i.test(m.textContent))w++}return w===1})()`, hint: "if (numero === secreto) { resultado.textContent = \"¡Ganaste! 🎉\"; }  (usá Number(input.value))" },
      { t: "Los demás números dicen «mayor» o «menor» como pista", test: raw`(function(){var i=document.querySelector('#numero'),b=document.querySelector('#adivinar'),m=document.querySelector('#resultado');var h=0;for(var k=0;k<=10;k++){i.value=k;b.click();var t=m.textContent;if(!/ganaste/i.test(t)&&/mayor|menor/i.test(t))h++}return h===10})()`, hint: "Si el número que pusiste es menor que el secreto: «El número es mayor». Si es mayor: «El número es menor»." },
      { t: "Usás else if para distinguir los tres casos (igual, menor, mayor)", test: raw`/else *if/.test(__js())`, hint: "if (...) { } else if (numero < secreto) { } else { }" },
      { t: "Contás los intentos en #intentos (sube 1 en cada click)", test: raw`(function(){var b=document.querySelector('#adivinar'),i=document.querySelector('#numero'),n=document.querySelector('#intentos');var a=parseInt(n.textContent);i.value=3;b.click();b.click();return parseInt(n.textContent)===a+2})()`, hint: "let intentos = 0;  intentos++;  marcador.textContent = intentos;" },
      { t: "Si el input está vacío avisa «Escribí un número» y no cuenta el intento", test: raw`(function(){var i=document.querySelector('#numero'),b=document.querySelector('#adivinar'),m=document.querySelector('#resultado'),n=document.querySelector('#intentos');i.value='';var a=n.textContent;b.click();return /escrib/i.test(m.textContent)&&n.textContent===a})()`, hint: "if (input.value === \"\") { resultado.textContent = \"Escribí un número\"; return; }" },
      { t: "«Jugar de nuevo» vuelve los intentos a 0, vacía el mensaje y piensa otro número", test: raw`(function(){var r=document.querySelector('#reiniciar'),n=document.querySelector('#intentos'),m=document.querySelector('#resultado'),i=document.querySelector('#numero'),b=document.querySelector('#adivinar');i.value=4;b.click();var mid=m.textContent.trim().length>0&&parseInt(n.textContent)>0;r.click();return mid&&parseInt(n.textContent)===0&&m.textContent.trim()===''})()`, hint: "En el click de reiniciar: secreto = ...; intentos = 0; marcador.textContent = 0; resultado.textContent = \"\";" },
    ],
    solution: {
      html: `<h1>🎯 Adiviná el número</h1>
<p>Pensé un número del 1 al 10.</p>

<input id="numero" type="number" min="1" max="10" placeholder="Tu número">
<button id="adivinar">Adivinar</button>
<button id="reiniciar">Jugar de nuevo</button>

<p id="resultado"></p>
<p>Intentos: <b id="intentos">0</b></p>`,
      css: `body { font-family: sans-serif; padding: 20px; text-align: center; }
input, button { padding: 10px 14px; font-size: 16px; }
#resultado { font-size: 22px; min-height: 30px; }
`,
      js: `let secreto = Math.floor(Math.random() * 10) + 1;
let intentos = 0;

const input = document.querySelector("#numero");
const resultado = document.querySelector("#resultado");
const marcador = document.querySelector("#intentos");

document.querySelector("#adivinar").addEventListener("click", () => {
  if (input.value === "") {
    resultado.textContent = "Escribí un número";
    return;
  }

  const numero = Number(input.value);
  intentos++;
  marcador.textContent = intentos;

  if (numero === secreto) {
    resultado.textContent = "¡Ganaste! 🎉";
  } else if (numero < secreto) {
    resultado.textContent = "El número es mayor";
  } else {
    resultado.textContent = "El número es menor";
  }
});

document.querySelector("#reiniciar").addEventListener("click", () => {
  secreto = Math.floor(Math.random() * 10) + 1;
  intentos = 0;
  marcador.textContent = 0;
  resultado.textContent = "";
  input.value = "";
});`,
    },
  },

  // ------------------------------------------------------------------
  {
    id: "mini-portfolio",
    icon: "💼",
    title: "Mini portfolio",
    langs: ["HTML", "CSS", "JS"],
    nivel: 3,
    minutos: "50-60 min",
    intro:
      "El reto más largo: armá un mini portfolio con HTML, CSS y JavaScript juntos. Es un ensayo para el portfolio de verdad (que armás en /portfolio). Seguí las misiones de arriba hacia abajo.",
    tab: "html",
    interactive: true,
    start: {
      html: `<!-- RETO 7 · Mini portfolio
     Armá tu portfolio completo. Las misiones te van diciendo qué sumar.
     Idea de estructura: header (con nav) → sección sobre mí → sección proyectos → footer. -->

`,
      css: `body { font-family: sans-serif; margin: 0; }
`,
      js: `// Acá va tu JavaScript (modo oscuro y saludo según la hora).

`,
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
      { t: "Un botón #tema que prende y apaga la clase oscuro del body", test: raw`(function(){var b=document.querySelector('#tema');b.click();var a=document.body.classList.contains('oscuro');b.click();var c=document.body.classList.contains('oscuro');return a&&!c})()`, hint: "<button id=\"tema\">🌙</button> y en JS: document.body.classList.toggle(\"oscuro\");" },
      { t: "En el CSS, la clase .oscuro cambia el fondo", test: raw`__rule('.oscuro', /background/)`, hint: "body.oscuro { background-color: #111; color: white; }" },
      { t: "Se adapta al celular con una regla @media", test: raw`__rule('@media', /./)`, hint: "@media (max-width: 600px) { .grilla { flex-direction: column; } }" },
      { t: "Un saludo #saludo según la hora (getHours) que diga «Buenos días», «Buenas tardes» o «Buenas noches»", test: raw`/getHours *\(/.test(__js()) && /buen/i.test(document.querySelector('#saludo').textContent)`, hint: "const hora = new Date().getHours();  if (hora < 12) { saludo.textContent = \"Buenos días\"; } else if ... " },
    ],
    solution: {
      html: `<header>
  <h1>Ana García</h1>
  <p id="saludo"></p>
  <nav>
    <a href="#sobre-mi">Sobre mí</a>
    <a href="#proyectos">Proyectos</a>
    <a href="#contacto">Contacto</a>
    <button id="tema">🌙</button>
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
body.oscuro { background-color: #111; color: white; }
@media (max-width: 600px) {
  .grilla { flex-direction: column; }
}`,
      js: `const hora = new Date().getHours();
const saludo = document.querySelector("#saludo");

if (hora < 12) {
  saludo.textContent = "Buenos días ☀️";
} else if (hora < 20) {
  saludo.textContent = "Buenas tardes 🌤️";
} else {
  saludo.textContent = "Buenas noches 🌙";
}

document.querySelector("#tema").addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
});`,
    },
  },
];
