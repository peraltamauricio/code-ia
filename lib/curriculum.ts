export type AiTool = "Claude" | "ChatGPT" | "Gemini" | "Las 3 IAs";

export type ClassSession = {
  n: number;
  title: string;
  objetivo: string;
  teoria: string[];
  practica: string[];
  entregable: string;
  desafio?: string;
  promptDemo: string;
  aiReply: string;
  tool: AiTool;
  toolNote?: string;
  vscode: string[];
  /** Qué construimos en la clase (aparece en el camino al portfolio). */
  proyecto?: string;
  /** Qué conviene traer o repasar antes de venir (se muestra en "Próxima clase"). */
  preparate?: string[];
};

// Para habilitar una clase, agregá su número acá.
// La primera clase que NO está en la lista se muestra sola como "Próxima clase".
export const UNLOCKED_CLASSES = [1, 2, 3, 4, 5, 6];

export const isUnlocked = (n: number) => UNLOCKED_CLASSES.includes(n);

export const curriculum: ClassSession[] = [
  {
    n: 1,
    title: "Bienvenida + mi primera página HTML",
    objetivo:
      "Perderle el miedo a la tecnología y crear la primera página web propia: una presentación sobre un tema que nos guste.",
    teoria: [
      "¿Qué es programar? Darle instrucciones claras a una máquina. Con IA, esas instrucciones pueden empezar en lenguaje natural.",
      "¿Qué es una página web? Un archivo de texto que el navegador sabe leer: el HTML.",
      "Las etiquetas básicas: <h1> para títulos, <p> para párrafos, <a> para links, <img> para imágenes.",
      "Mitos a derribar: \"hay que ser bueno en matemática\", \"hay que memorizar código\".",
    ],
    practica: [
      "Instalar Visual Studio Code y crear la carpeta del taller.",
      "Armar una presentación random sobre un tema propio (un juego, una banda, un deporte, una mascota).",
      "Agregar un título, dos párrafos, una imagen y un link.",
    ],
    entregable: "Presentación en HTML (index.html) que se abre en el navegador.",
    promptDemo: "explicame qué hace cada etiqueta de este HTML como si tuviera 14 años",
    aiReply: "<h1> es el título grande, <p> un párrafo, <img> muestra una foto y <a> te lleva a otra página.",
    tool: "ChatGPT",
    toolNote: "ChatGPT es nuestra IA de cabecera para pedir y explicar código.",
    proyecto: "Presentación",
    vscode: [
      "Instalar Visual Studio Code y abrir la carpeta del taller (Archivo → Abrir carpeta).",
      "Crear un archivo index.html, escribir ! y apretar Tab para tener el esqueleto.",
      "Guardar con Ctrl+S y abrirlo con doble clic en el navegador.",
    ],
  },
  {
    n: 2,
    title: "CSS básico: darle estilo a la presentación",
    objetivo: "Entender que el HTML es el esqueleto y el CSS la ropa. Ponerle colores, letras y espacios a la presentación.",
    teoria: [
      "Qué es CSS y cómo se conecta con el HTML: <link rel=\"stylesheet\" href=\"style.css\">.",
      "Selectores: por etiqueta (h1), por clase (.tarjeta) y por id (#principal).",
      "Propiedades básicas: color, background-color, font-size, font-family, margin, padding, border-radius.",
      "Colores en CSS: por nombre (red), en hexadecimal (#a855f7) y cómo elegir una paleta.",
    ],
    practica: [
      "Crear style.css y linkearlo a la presentación de la Clase 1.",
      "Cambiar el fondo, la tipografía y el color de los títulos.",
      "Pedirle a la IA que proponga una paleta de colores y aplicarla a mano.",
    ],
    entregable: "La presentación con estilo propio (HTML + CSS).",
    desafio: "Cambiar 5 propiedades CSS distintas sin ayuda de la IA y explicar qué hace cada una.",
    promptDemo: "dame una paleta de 4 colores para una página sobre fútbol, con el código hex",
    aiReply: "Verde césped #16a34a, blanco #ffffff, negro #0f172a y dorado #fbbf24. Te muestro dónde va cada uno.",
    tool: "ChatGPT",
    proyecto: "Presentación con estilo",
    vscode: [
      "Crear un archivo style.css junto al index.html.",
      "Linkearlo dentro del <head> con <link rel=\"stylesheet\" href=\"style.css\">.",
      "Guardar los dos archivos y refrescar el navegador (F5) para ver los cambios.",
    ],
  },
  {
    n: 3,
    title: "Proyecto Spotify (parte 1): la IA arma, nosotros entendemos",
    objetivo:
      "Pedirle a ChatGPT una página tipo Spotify en HTML y CSS, y aprender a leer el código que nos da en vez de copiarlo a ciegas.",
    teoria: [
      "Cómo escribir un buen prompt: qué quiero, cómo se tiene que ver, en qué archivos.",
      "Leer una página grande por partes: barra lateral, encabezado, grilla de playlists, reproductor.",
      "<div> y class: las cajas con nombre que usa la IA para ordenar todo.",
    ],
    practica: [
      "Pedirle a ChatGPT el HTML y el CSS de una página inspirada en Spotify.",
      "Separar el código en index.html y style.css y hacerlo andar.",
      "Encontrar en el código dónde está cada parte de la pantalla.",
    ],
    entregable: "Página tipo Spotify funcionando en el navegador.",
    desafio: "Señalar en el código 3 partes de la página (por ejemplo la barra lateral) y explicar qué etiqueta las arma.",
    promptDemo: "haceme una página inspirada en Spotify con HTML y CSS separados: barra lateral, playlists y reproductor abajo",
    aiReply: "Te paso index.html y style.css. La barra lateral es un <aside>, las playlists una grilla con display: grid.",
    tool: "ChatGPT",
    proyecto: "Spotify",
    vscode: [
      "Crear una carpeta nueva llamada spotify/ con su propio index.html y style.css.",
      "Pegar cada código en su archivo y guardar.",
      "Usar Ctrl+F para buscar una clase del HTML dentro del CSS.",
    ],
  },
  {
    n: 4,
    title: "Proyecto Spotify (parte 2): hacerlo tuyo",
    objetivo: "Personalizar la página tipo Spotify con contenido propio y animarse a cambiar el código a mano.",
    teoria: [
      "Imágenes: rutas relativas (img/tapa.jpg) vs. links de internet.",
      "Cambiar textos, colores y tamaños directo en el código, sin pedírselo todo a la IA.",
      "Hover: que algo cambie cuando pasás el mouse (:hover).",
    ],
    practica: [
      "Reemplazar las playlists por tus canciones o artistas favoritos, con sus tapas.",
      "Cambiar la paleta de colores y la tipografía.",
      "Agregar un efecto hover en las tarjetas.",
    ],
    entregable: "Spotify personalizado con tu música.",
    desafio: "Agregar una sección nueva (por ejemplo \"Escuchado recientemente\") copiando y adaptando una que ya existe.",
    promptDemo: "¿cómo hago que la tarjeta de la playlist se agrande un poquito cuando paso el mouse?",
    aiReply: "Agregá .tarjeta:hover { transform: scale(1.05); } y una transition para que sea suave.",
    tool: "ChatGPT",
    proyecto: "Spotify personalizado",
    vscode: [
      "Crear una carpeta img/ dentro de spotify/ y guardar ahí las tapas.",
      "Usar src=\"img/nombre.jpg\" respetando mayúsculas y extensión.",
    ],
  },
  {
    n: 5,
    title: "Proyecto Pinterest (parte 1): grillas y tarjetas",
    objetivo: "Armar con IA una página tipo Pinterest y entender cómo se acomodan muchas tarjetas en pantalla.",
    teoria: [
      "Tarjetas (cards): imagen + texto dentro de una caja con bordes redondeados.",
      "Ordenar cosas en pantalla: display: flex, display: grid y columns (el mosaico de Pinterest).",
      "Reutilizar estilos: una sola clase .pin para todas las tarjetas.",
    ],
    practica: [
      "Pedirle a ChatGPT una página tipo Pinterest con buscador arriba y mosaico de imágenes.",
      "Elegir un tema para tu tablero (outfits, autos, comida, anime, lugares).",
      "Cargar al menos 12 imágenes propias.",
    ],
    entregable: "Página tipo Pinterest con un mosaico de imágenes.",
    desafio: "Cambiar la cantidad de columnas del mosaico y ver qué pasa en pantalla chica.",
    promptDemo: "armame una página tipo Pinterest con buscador y un mosaico de imágenes de distintas alturas",
    aiReply: "Uso columns: 4 en el contenedor y break-inside: avoid en cada .pin para que no se corten.",
    tool: "ChatGPT",
    proyecto: "Pinterest",
    vscode: [
      "Crear la carpeta pinterest/ con index.html, style.css e img/.",
      "Duplicar una tarjeta con Shift+Alt+↓ para armar el mosaico rápido.",
    ],
  },
  {
    n: 6,
    title: "Proyecto Pinterest (parte 2): detalles que lo hacen pro",
    objetivo: "Pulir el Pinterest: efectos al pasar el mouse, botones y que se vea bien en el celular.",
    teoria: [
      "Hover con capa: mostrar un botón \"Guardar\" encima de la imagen.",
      "Responsive: <meta name=\"viewport\"> y @media para pantallas chicas.",
      "Herramientas del navegador (F12): ver y probar CSS en vivo.",
    ],
    practica: [
      "Agregar el botón \"Guardar\" que aparece al pasar el mouse.",
      "Hacer que en el celular se vean 2 columnas en vez de 4.",
      "Revisar la página con el modo celular de F12.",
    ],
    entregable: "Pinterest terminado y responsive.",
    desafio: "Con F12 abierto, cambiar 3 estilos en vivo y después pasar al código el que más te guste.",
    promptDemo: "¿cómo hago que en el celular el mosaico tenga 2 columnas?",
    aiReply: "Con @media (max-width: 600px) { .mosaico { columns: 2; } } al final de tu style.css.",
    tool: "ChatGPT",
    proyecto: "Pinterest responsive",
    vscode: [
      "Abrir F12 y tocar el ícono del celular para simular otra pantalla.",
      "Agregar el @media al final del style.css (si va antes, otra regla puede pisarlo).",
    ],
  },
  {
    n: 7,
    title: "JavaScript: que tus páginas cobren vida",
    objetivo:
      "Dar el primer paso en JavaScript: hacer que los botones del Spotify y del Pinterest hagan algo de verdad.",
    teoria: [
      "HTML = qué hay, CSS = cómo se ve, JavaScript = qué hace.",
      "Las 4 piezas mágicas: buscar un elemento (querySelector), escuchar un click (addEventListener), cambiar texto (textContent) y prender/apagar una clase (classList.toggle).",
      "La consola (F12): donde JavaScript te avisa qué salió mal.",
    ],
    practica: [
      "Botón ❤️ en cada pin de Pinterest que se pinta al tocarlo.",
      "Botón ▶️/⏸️ en el Spotify que cambia de ícono.",
      "Un botón de modo oscuro para cualquiera de las dos páginas.",
    ],
    entregable: "Spotify o Pinterest con al menos 2 botones que funcionan.",
    desafio: "Hacer un contador de \"me gusta\" que sume 1 cada vez que tocás el corazón.",
    promptDemo: "agregale a mi Pinterest un corazón en cada imagen que se ponga rojo al tocarlo. explicame cada línea de JS",
    aiReply: "Busco todos los .corazon con querySelectorAll, les escucho el click y les hago classList.toggle('activo').",
    tool: "ChatGPT",
    proyecto: "Páginas interactivas",
    preparate: [
      "Tener a mano las carpetas del Spotify y del Pinterest.",
      "Jugar una ronda del quiz de CSS en la zona de juegos para llegar con todo fresco.",
      "Pensar 2 botones que te gustaría que hagan algo en tus páginas.",
    ],
    vscode: [
      "Crear script.js y linkearlo al final del <body> con <script src=\"script.js\"></script>.",
      "Abrir la consola (F12 → Console) y escribir console.log(\"hola\") para probar.",
    ],
  },
  {
    n: 8,
    title: "Tu propio juego con JavaScript",
    objetivo: "Crear un mini juego jugable (piedra, papel o tijera, adiviná el número o un clicker) y entender cómo piensa la compu.",
    teoria: [
      "Variables: cajitas que guardan cosas (let puntos = 0).",
      "Decisiones con if / else: si pasa esto, hacé aquello.",
      "El azar: Math.random() para que la compu elija.",
    ],
    practica: [
      "Elegir un juego y pedirle a ChatGPT una versión simple, explicada línea por línea.",
      "Cambiarle reglas, textos y colores a mano.",
      "Probarlo con un compañero/a y arreglar lo que falle.",
    ],
    entregable: "Mini juego propio funcionando (va a ser un proyecto del portfolio).",
    desafio: "Agregarle al juego un marcador de puntos que se guarde aunque recargues (localStorage).",
    promptDemo: "haceme un piedra papel o tijera con HTML, CSS y JS bien simple, con marcador, y explicame el if",
    aiReply: "La compu elige con Math.random(). Después un if compara tu jugada con la suya y suma el punto.",
    tool: "ChatGPT",
    proyecto: "Juego JS",
    preparate: [
      "Pensar qué juego querés hacer (o traer 2 ideas).",
      "Repasar en la guía: variables, if/else y Math.random.",
      "Probar el editor en vivo de la zona de juegos con el ejemplo del juego.",
    ],
    vscode: [
      "Crear la carpeta juego/ con index.html, style.css y script.js.",
      "Usar console.log() para ver qué valor tiene una variable en cada momento.",
    ],
  },
  {
    n: 9,
    title: "Portfolio: tu vitrina de proyectos",
    objetivo: "Armar el portfolio personal que junta todo lo que hiciste en el taller, con links a cada proyecto.",
    teoria: [
      "Qué es un portfolio y por qué sirve (para la escuela, un trabajo, o para mostrar en la familia).",
      "Estructura de carpetas: portfolio/ con index.html y adentro una carpeta por proyecto.",
      "Links relativos entre páginas: href=\"spotify/index.html\".",
      "Secciones típicas: inicio, sobre mí, proyectos (tarjetas con captura), contacto.",
    ],
    practica: [
      "Copiar la presentación, el Spotify, el Pinterest y el juego dentro de la carpeta portfolio/.",
      "Pedirle a la IA la estructura del portfolio y personalizarla.",
      "Una tarjeta por proyecto con captura de pantalla y botón \"ver proyecto\".",
      "Sumar un toque de JS: modo oscuro o un saludo según la hora.",
    ],
    entregable: "Portfolio funcionando en la compu, con los 4 proyectos linkeados.",
    desafio: "Que el portfolio se vea bien en el celular (probalo con F12 → modo celular).",
    promptDemo: "armame un portfolio con inicio, sobre mí, 4 tarjetas de proyectos que linkeen a carpetas y contacto",
    aiReply: "Cada tarjeta tiene <img> con la captura y un <a href=\"spotify/index.html\">. Te explico cómo ordenar las carpetas.",
    tool: "ChatGPT",
    proyecto: "Portfolio",
    preparate: [
      "Sacar una captura de pantalla de cada proyecto (Windows + Shift + S).",
      "Escribir 3 líneas sobre vos para la sección \"sobre mí\".",
      "Mirar la guía \"Armar tu portfolio\" en /guia → Paso a paso.",
    ],
    vscode: [
      "Crear portfolio/ y arrastrar adentro las carpetas de cada proyecto.",
      "Verificar que cada link abra su proyecto (si da error, revisar mayúsculas y rutas).",
    ],
  },
  {
    n: 10,
    title: "Deploy: tu portfolio en internet",
    objetivo: "Publicar el portfolio con un link propio que se pueda abrir desde cualquier celular.",
    teoria: [
      "Qué es el deploy: pasar de tener la página en tu compu a tenerla en internet.",
      "Hosting gratis: Netlify Drop (arrastrar y soltar) y GitHub Pages.",
      "Checklist antes de subir: el archivo principal se llama index.html, rutas relativas, imágenes adentro de la carpeta.",
    ],
    practica: [
      "Repasar el checklist y corregir lo que falte.",
      "Publicar el portfolio en Netlify Drop arrastrando la carpeta.",
      "Cambiarle el nombre al sitio y abrir el link desde el celular.",
      "Subirlo también al portal del taller para la muestra final.",
    ],
    entregable: "Portfolio publicado con link funcionando.",
    desafio: "Mandarle el link a alguien de tu familia y que lo abra desde su celular.",
    promptDemo: "subí mi portfolio a Netlify y las imágenes no se ven, ¿qué puede ser?",
    aiReply: "Seguro es la ruta: en internet importan las mayúsculas. Revisá que Foto.JPG y foto.jpg coincidan.",
    tool: "Claude",
    toolNote: "Probamos Claude para que nos guíe en el deploy y en los errores.",
    proyecto: "Online 🚀",
    preparate: [
      "Traer el portfolio terminado (en pendrive o en tu cuenta de mail/Drive por las dudas).",
      "Tener a mano un mail al que puedas entrar (para crear la cuenta de Netlify).",
      "Leer la guía \"Subir tu página a internet\".",
    ],
    vscode: [
      "Revisar que el archivo principal se llame index.html (todo en minúscula).",
      "Buscar con Ctrl+Shift+F rutas que empiecen con C:\\ (esas no andan en internet).",
    ],
  },
  {
    n: 11,
    title: "Muestra final y próximos pasos",
    objetivo: "Mostrar el portfolio publicado, festejar lo aprendido y llevarse un camino para seguir.",
    teoria: [
      "Recorrido: de \"no sé qué es HTML\" a \"tengo mi página en internet\".",
      "Cómo seguir aprendiendo solo/a: recursos gratis, comunidades, proyectos para practicar.",
      "La IA como copiloto: ayuda un montón, pero el que entiende y decide sos vos.",
    ],
    practica: [
      "Cada participante presenta su portfolio (2-3 minutos): qué hizo, qué fue lo más difícil, qué aprendió.",
      "Gran final: torneo del quiz de CODE+IA.",
      "Galería de páginas de alumnos abierta para las familias.",
    ],
    entregable: "Portfolio online + presentación ante el grupo.",
    desafio: "Pedirle a la IA un mini plan de 3 pasos para tu próximo proyecto y anotarlo.",
    promptDemo: "dame 3 ideas de proyectos para seguir practicando HTML, CSS y JS",
    aiReply: "1) Un clon de Netflix. 2) Una lista de tareas que se guarda. 3) Una calculadora con estilo. ¿Arrancamos?",
    tool: "Las 3 IAs",
    proyecto: "Muestra final",
    preparate: [
      "Practicar tu presentación de 2 minutos (qué hiciste y qué aprendiste).",
      "Abrir tu link publicado y revisar que todo ande.",
      "Invitar a tu familia a ver la galería de alumnos.",
    ],
    vscode: ["Dejar abierto el portfolio publicado y el código en VS Code para mostrar en vivo."],
  },
];

/** La próxima clase: la primera que todavía no está habilitada (o null si ya están todas). */
export const nextClass: ClassSession | null =
  curriculum.find((c) => !isUnlocked(c.n)) ?? null;

/** Se puede ver: habilitada o es la próxima (como adelanto). */
export const isVisible = (n: number) => isUnlocked(n) || nextClass?.n === n;
