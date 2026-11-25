// Generador del portfolio (/portfolio).
// Toma lo que el alumno completó en el formulario y devuelve UN archivo index.html
// completo (con su CSS y su JavaScript adentro, comentados) listo para abrir con doble
// clic, editar en VS Code y subir a internet.

export type Proyecto = { emoji: string; titulo: string; desc: string; link: string; imagen: string };

export type TemaKey = "violeta" | "oceano" | "atardecer" | "bosque" | "rosa";
export type FuenteKey = "moderna" | "redondeada" | "codigo";

export type PortfolioData = {
  nombre: string;
  frase: string;
  sobreMi: string;
  avatar: string;
  habilidades: string[];
  proyectos: Proyecto[];
  email: string;
  instagram: string;
  github: string;
  tema: TemaKey;
  fuente: FuenteKey;
  modo: "oscuro" | "claro";
};

export const TEMAS: Record<TemaKey, { name: string; a: string; b: string }> = {
  violeta: { name: "Violeta", a: "#a855f7", b: "#6366f1" },
  oceano: { name: "Océano", a: "#06b6d4", b: "#3b82f6" },
  atardecer: { name: "Atardecer", a: "#f97316", b: "#ec4899" },
  bosque: { name: "Bosque", a: "#10b981", b: "#84cc16" },
  rosa: { name: "Rosa", a: "#ec4899", b: "#f43f5e" },
};

export const FUENTES: Record<FuenteKey, { name: string; css: string }> = {
  moderna: { name: "Moderna", css: `"Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif` },
  redondeada: { name: "Redondeada", css: `"Nunito", "Trebuchet MS", "Segoe UI", Arial, sans-serif` },
  codigo: { name: "Código", css: `"JetBrains Mono", Consolas, "Courier New", monospace` },
};

export const AVATARES = ["😎", "🦊", "🚀", "🎧", "🎮", "⚽", "🎨", "🐱", "🐶", "🌟", "🤖", "🔥"];

export const HABILIDADES_SUGERIDAS = ["HTML", "CSS", "JavaScript", "ChatGPT", "Claude", "Gemini", "VS Code", "Diseño"];

export const PROYECTOS_BASE: Record<string, Proyecto> = {
  presentacion: { emoji: "👋", titulo: "Mi presentación", desc: "Mi primera página web, hecha con HTML y CSS.", link: "presentacion/index.html", imagen: "" },
  spotify: { emoji: "🎧", titulo: "Mi Spotify", desc: "Una página tipo Spotify con mis playlists favoritas.", link: "spotify/index.html", imagen: "" },
  pinterest: { emoji: "📌", titulo: "Mi Pinterest", desc: "Un mosaico de imágenes con corazones y modo oscuro.", link: "pinterest/index.html", imagen: "" },
  juego: { emoji: "🎮", titulo: "Mi juego", desc: "Un juego hecho con ayuda de la IA. ¡Probalo!", link: "juego/index.html", imagen: "" },
};

export const defaultPortfolio: PortfolioData = {
  nombre: "",
  frase: "Estudiante del taller CODE+IA, aprendiendo a programar con inteligencia artificial.",
  sobreMi: "Hola, soy nuevo/a en esto de programar. En el taller aprendí HTML y CSS y armé mis primeros proyectos con ayuda de la IA.\nMe gusta [lo que te gusta hacer] y quiero seguir aprendiendo.",
  avatar: "😎",
  habilidades: ["HTML", "CSS", "ChatGPT"],
  proyectos: [PROYECTOS_BASE.spotify, PROYECTOS_BASE.pinterest, PROYECTOS_BASE.juego].map((p) => ({ ...p })),
  email: "",
  instagram: "",
  github: "",
  tema: "violeta",
  fuente: "moderna",
  modo: "oscuro",
};

// --- ayudas -----------------------------------------------------------------

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** No dejamos pasar links tipo javascript: (por seguridad). */
const url = (s: string) => (/^\s*(javascript|data|vbscript):/i.test(s) ? "#" : s.trim());

function parrafos(texto: string) {
  const ps = texto
    .split(/\n+/)
    .map((t) => t.trim())
    .filter(Boolean);
  return (ps.length ? ps : ["Pronto voy a escribir algo sobre mí."]).map((t) => `<p>${esc(t)}</p>`).join("\n        ");
}

