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
export const UNLOCKED_CLASSES = [1, 2, 3, 4, 5, 6, 7, 8];

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
    title: "JavaScript: que tus páginas cobren vida (con la IA)",
    objetivo:
      "Conocer JavaScript lo justo: qué es, para qué sirve y cómo pedirle a la IA que haga que tus páginas hagan cosas.",
    teoria: [
      "HTML = qué hay, CSS = cómo se ve, JavaScript = qué hace.",
      "El primer código a mano: alert(\"Hola\"), un cartelito que aparece al abrir la página.",
      "Casi todo el JavaScript lo escribe la IA: nuestro trabajo es pedirlo bien, probarlo y entender qué hace (pidiéndole que lo explique línea por línea).",
      "La consola (F12): donde JavaScript te avisa qué salió mal.",
    ],
    practica: [
      "Escribir a mano un alert en el Pinterest y ver cómo aparece el cartel.",
      "Pedirle a ChatGPT un botón ❤️ en cada pin que se pinte al tocarlo, y pegar el código en script.js.",
      "Pedirle un botón de modo oscuro y que explique cada línea.",
    ],
    entregable: "Spotify o Pinterest con al menos 1 botón hecho con la IA que funcione.",
    desafio: "Pedirle a la IA que el corazón sume 1 a un contador de \"me gusta\" y que te explique cómo lo hizo.",
    promptDemo: "agregale a mi Pinterest un corazón en cada imagen que se ponga rojo al tocarlo. explicame cada línea de JS",
    aiReply: "Listo: busco todas las imágenes, les agrego un corazón y cuando lo tocás cambia de 🤍 a ❤️. Te explico cada parte.",
    tool: "ChatGPT",
    proyecto: "Páginas interactivas",
    preparate: [
      "Tener a mano las carpetas del Spotify y del Pinterest.",
      "Pensar 2 botones que te gustaría que hagan algo en tus páginas.",
    ],
    vscode: [
      "Crear script.js y linkearlo al final del <body> con <script src=\"script.js\"></script>.",
      "Abrir la consola (F12 → Console) y escribir console.log(\"hola\") para probar.",
    ],
  },
  {
    n: 8,
    title: "Tu propio juego (hecho con la IA)",
    objetivo: "Pedirle a la IA un mini juego (piedra, papel o tijera, adiviná el número o un clicker), probarlo y hacerlo tuyo.",
    teoria: [
      "Cómo pedir un juego: qué reglas tiene, cómo se ve y en qué archivos (HTML, CSS y JS separados).",
      "Pedirle a la IA que explique el juego línea por línea, sin copiar y pegar a ciegas.",
      "Probar, encontrar qué falla y pedir el arreglo con un buen prompt.",
    ],
    practica: [
      "Elegir un juego y pedirle a ChatGPT una versión simple, explicada línea por línea.",
      "Cambiarle textos, emojis y colores a mano (eso sí lo podés hacer sin la IA).",
      "Probarlo con un compañero/a y arreglar lo que falle.",
    ],
    entregable: "Mini juego propio funcionando (va a ser un proyecto del portfolio).",
    desafio: "Pedirle a la IA una mejora para tu juego (por ejemplo un marcador de puntos) y probar que ande.",
    promptDemo: "haceme un piedra papel o tijera con HTML, CSS y JS bien simple, con marcador, y explicame cómo funciona",
    aiReply: "Te lo armo en 3 archivos. La compu elige al azar y compara con tu jugada para sumar el punto. Te explico cada parte.",
    tool: "ChatGPT",
    proyecto: "Juego con IA",
    preparate: [
      "Pensar qué juego querés hacer (o traer 2 ideas).",
      "Probar el editor en vivo de la zona de juegos con el ejemplo del juego.",
    ],
    vscode: [
      "Crear la carpeta juego/ con index.html, style.css y script.js.",
      "Abrir la consola (F12) para ver los errores si algo no anda.",
    ],
  },
  {
    n: 9,
    title: "Gran repaso: torneo y retos largos",
    objetivo:
      "Repasar HTML y CSS jugando: un torneo en vivo y retos largos con autocorrección. Y dejar armada la carpeta del portfolio.",
    teoria: [
      "Mapa de todo lo visto: HTML = qué hay, CSS = cómo se ve, JavaScript = qué hace. Con los bloques de colores se ve cómo cada bloque se convierte en código.",
      "JavaScript, lo justo: es lo que hace que la página haga cosas, como un alert. Casi todo lo escribe la IA: vos lo pedís bien, lo probás y entendés qué hace.",
      "Cómo leer un reto: dividir la consigna en misiones chicas y resolverlas de a una, mirando el tilde que aparece al lograrla.",
      "Cuando te trabás: pedirle a la IA una PISTA (no la solución) y pasarle tu código y el error de la consola.",
    ],
    practica: [
      "Torneo en vivo \"Repaso final\" (20 preguntas) con el ranking en el proyector.",
      "Armar páginas con **bloques** (estilo Scratch) en /jugar → Bloques: los bloques van escribiendo el HTML y el CSS al lado.",
      "Retos largos en /jugar → Retos: HTML y CSS, y uno con alert (lo único de JavaScript que repasamos).",
      "Armar la carpeta portfolio/ y mover adentro la presentación, el Spotify, el Pinterest y el juego (una carpeta por proyecto).",
      "Empezar el portfolio en la página (/portfolio): tu nombre, el estilo y los proyectos.",
    ],
    entregable: "3 retos superados (HTML y CSS) + carpeta portfolio/ con los 4 proyectos adentro, cada uno abriendo con doble clic.",
    desafio: "Superar el reto \"Mini portfolio\", el más largo de todos.",
    promptDemo: "no me sale este paso del reto: [consigna] y este es mi código. dame una PISTA, no la solución",
    aiReply: "Pista: fijate que el id del HTML sea igual al del querySelector, letra por letra. Probá y contame qué pasa.",
    tool: "ChatGPT",
    toolNote: "Hoy la IA es entrenadora: pedile pistas, no soluciones.",
    proyecto: "Repaso + carpeta portfolio",
    preparate: [
      "Tener todos los proyectos (presentación, Spotify, Pinterest y juego) en una misma carpeta o en un pendrive.",
      "Entrar al portal con tu usuario para que tus puntos cuenten.",
      "Jugar una ronda de práctica del quiz en /jugar.",
    ],
    vscode: [
      "Crear la carpeta portfolio/ y adentro una carpeta por proyecto (presentacion/, spotify/, pinterest/, juego/).",
      "Abrir el index.html de cada proyecto con doble clic para comprobar que sigue andando.",
    ],
  },
  {
    n: 10,
    title: "Portfolio terminado y online",
    objetivo: "Terminar el portfolio y publicarlo en internet con un link propio que se abra desde cualquier celular.",
    teoria: [
      "Qué es un portfolio y para qué sirve: tu vitrina de proyectos (para la escuela, un trabajo o mostrarle a la familia).",
      "Secciones típicas: inicio, sobre mí, proyectos (una tarjeta por proyecto con captura y link) y contacto.",
      "Links entre páginas con rutas relativas: href=\"spotify/index.html\".",
      "Netlify publica tu carpeta gratis con un link propio: se arrastra la carpeta y listo, sin GitHub. Checklist antes de subir: index.html en minúscula, imágenes adentro de la carpeta, rutas sin C:\\.",
      "Plan B: si GitHub se complica, el portfolio igual se sube al portal del taller y se ve en /alumnos.",
    ],
    practica: [
      "Armar el portfolio en la página (/portfolio): completar los 4 pasos, descargar el index.html y guardarlo en la carpeta portfolio/.",
      "Una tarjeta por proyecto con captura de pantalla y botón \"ver proyecto\"; probar que todos los links abran.",
      "Publicar la carpeta portfolio/ en Netlify (guía paso a paso en /portfolio y en /guia).",
      "Abrir el link desde el celular y cambiar algo para ver cómo se actualiza solo.",
    ],
    entregable: "Portfolio publicado con link funcionando (algo como tunombre.vercel.app).",
    desafio: "Mandarle el link a alguien de tu familia y que lo abra desde su celular.",
    promptDemo: "subí mi portfolio a Netlify y las imágenes no se ven, ¿qué puede ser?",
    aiReply: "Seguro es la ruta: en internet importan las mayúsculas. Revisá que Foto.JPG y foto.jpg coincidan.",
    tool: "Claude",
    toolNote: "Probamos Claude para que nos guíe en el deploy y en los errores.",
    proyecto: "Online 🚀",
    preparate: [
      "Traer el portfolio con los 4 proyectos adentro (en pendrive o en tu mail/Drive por las dudas).",
      "Tener a mano un mail al que puedas entrar (para crear la cuenta de Netlify).",
      "Sacar una captura de pantalla de cada proyecto (Windows + Shift + S) y escribir 3 líneas sobre vos.",
      "Leer la guía \"Subir tu portfolio a internet con Netlify\".",
    ],
    vscode: [
      "Revisar que el archivo principal se llame index.html (todo en minúscula).",
      "Buscar con Ctrl+Shift+F rutas que empiecen con C:\\ (esas no andan en internet).",
    ],
  },
  {
    n: 11,
    title: "Muestra final: presentamos nuestros portfolios",
    objetivo: "Cerrar el taller: subir el portfolio al portal, presentarlo ante el grupo y las familias, y llevarse un camino para seguir.",
    teoria: [
      "Recorrido: de \"no sé qué es HTML\" a \"tengo mi portfolio en internet\".",
      "Cómo presentar en 2 minutos: qué hice, qué fue lo más difícil y qué aprendí.",
      "Cómo seguir aprendiendo solo/a: recursos gratis, comunidades y proyectos para practicar.",
      "La IA como copiloto: ayuda un montón, pero el que entiende y decide sos vos.",
    ],
    practica: [
      "Retoques de último momento y subida del portfolio al portal del taller (el archivo se llama index.html).",
      "Gran final: torneo del quiz en vivo con el ranking en el proyector.",
      "Cada participante presenta su portfolio publicado (2 minutos) y recibe feedback.",
      "Galería de páginas de alumnos (/alumnos) abierta para las familias.",
    ],
    entregable: "Portfolio online + presentación breve ante el grupo.",
    desafio: "Pedirle a la IA un mini plan de 3 pasos para tu próximo proyecto y anotarlo.",
    promptDemo: "dame 3 ideas de proyectos para seguir practicando HTML, CSS y JS",
    aiReply: "1) Un clon de Netflix. 2) Una lista de tareas que se guarda. 3) Una calculadora con estilo. ¿Arrancamos?",
    tool: "Las 3 IAs",
    proyecto: "Muestra final",
    preparate: [
      "Practicar tu presentación de 2 minutos en voz alta.",
      "Abrir tu link publicado y revisar que todo ande, también desde el celular.",
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
