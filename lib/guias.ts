// Guías paso a paso (pestaña "Paso a paso" de /guia).

export type Paso = { t: string; code?: string; tip?: string };
export type Guia = { id: string; icon: string; title: string; when: string; intro: string; pasos: Paso[] };

export const guias: Guia[] = [
  {
    id: "proyecto",
    icon: "📁",
    title: "Arrancar un proyecto en VS Code",
    when: "Siempre que empieces algo nuevo",
    intro: "La receta para que el HTML, el CSS y el JS se encuentren entre sí.",
    pasos: [
      { t: "Creá una carpeta con el nombre del proyecto, sin espacios ni tildes (ej: mi-spotify)." },
      { t: "En VS Code: Archivo → Abrir carpeta… y elegila." },
      { t: "Creá tres archivos: index.html, style.css y script.js. Y una carpeta img/ para las fotos." },
      { t: "En index.html escribí ! y apretá Tab: aparece el esqueleto." },
      {
        t: "Conectá el CSS dentro del <head> y el JS al final del <body>:",
        code: `<head>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  ...\n  <script src="script.js"></script>\n</body>`,
      },
      { t: "Guardá con Ctrl+S y abrí index.html en el navegador. Cada vez que cambies algo: Ctrl+S y F5.", tip: "Con la extensión Live Server se refresca solo." },
    ],
  },
  {
    id: "prompts",
    icon: "💬",
    title: "Pedirle código a la IA (bien)",
    when: "Clases 3 en adelante",
    intro: "La IA responde tan bien como le preguntes. Esta es la fórmula.",
    pasos: [
      { t: "Decí QUÉ querés: \"una página tipo Pinterest\"." },
      { t: "Decí CÓMO se ve: colores, secciones, estilo (\"oscuro, con tarjetas redondeadas\")." },
      { t: "Decí en QUÉ archivos: \"HTML, CSS y JS separados\"." },
      { t: "Pedí que te EXPLIQUE: \"explicame cada parte como si tuviera 14 años\"." },
      {
        t: "Ejemplo completo:",
        code: `Haceme una página tipo Pinterest sobre autos.\nQue tenga buscador arriba y un mosaico de 4 columnas.\nEstilo oscuro con tarjetas redondeadas.\nHTML y CSS en archivos separados.\nExplicame qué hace cada parte.`,
      },
      { t: "Si algo no anda, no digas solo \"no funciona\": contá qué esperabas, qué pasa y pegá el código o el error de la consola." },
    ],
  },
  {
    id: "js",
    icon: "⚡",
    title: "Hacer que un botón haga algo",
    when: "Clase 7",
    intro: "Las 3 líneas que vas a usar el 90% de las veces en JavaScript.",
    pasos: [
      { t: "En el HTML, poné el botón con un id:", code: `<button id="like">🤍</button>` },
      { t: "En script.js, buscalo:", code: `const like = document.querySelector("#like");` },
      {
        t: "Escuchá el click y hacé algo:",
        code: `like.addEventListener("click", () => {\n  like.textContent = "❤️";\n});`,
      },
      {
        t: "Para prender y apagar algo (modo oscuro, me gusta), usá toggle con una clase del CSS:",
        code: `// script.js\ndocument.body.classList.toggle("oscuro");\n\n/* style.css */\nbody.oscuro { background: black; color: white; }`,
      },
      { t: "¿No anda? Abrí F12 → Console. Si hay un error en rojo, te dice el archivo y la línea.", tip: "Probalo en el editor en vivo de /jugar antes de pasarlo a tu proyecto." },
    ],
  },
  {
    id: "portfolio",
    icon: "💼",
    title: "Armar tu portfolio",
    when: "Clase 9",
    intro: "Una página que junta todos tus proyectos del taller.",
    pasos: [
      {
        t: "Ordená las carpetas así (todo adentro de portfolio/):",
        code: `portfolio/\n├── index.html      ← el portfolio\n├── style.css\n├── img/            ← capturas de cada proyecto\n├── presentacion/\n├── spotify/\n├── pinterest/\n└── juego/`,
      },
      { t: "Sacá una captura de cada proyecto con Windows + Shift + S y guardala en img/." },
      { t: "Secciones: inicio (tu nombre + una frase), sobre mí, proyectos y contacto." },
      {
        t: "Cada proyecto es una tarjeta con su captura y un link a su carpeta:",
        code: `<div class="proyecto">\n  <img src="img/spotify.png" alt="Mi Spotify">\n  <h3>Spotify</h3>\n  <p>Clon de Spotify con mis playlists.</p>\n  <a href="spotify/index.html">Ver proyecto</a>\n</div>`,
      },
      { t: "Probá TODOS los links. Si uno no abre, revisá el nombre de la carpeta y las mayúsculas." },
      { t: "Bonus: sumale un botón de modo oscuro (lo aprendiste en la Clase 7)." },
    ],
  },
  {
    id: "deploy-vercel",
    icon: "🚀",
    title: "Subir tu página a internet con Vercel",
    when: "Clase 10",
    intro: "Dos pasos: guardás tu proyecto en GitHub y Vercel lo publica con un link propio. Gratis.",
    pasos: [
      { t: "Checklist antes de subir: el archivo principal se llama index.html (minúscula), las imágenes están dentro de la carpeta y las rutas no empiezan con C:\\." },
      { t: "PASO 1 · GITHUB. Creá una cuenta en github.com (con un mail al que puedas entrar)." },
      { t: "Botón + (arriba a la derecha) → New repository. Nombre: portfolio. Dejalo en Public y tocá Create repository." },
      { t: "Tocá \"uploading an existing file\" y arrastrá TODO lo que hay ADENTRO de tu carpeta portfolio/ (no la carpeta en sí: index.html tiene que quedar a la vista).", tip: "Si arrastrás la carpeta entera, Vercel no encuentra el index.html." },
      { t: "Abajo, tocá Commit changes. Tu código ya está guardado en GitHub." },
      { t: "PASO 2 · VERCEL. Entrá a vercel.com → Sign Up → Continue with GitHub (usás la misma cuenta)." },
      { t: "Add New… → Project. En la lista aparece tu repositorio portfolio: tocá Import." },
      { t: "En Framework Preset dejá Other. No toques nada más y tocá Deploy." },
      { t: "Esperá unos segundos: aparece el festejo 🎉 y tu link, tipo portfolio-tunombre.vercel.app. ¡Ya está en internet!" },
      { t: "Abrí el link desde el celular para comprobar que anda." },
      { t: "¿Cambiaste algo? Subí los archivos nuevos a GitHub (Add file → Upload files → Commit) y Vercel actualiza la página solo en unos segundos.", tip: "Así se publica también este sitio del taller." },
    ],
  },
  {
    id: "errores",
    icon: "🩺",
    title: "Cuando algo no anda",
    when: "Siempre",
    intro: "Los 6 errores más comunes del taller y cómo encontrarlos.",
    pasos: [
      { t: "El CSS no se aplica → ¿el <link> dice el mismo nombre que el archivo? ¿guardaste los dos con Ctrl+S?" },
      { t: "La imagen no se ve → revisá la ruta y las mayúsculas: Foto.JPG no es igual a foto.jpg." },
      { t: "Una clase no toma estilo → en CSS lleva punto (.tarjeta), en el HTML no (class=\"tarjeta\")." },
      { t: "Todo lo de abajo se rompió → falta cerrar una etiqueta (</div>, </p>) o una llave } en el CSS." },
      { t: "El botón no hace nada → F12 → Console. ¿Hay error en rojo? ¿El script.js está linkeado?" },
      { t: "Copiá el error de la consola y pasáselo a la IA junto con tu código. Es el mejor prompt para arreglar algo.", tip: "Practicá en /jugar → Cazá el bug." },
    ],
  },
];
