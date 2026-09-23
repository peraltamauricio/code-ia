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
};

export const curriculum: ClassSession[] = [
  {
    n: 1,
    title: "Bienvenida: perdiendo el miedo a la tecnología",
    objetivo:
      "Desmitificar la programación y la IA. Que cada participante entienda qué va a poder construir al final del taller.",
    teoria: [
      "¿Qué es programar? Dar instrucciones claras a una máquina; con IA, esas instrucciones pueden empezar en lenguaje natural.",
      "¿Qué es la IA generativa? Diferencia entre un modelo de lenguaje (Claude, ChatGPT, Gemini) y un buscador.",
      "Mitos a derribar: \"hay que ser bueno en matemática\", \"hay que memorizar código\", \"la IA programa sola sin que yo entienda nada\".",
      "Presentación del recorrido de las 12 clases y del proyecto final.",
    ],
    practica: [
      "Creación de cuentas personales: Claude, ChatGPT, Gemini (versión gratuita).",
      "Primer contacto: pedirle a cada IA \"explicame qué es una página web como si nunca hubieras usado una\".",
      "Instalación de Visual Studio Code.",
    ],
    entregable: "Cuentas propias + captura de las 3 respuestas comparadas + VS Code instalado.",
    promptDemo: "explicame qué es una página web como si nunca hubiera usado una",
    aiReply: "Pensalo como una hoja digital: tiene texto, imágenes y botones que podés tocar...",
    tool: "Las 3 IAs",
    toolNote: "Hoy las probamos a las tres, sin quedarnos con una todavía.",
    vscode: [
      "Instalar Visual Studio Code y abrir la aplicación.",
      "Explorar la interfaz: el editor, la barra lateral de archivos y la terminal integrada.",
    ],
  },
  {
    n: 2,
    title: "El arte del prompt aplicado a código",
    objetivo: "Aprender a escribir prompts efectivos para generar y modificar código.",
    teoria: [
      "Anatomía de un buen prompt técnico: contexto + objetivo + restricciones + formato de salida.",
      "Pedir \"hacé una página\" vs. pedir con detalle (público, estilo, secciones, tecnología).",
      "Iterar sobre una respuesta: pedir cambios puntuales sin reescribir todo el prompt.",
      "Comparativa rápida: Claude, ChatGPT y Gemini para tareas de código, sin declarar un \"ganador\" absoluto.",
    ],
    practica: [
      "Ejercicio de prompts \"malos vs. buenos\" sobre un mismo pedido.",
      "Pedirle a una IA un botón HTML simple, e iterar: color, tamaño, texto, con prompts sucesivos.",
    ],
    entregable: "Bitácora con 5 prompts propios y el resultado obtenido de cada uno.",
    desafio:
      "Elegir un tema cotidiano y pedirle a las tres IAs que lo expliquen en 3 líneas. Comparar cuál fue más clara.",
    promptDemo: "hacé un botón HTML... ahora hacelo violeta y más grande",
    aiReply: "Listo, dos versiones: el botón base y la variante violeta con padding más grande.",
    tool: "Las 3 IAs",
    toolNote: "Último día comparando las tres: desde la próxima clase elegimos una IA de cabecera.",
    vscode: [
      "Abrir VS Code y crear una carpeta nueva para el taller.",
      "Guardar ahí la bitácora de prompts en un archivo de texto.",
    ],
  },
  {
    n: 3,
    title: "Primeros pasos con HTML asistido por IA",
    objetivo: "Entender la estructura básica de una página web y generarla con ayuda de IA.",
    teoria: [
      "Estructura de un documento HTML: etiquetas, jerarquía, elementos comunes (títulos, párrafos, imágenes, listas, links).",
      "Cómo pedirle a la IA que explique línea por línea un código que no entendemos.",
      "Buena práctica: pedir siempre código completo y comentado al inicio.",
    ],
    practica: [
      "Generar con ChatGPT una landing de presentación personal en HTML.",
      "Abrir el archivo en VS Code y visualizarlo en el navegador.",
      "Pedirle a la IA que agregue una sección nueva.",
    ],
    entregable: "Primera página HTML propia (.html) funcionando en el navegador.",
    desafio: "Crear con IA una página HTML nueva sobre un tema libre y comprobar que funcione.",
    promptDemo: "generame una landing de presentación personal, con foto, bio y contacto",
    aiReply: "Acá tenés el HTML completo y comentado, con 3 secciones: header, sobre mí y contacto.",
    tool: "ChatGPT",
    toolNote: "ChatGPT es la IA de cabecera para consultas de código (la Clase 4 usamos Gemini).",
    vscode: [
      "Crear un archivo index.html dentro de la carpeta del taller.",
      "Pegar el código que te dio la IA y guardar con Ctrl+S.",
      "Abrir el archivo con doble clic, o con la extensión Live Server para verlo en el navegador.",
    ],
  },
  {
    n: 4,
    title: "Estilos con CSS: dándole identidad visual al sitio",
    objetivo: "Aprender a describir estilo visual en prompts y aplicar CSS generado por IA.",
    teoria: [
      "Qué es CSS y cómo se conecta con HTML.",
      "Vocabulario visual útil para prompts: paleta de colores, tipografía, espaciado, diseño responsive.",
      "Pedirle a la IA \"modo diseñador\": generar 2-3 variantes de estilo para elegir.",
    ],
    practica: [
      "Tomar la página de la Clase 3 y pedirle a Gemini que la rediseñe con una estética elegida.",
      "Ajustar detalles con prompts puntuales (colores, márgenes, tipografía).",
    ],
    entregable: "Página personal con diseño propio aplicado (HTML + CSS).",
    desafio: "Pedirle a la IA dos variantes de diseño distintas y elegir la que más guste.",
    promptDemo: "rediseñá esta página en modo diseñador: dame 3 variantes de estilo",
    aiReply: "Preparé 3 paletas: minimalista, colorida y corporativa. ¿Con cuál seguimos?",
    tool: "Gemini",
    toolNote: "Única clase con Gemini: aprovechamos su fuerte en diseño, paletas e imágenes.",
    vscode: [
      "Crear un archivo style.css junto al index.html.",
      "Linkearlo en el HTML con <link rel=\"stylesheet\" href=\"style.css\">.",
      "Guardar y refrescar el navegador para ver los cambios en vivo.",
    ],
  },
  {
    n: 5,
    title: "Interactividad básica con JavaScript",
    objetivo: "Incorporar comportamiento dinámico simple a la página usando IA.",
    teoria: [
      "Qué es JavaScript y para qué sirve, a diferencia de HTML/CSS.",
      "Interactividad simple: botones que hacen algo, menús desplegables, formularios que validan.",
      "Pedirle a la IA que explique qué hace cada bloque de JavaScript generado (sin copiar y pegar \"a ciegas\").",
    ],
    practica: [
      "Agregar un botón interactivo (tema claro/oscuro, mostrar/ocultar un mensaje).",
      "Pedirle a la IA que solucione un error simple provocado a propósito (introducción a debugging).",
    ],
    entregable: "Página con al menos un elemento interactivo funcionando.",
    desafio: "Agregar un elemento interactivo nuevo a alguna página ya creada.",
    promptDemo: "agregale un botón que cambie la página a modo oscuro",
    aiReply: "Agregué un toggle con JavaScript. Te explico línea por línea qué hace cada parte.",
    tool: "ChatGPT",
    vscode: [
      "Crear un archivo script.js y linkearlo con <script src=\"script.js\"></script>.",
      "Abrir la consola del navegador (F12) para ver errores en vivo mientras probás.",
    ],
  },
  {
    n: 6,
    title: "Pensar como desarrollador/a: descomponer un proyecto",
    objetivo: "Aprender a planificar un proyecto antes de programarlo, con y sin IA.",
    teoria: [
      "Cómo \"pensar en pantallas y funcionalidades\" antes de escribir el primer prompt.",
      "Técnica de descomposición: dividir un proyecto grande en tareas chicas.",
      "Usar la IA como \"arquitecta\": pedirle que proponga una estructura de archivos y secciones antes de generar código.",
      "Se define el tema del proyecto final.",
    ],
    practica: [
      "Cada participante define la idea de su proyecto final (web personal, landing, portfolio, app simple).",
      "Le pide a ChatGPT que le arme un plan de construcción paso a paso.",
    ],
    entregable: "Idea del proyecto final + plan de construcción generado y revisado.",
    desafio: "Escribir a mano una lista propia de secciones y compararla con el plan de la IA.",
    promptDemo: "quiero armar un portfolio propio. armame un plan de construcción paso a paso",
    aiReply: "Propongo 5 secciones y un orden de armado: header, proyectos, skills, contacto, footer.",
    tool: "ChatGPT",
    vscode: ["Crear la carpeta del proyecto final con subcarpetas css/, js/ e img/."],
  },
  {
    n: 7,
    title: "Construyendo el primer proyecto completo (parte 1)",
    objetivo: "Empezar a construir el proyecto final siguiendo el plan de la Clase 6.",
    teoria: [
      "Organización de archivos de un proyecto (carpetas, nombres, estructura mínima).",
      "Prompting \"por partes\": pedir el proyecto sección por sección en vez de todo junto.",
      "Cómo mantener consistencia de estilo entre secciones generadas por separado.",
    ],
    practica: [
      "Generación de la estructura base del proyecto (HTML general + primeras secciones).",
      "Trabajo individual con acompañamiento docente.",
    ],
    entregable: "Estructura base del proyecto final + primeras 2 secciones funcionando.",
    desafio: "Generar con IA una sección adicional del proyecto e integrarla al archivo.",
    promptDemo: "generame la estructura base de mi proyecto, sección por sección",
    aiReply: "Arranco por el header y la sección de proyectos, manteniendo el mismo estilo del plan.",
    tool: "ChatGPT",
    vscode: [
      "Ir creando un archivo por sección dentro de la carpeta del proyecto.",
      "Guardar seguido con Ctrl+S para ir viendo los avances en el navegador.",
    ],
  },
  {
    n: 8,
    title: "Construyendo el proyecto completo (parte 2): formularios y datos",
    objetivo: "Sumar funcionalidades más avanzadas: formularios y conexión con datos externos simples.",
    teoria: [
      "Formularios de contacto: pedirle a la IA uno funcional con validación básica.",
      "Qué es una API en términos simples, con ejemplos de uso sencillo.",
      "Cuándo pedirle ayuda a la IA para \"conectar\" cosas y cuándo simplificar el alcance.",
    ],
    practica: [
      "Agregar un formulario de contacto al proyecto.",
      "(Opcional) Incorporar un dato externo simple con ayuda de la IA.",
    ],
    entregable: "Proyecto con formulario funcional incorporado.",
    desafio: "Achicar la ventana del navegador para simular pantalla chica y anotar 3 cosas a corregir.",
    promptDemo: "agregá un formulario de contacto con validación básica",
    aiReply: "Sumé nombre, email y mensaje, con validación de email antes de poder enviar.",
    tool: "ChatGPT",
    toolNote: "Última clase con ChatGPT como IA de cabecera: de la Clase 9 en adelante pasamos a Claude.",
    vscode: [
      "Editar el formulario dentro del HTML del proyecto.",
      "Probar el envío en el navegador y revisar la consola (F12) ante errores.",
    ],
  },
  {
    n: 9,
    title: "Debugging: pensar como desarrollador/a frente a un error",
    objetivo: "Perder el miedo al error. Diagnosticar y corregir problemas con ayuda de IA, sin depender ciegamente de ella.",
    teoria: [
      "Tipos de errores comunes: de sintaxis, de lógica, visuales.",
      "Cómo leer un mensaje de error y convertirlo en un buen prompt para la IA.",
      "Estrategia de debugging: aislar el problema antes de preguntar.",
      "Cuándo la IA \"se equivoca\": cómo iterar y no quedarse trabado.",
    ],
    practica: [
      "Diagnosticar y corregir proyectos con errores intencionales.",
      "Revisión cruzada: ayudar a un compañero/a a resolver un error en su proyecto real.",
    ],
    entregable: "Registro de al menos un error propio resuelto (qué pasó, qué prompt usó, cómo lo solucionó).",
    desafio: "Provocar un error a propósito sobre una copia del proyecto y resolverlo documentando el paso a paso.",
    promptDemo: "este botón no hace nada al tocarlo, ¿por qué? te paso el código",
    aiReply: "El evento estaba mal escrito (onclick con mayúscula). Te dejo la línea corregida.",
    tool: "Claude",
    toolNote: "Arrancamos el tramo final del taller con Claude como IA de cabecera.",
    vscode: [
      "Abrir la consola del navegador (F12) → pestaña Console.",
      "Leer el mensaje de error y ubicar el archivo y la línea que marca.",
    ],
  },
  {
    n: 10,
    title: "Pulido final: diseño, contenido y revisión",
    objetivo: "Dejar el proyecto final terminado a nivel de contenido, diseño y funcionalidad.",
    teoria: [
      "Checklist de calidad antes de publicar: textos, imágenes, enlaces, responsive.",
      "Pedirle a la IA una \"revisión general\" del proyecto (rol de QA/tester).",
      "Ajustes básicos de SEO y accesibilidad: títulos de página, textos alternativos en imágenes.",
    ],
    practica: [
      "Trabajo individual de cierre del proyecto con acompañamiento docente.",
      "Pedirle a Claude una revisión final y aplicar los ajustes que tengan sentido.",
    ],
    entregable: "Proyecto final terminado, listo para publicar.",
    desafio: "Mostrarle el proyecto a un compañero/a y anotar 3 cosas para mejorar antes del deploy.",
    promptDemo: "hacé de QA: revisá mi proyecto y decime qué le falta antes de publicarlo",
    aiReply: "3 cosas: falta texto alternativo en las imágenes, un título de página y ajustar el móvil.",
    tool: "Claude",
    vscode: [
      "Revisar carpeta por carpeta que no falte ningún archivo.",
      "Usar buscar y reemplazar (Ctrl+H) para ajustes rápidos de texto.",
    ],
  },
  {
    n: 11,
    title: "Deploy: publicando el proyecto en internet",
    objetivo: "Aprender a publicar (deployar) un proyecto para que esté disponible online con un link propio.",
    teoria: [
      "Qué es el \"deploy\": pasar de tenerlo en la computadora a tenerlo público en internet.",
      "Introducción a Git y GitHub: repositorio, subir archivos.",
      "Comparativa de hosting gratuito: GitHub Pages, Netlify, Vercel.",
      "Cómo pedirle ayuda a la IA paso a paso durante el deploy y ante errores de configuración.",
    ],
    practica: [
      "Creación de cuenta en GitHub.",
      "Deploy guiado del proyecto final en Netlify o GitHub Pages.",
      "Verificación de que el link público funciona.",
    ],
    entregable: "Proyecto final publicado, con link funcionando.",
    desafio: "Investigar otras opciones de hosting gratuito y armar un cuadro comparativo simple.",
    promptDemo: "ayudame paso a paso a publicar este proyecto en Netlify",
    aiReply: "Primero subilo a GitHub, después conectá el repo en Netlify. Te guío en cada paso.",
    tool: "Claude",
    vscode: [
      "Abrir la terminal integrada de VS Code (Ctrl+ñ).",
      "Usar git init, git add . y git commit para subir el proyecto.",
    ],
  },
  {
    n: 12,
    title: "Presentación final y próximos pasos",
    objetivo: "Cerrar el taller compartiendo los proyectos y dejando un camino claro para seguir aprendiendo.",
    teoria: [
      "Recorrido rápido de todo lo aprendido: de \"miedo a la tecnología\" a \"proyecto propio online\".",
      "Cómo seguir aprendiendo: nuevas herramientas de IA para código, comunidades, recursos.",
      "Reflexión grupal sobre el rol de la IA como copiloto, no reemplazo, del pensamiento del desarrollador/a.",
    ],
    practica: [
      "Cada participante presenta su proyecto (2-3 minutos): qué construyó, qué IA usó, qué aprendió.",
      "Feedback grupal y docente sobre cada proyecto.",
    ],
    entregable: "Proyecto publicado + presentación breve ante el grupo.",
    desafio: "Escribir una idea concreta de mejora y pedirle a la IA un mini plan de 3 pasos para lograrla.",
    promptDemo: "dame un mini plan de 3 pasos para seguir mejorando mi proyecto",
    aiReply: "1) Sumar un blog. 2) Animar las transiciones. 3) Conectar un formulario real. ¿Arrancamos?",
    tool: "Claude",
    vscode: [
      "Repasar la estructura final de carpetas del proyecto.",
      "Dejar a mano el repositorio y el link de deploy para mostrar en vivo.",
    ],
  },
];