function handle(valor: string, base: string) {
  const v = valor.trim().replace(/^https?:\/\/(www\.)?[^/]+\//i, "").replace(/^@/, "").replace(/\/+$/, "");
  return v ? base + v : "";
}

/** Un link de contacto que el alumno pueda tocar. */
function redes(d: PortfolioData) {
  const items: string[] = [];
  const ig = handle(d.instagram, "https://instagram.com/");
  const gh = handle(d.github, "https://github.com/");
  if (ig) items.push(`<a class="social" href="${esc(ig)}" target="_blank" rel="noopener">📸 Instagram</a>`);
  if (gh) items.push(`<a class="social" href="${esc(gh)}" target="_blank" rel="noopener">🐙 GitHub</a>`);
  return items.join("\n        ");
}

// --- el archivo -------------------------------------------------------------

export function buildPortfolio(d: PortfolioData): string {
  const t = TEMAS[d.tema];
  const f = FUENTES[d.fuente];
  const nombre = d.nombre.trim() || "Tu nombre";
  const primerNombre = nombre.split(/\s+/)[0];
  const proyectos = d.proyectos.filter((p) => p.titulo.trim());
  const skills = d.habilidades.map((h) => h.trim()).filter(Boolean);

  const cards = proyectos
    .map((p) => {
      const cover = p.imagen.trim()
        ? `<img src="${esc(url(p.imagen))}" alt="Captura de ${esc(p.titulo)}">`
        : `<span>${esc(p.emoji.trim() || "✨")}</span>`;
      const link = p.link.trim() ? `\n          <a class="link" href="${esc(url(p.link))}">Ver proyecto →</a>` : "";
      return `      <article class="card reveal">
        <div class="cover">${cover}</div>
        <div class="card-body">
          <h3>${esc(p.titulo)}</h3>
          <p>${esc(p.desc)}</p>${link}
        </div>
      </article>`;
    })
    .join("\n");

  const contactoBotones = [
    d.email.trim() ? `<a class="btn" href="mailto:${esc(d.email.trim())}">✉️ ${esc(d.email.trim())}</a>` : "",
    redes(d),
  ]
    .filter(Boolean)
    .join("\n        ");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(nombre)} · Portfolio</title>
  <meta name="description" content="Portfolio de ${esc(nombre)}: mis proyectos del taller CODE+IA.">
  <style>
    /* ===== 1. COLORES Y LETRA =====
       Cambiando estas variables cambia toda la página. Probá con otros colores. */
    :root {
      --a: ${t.a};
      --b: ${t.b};
      --fuente: ${f.css};
    }
    body[data-modo="oscuro"] {
      --bg: #0b0a14;
      --panel: rgba(255, 255, 255, 0.05);
      --linea: rgba(255, 255, 255, 0.1);
      --texto: #f4f2ff;
      --suave: #a9a4c7;
    }
    body[data-modo="claro"] {
      --bg: #f7f6ff;
      --panel: #ffffff;
      --linea: rgba(20, 20, 60, 0.1);
      --texto: #1b1a2e;
      --suave: #5d5a7a;
    }

    /* ===== 2. BASE ===== */
    * { box-sizing: border-box; margin: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--fuente);
      background: var(--bg);
      color: var(--texto);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    a { color: inherit; }
    section { padding: 72px 20px; max-width: 1000px; margin: 0 auto; }
    h2 { font-size: 30px; margin-bottom: 8px; }
    .etiqueta { color: var(--a); font-weight: 700; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; }
    .suave { color: var(--suave); }
    .grad {
      background: linear-gradient(135deg, var(--a), var(--b));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    /* ===== 3. MENÚ ===== */
    .menu {
      position: sticky; top: 0; z-index: 10;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 12px 20px;
      background: color-mix(in srgb, var(--bg) 80%, transparent);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--linea);
    }
    .menu strong { font-size: 18px; }
    .menu nav { display: flex; align-items: center; gap: 18px; font-size: 14px; }
    .menu nav a { text-decoration: none; color: var(--suave); }
    .menu nav a:hover { color: var(--texto); }
    #tema {
      width: 38px; height: 38px; border-radius: 50%;
      border: 1px solid var(--linea); background: var(--panel);
      font-size: 17px; cursor: pointer;
    }

    /* ===== 4. PORTADA ===== */
    .portada { position: relative; text-align: center; padding: 90px 20px 70px; overflow: hidden; }
    .portada::before {
      content: ""; position: absolute; inset: -40% -10% auto -10%; height: 90%;
      background:
        radial-gradient(circle at 25% 40%, color-mix(in srgb, var(--a) 35%, transparent), transparent 55%),
        radial-gradient(circle at 75% 30%, color-mix(in srgb, var(--b) 30%, transparent), transparent 55%);
      filter: blur(30px); z-index: -1;
    }
    .avatar {
      width: 124px; height: 124px; margin: 0 auto 22px; border-radius: 50%;
      display: grid; place-items: center; font-size: 62px;
      background: var(--bg);
      border: 4px solid transparent;
      background-image: linear-gradient(var(--bg), var(--bg)), linear-gradient(135deg, var(--a), var(--b));
      background-origin: border-box; background-clip: padding-box, border-box;
      box-shadow: 0 20px 50px -15px var(--a);
    }
    .portada h1 { font-size: clamp(36px, 8vw, 68px); line-height: 1.1; margin: 8px 0 14px; }
    .portada .frase { max-width: 560px; margin: 0 auto 28px; font-size: 18px; color: var(--suave); }
    .botones { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn {
      display: inline-block; padding: 13px 26px; border-radius: 999px;
      background: linear-gradient(135deg, var(--a), var(--b));
      color: #fff; font-weight: 700; text-decoration: none;
      box-shadow: 0 12px 30px -10px var(--a);
      transition: transform 0.2s;
    }
    .btn:hover { transform: translateY(-3px); }
    .btn.suave-btn { background: var(--panel); color: var(--texto); border: 1px solid var(--linea); box-shadow: none; }

    /* ===== 5. SOBRE MÍ ===== */
    .sobre {
      margin-top: 18px; padding: 28px; border-radius: 22px;
      background: var(--panel); border: 1px solid var(--linea);
    }
    .sobre p + p { margin-top: 12px; }
    .skills { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
    .skills li {
      padding: 7px 16px; border-radius: 999px; font-size: 14px; font-weight: 600;
      border: 1px solid color-mix(in srgb, var(--a) 45%, transparent);
      background: color-mix(in srgb, var(--a) 12%, transparent);
    }

    /* ===== 6. PROYECTOS ===== */
    .grilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 22px; margin-top: 26px; }
    .card {
      overflow: hidden; border-radius: 22px;
      background: var(--panel); border: 1px solid var(--linea);
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px -22px var(--a); }
    .cover {
      height: 170px; display: grid; place-items: center; font-size: 66px;
      background: linear-gradient(135deg, var(--a), var(--b));
    }
    .card:nth-child(3n + 2) .cover { filter: hue-rotate(35deg); }
    .card:nth-child(3n) .cover { filter: hue-rotate(-35deg); }
    .cover img { width: 100%; height: 100%; object-fit: cover; }
    .card-body { padding: 20px; }
    .card-body h3 { font-size: 20px; margin-bottom: 6px; }
    .card-body p { color: var(--suave); font-size: 15px; }
    .link { display: inline-block; margin-top: 14px; font-weight: 700; color: var(--a); text-decoration: none; }
    .link:hover { text-decoration: underline; }

    /* ===== 7. CONTACTO ===== */
    .contacto {
      text-align: center; padding: 44px 24px; border-radius: 28px;
      background: linear-gradient(135deg, color-mix(in srgb, var(--a) 22%, transparent), color-mix(in srgb, var(--b) 22%, transparent));
      border: 1px solid var(--linea);
    }
    .contacto .botones { margin-top: 22px; }
    .social {
      padding: 13px 22px; border-radius: 999px; font-weight: 700; text-decoration: none;
      background: var(--panel); border: 1px solid var(--linea);
    }

    /* ===== 8. PIE ===== */
    footer { text-align: center; padding: 30px 20px 50px; color: var(--suave); font-size: 14px; }

    /* ===== 9. ANIMACIÓN AL HACER SCROLL =====
       Solo se esconde si JavaScript funciona (la clase "js" la agrega el script de abajo). */
    .js .reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.7s, transform 0.7s; }
    .js .reveal.visible { opacity: 1; transform: none; }

    /* ===== 10. CELULAR ===== */
    @media (max-width: 600px) {
      section { padding: 52px 16px; }
      .menu nav a { display: none; }
    }
  </style>
