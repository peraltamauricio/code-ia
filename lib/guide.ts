export type GuideEntry = {
  cat: "html" | "css" | "js";
  name: string;
  desc: string;
  code: string;
};

export const guide: GuideEntry[] = [
  // ---------------- HTML ----------------
  { cat: "html", name: "Estructura base", desc: "El esqueleto mínimo de toda página.", code: `<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8">\n  <title>Mi página</title>\n</head>\n<body>\n\n</body>\n</html>` },
  { cat: "html", name: "Títulos", desc: "De más importante (h1) a menos (h6).", code: `<h1>Título principal</h1>\n<h2>Subtítulo</h2>` },
  { cat: "html", name: "Párrafo", desc: "Bloque de texto normal.", code: `<p>Este es un párrafo.</p>` },
  { cat: "html", name: "Link", desc: "Enlace a otra página o sitio.", code: `<a href="https://ejemplo.com">Ir al sitio</a>` },
  { cat: "html", name: "Imagen", desc: "Siempre con alt, describe la imagen.", code: `<img src="foto.jpg" alt="Descripción de la foto">` },
  { cat: "html", name: "Lista", desc: "Con viñetas (ul) o numerada (ol).", code: `<ul>\n  <li>Uno</li>\n  <li>Dos</li>\n</ul>` },
  { cat: "html", name: "div y span", desc: "div = bloque, span = en línea. Sin estilo propio.", code: `<div>Bloque</div>\n<span>En línea</span>` },
  { cat: "html", name: "Botón", desc: "Elemento clicable, usalo para acciones.", code: `<button>Hacer click</button>` },
  { cat: "html", name: "Formulario", desc: "Junta datos del usuario.", code: `<form>\n  <input type="text" placeholder="Tu nombre">\n  <button type="submit">Enviar</button>\n</form>` },
  { cat: "html", name: "Input", desc: "Campo de texto, con type según lo que pida.", code: `<input type="email" placeholder="tu@email.com">` },
  { cat: "html", name: "Secciones semánticas", desc: "Le dan significado a cada parte de la página.", code: `<header>...</header>\n<nav>...</nav>\n<main>...</main>\n<footer>...</footer>` },
  { cat: "html", name: "Comentario", desc: "No se ve en la página, solo en el código.", code: `<!-- esto es un comentario -->` },
  { cat: "html", name: "Tabla", desc: "Filas y columnas de datos.", code: `<table>\n  <tr><th>Nombre</th><th>Edad</th></tr>\n  <tr><td>Ana</td><td>15</td></tr>\n</table>` },
  { cat: "html", name: "Video / Audio", desc: "Multimedia con controles nativos.", code: `<video src="video.mp4" controls></video>` },
  { cat: "html", name: "Atributo class / id", desc: "class para estilos repetidos, id para uno solo.", code: `<div class="card" id="principal">...</div>` },

  // ---------------- CSS ----------------
  { cat: "css", name: "Vincular CSS", desc: "Conectar el archivo de estilos al HTML.", code: `<link rel="stylesheet" href="style.css">` },
  { cat: "css", name: "Selector de clase", desc: "Aplica el estilo a todo lo que tenga esa class.", code: `.card {\n  padding: 16px;\n}` },
  { cat: "css", name: "Selector de id", desc: "Aplica el estilo a un solo elemento.", code: `#principal {\n  color: red;\n}` },
  { cat: "css", name: "Color y fondo", desc: "Color de texto y de fondo.", code: `p {\n  color: #333;\n  background-color: #f5f5f5;\n}` },
  { cat: "css", name: "Tipografía", desc: "Tamaño, familia y peso de la letra.", code: `h1 {\n  font-size: 32px;\n  font-family: sans-serif;\n  font-weight: bold;\n}` },
  { cat: "css", name: "Margin y padding", desc: "Margin = afuera del elemento. Padding = adentro.", code: `.card {\n  margin: 16px;\n  padding: 12px 20px;\n}` },
  { cat: "css", name: "Border y radius", desc: "Borde y esquinas redondeadas.", code: `.card {\n  border: 1px solid #ccc;\n  border-radius: 12px;\n}` },
  { cat: "css", name: "Flexbox", desc: "El más usado para acomodar elementos en fila o columna.", code: `.contenedor {\n  display: flex;\n  gap: 16px;\n  justify-content: center;\n  align-items: center;\n}` },
  { cat: "css", name: "Grid", desc: "Para layouts en cuadrícula.", code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}` },
  { cat: "css", name: "Width y height", desc: "Ancho y alto de un elemento.", code: `.caja {\n  width: 200px;\n  height: 100px;\n}` },
  { cat: "css", name: "Position", desc: "Cómo se ubica un elemento en la página.", code: `.flotante {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}` },
  { cat: "css", name: "Hover", desc: "Estilo que aparece al pasar el mouse.", code: `.boton:hover {\n  background-color: violet;\n}` },
  { cat: "css", name: "Sombra", desc: "Sombra de caja, da profundidad.", code: `.card {\n  box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n}` },
  { cat: "css", name: "Transición", desc: "Anima un cambio de estilo en vez de que sea instantáneo.", code: `.boton {\n  transition: transform 0.2s ease;\n}\n.boton:hover {\n  transform: scale(1.05);\n}` },
  { cat: "css", name: "Responsive (media query)", desc: "Estilos distintos según el ancho de pantalla.", code: `@media (max-width: 600px) {\n  .card { flex-direction: column; }\n}` },

  // ---------------- JAVASCRIPT ----------------
  { cat: "js", name: "Variables", desc: "let cambia de valor, const no.", code: `let contador = 0;\nconst nombre = "Ana";` },
  { cat: "js", name: "Función", desc: "Bloque de código reutilizable.", code: `function saludar(nombre) {\n  return "Hola " + nombre;\n}` },
  { cat: "js", name: "Función flecha", desc: "Forma corta de escribir funciones.", code: `const saludar = (nombre) => {\n  return "Hola " + nombre;\n};` },
  { cat: "js", name: "Condicional", desc: "Ejecuta código según se cumpla o no algo.", code: `if (edad >= 18) {\n  console.log("Mayor de edad");\n} else {\n  console.log("Menor de edad");\n}` },
  { cat: "js", name: "Bucle for", desc: "Repite código un número de veces.", code: `for (let i = 0; i < 5; i++) {\n  console.log(i);\n}` },
  { cat: "js", name: "Seleccionar un elemento", desc: "Busca un elemento del HTML para manipularlo.", code: `const boton = document.querySelector(".boton");` },
  { cat: "js", name: "Escuchar un click", desc: "Ejecuta código cuando pasa algo (click, etc.).", code: `boton.addEventListener("click", () => {\n  console.log("¡Clickeado!");\n});` },
  { cat: "js", name: "Cambiar texto/HTML", desc: "Modifica el contenido de un elemento.", code: `elemento.textContent = "Nuevo texto";\nelemento.innerHTML = "<b>Texto en negrita</b>";` },
  { cat: "js", name: "Cambiar una clase", desc: "Agrega, saca o alterna una clase CSS.", code: `elemento.classList.add("activo");\nelemento.classList.toggle("oculto");` },
  { cat: "js", name: "Arreglo (array)", desc: "Lista ordenada de valores.", code: `const frutas = ["manzana", "banana", "pera"];\nfrutas.push("uva");` },
  { cat: "js", name: "Recorrer un arreglo", desc: "Ejecuta código por cada elemento de la lista.", code: `frutas.forEach((fruta) => {\n  console.log(fruta);\n});` },
  { cat: "js", name: "Objeto", desc: "Agrupa datos relacionados con nombre y valor.", code: `const persona = {\n  nombre: "Ana",\n  edad: 15,\n};` },
  { cat: "js", name: "Template string", desc: "Texto con variables insertadas, entre backticks.", code: 'const mensaje = `Hola ${nombre}, tenés ${edad} años`;' },
  { cat: "js", name: "Ver en consola", desc: "Imprime un valor para revisar qué está pasando.", code: `console.log("valor:", variable);` },
  { cat: "js", name: "Pedirle ayuda a la IA", desc: "El prompt que más vas a usar en este taller.", code: `// pegá tu código y preguntá:\n// "¿por qué este botón no funciona?"` },
];

export const CATS: { key: GuideEntry["cat"]; label: string; icon: string }[] = [
  { key: "html", label: "HTML", icon: "</>" },
  { key: "css", label: "CSS", icon: "{ }" },
  { key: "js", label: "JavaScript", icon: "⚡" },
];