</head>

<body data-modo="${d.modo}">

  <!-- ===== MENÚ ===== -->
  <header class="menu">
    <strong class="grad">${esc(primerNombre)}</strong>
    <nav>
      <a href="#sobre-mi">Sobre mí</a>
      <a href="#proyectos">Proyectos</a>
      <a href="#contacto">Contacto</a>
      <button id="tema" title="Cambiar entre modo claro y oscuro">${d.modo === "oscuro" ? "☀️" : "🌙"}</button>
    </nav>
  </header>

  <!-- ===== PORTADA ===== -->
  <section class="portada" id="inicio">
    <div class="avatar">${esc(d.avatar || "😎")}</div>
    <p class="etiqueta" id="saludo">Hola 👋</p>
    <h1>Soy <span class="grad">${esc(nombre)}</span></h1>
    <p class="frase">${esc(d.frase.trim())}</p>
    <div class="botones">
      <a class="btn" href="#proyectos">Ver mis proyectos</a>
      <a class="btn suave-btn" href="#contacto">Contactame</a>
    </div>
  </section>

  <!-- ===== SOBRE MÍ ===== -->
  <section id="sobre-mi" class="reveal">
    <p class="etiqueta">Sobre mí</p>
    <h2>Un poquito de mí</h2>
    <div class="sobre">
        ${parrafos(d.sobreMi)}
    </div>
${skills.length ? `    <ul class="skills">\n${skills.map((s) => `      <li>${esc(s)}</li>`).join("\n")}\n    </ul>\n` : ""}  </section>

  <!-- ===== PROYECTOS ===== -->
  <section id="proyectos">
    <p class="etiqueta reveal">Proyectos</p>
    <h2 class="reveal">Lo que hice en el taller</h2>
    <p class="suave reveal">Tocá un proyecto para abrirlo.</p>
    <div class="grilla">
${cards || `      <p class="suave">Pronto voy a sumar mis proyectos.</p>`}
    </div>
  </section>

  <!-- ===== CONTACTO ===== -->
  <section id="contacto" class="reveal">
    <div class="contacto">
      <p class="etiqueta">Contacto</p>
      <h2>¿Hablamos?</h2>
      <p class="suave">${d.email.trim() || contactoBotones ? "Escribime o seguime en las redes:" : "Pronto voy a sumar mis datos de contacto."}</p>
      <div class="botones">
        ${contactoBotones}
      </div>
    </div>
  </section>

  <footer>
    Hecho con 💜 en el taller CODE+IA · <span id="anio"></span>
  </footer>

  <!-- ===== JAVASCRIPT ===== -->
  <script>
    // Avisamos al CSS que JavaScript funciona (así las animaciones pueden esconder cosas).
    document.documentElement.classList.add("js");

    // 1. Saludo según la hora del día
    const hora = new Date().getHours();
    let saludo = "Buenas noches 🌙";
    if (hora < 12) {
      saludo = "Buenos días ☀️";
    } else if (hora < 20) {
      saludo = "Buenas tardes 🌤️";
    }
    document.querySelector("#saludo").textContent = saludo;

    // 2. Botón de modo claro / oscuro (BUSCAR → ESCUCHAR → HACER)
    const botonTema = document.querySelector("#tema");
    botonTema.addEventListener("click", () => {
      const eraOscuro = document.body.dataset.modo === "oscuro";
      document.body.dataset.modo = eraOscuro ? "claro" : "oscuro";
      botonTema.textContent = eraOscuro ? "🌙" : "☀️";
    });

    // 3. Las secciones aparecen suavemente cuando llegás a ellas
    const elementos = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observador.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.12 });
      elementos.forEach((el) => observador.observe(el));
    } else {
      elementos.forEach((el) => el.classList.add("visible"));
    }

    // 4. El año del pie de página
    document.querySelector("#anio").textContent = new Date().getFullYear();
  </script>
</body>
</html>
`;
}
