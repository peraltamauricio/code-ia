import type { CSSProperties } from "react";

const items = [
  {
    tag: "CLASE 01",
    icon: "</>",
    title: "HTML",
    desc: "El esqueleto de la página: títulos, párrafos, imágenes y links. Arrancamos con una presentación sobre un tema propio.",
    xp: "entregable: presentación",
  },
  {
    tag: "CLASES 02-06",
    icon: "{ }",
    title: "CSS",
    desc: "La ropa de la página: colores, letras, espacios, grillas y hover. Lo practicamos armando un Spotify y un Pinterest con IA.",
    xp: "entregable: Spotify + Pinterest",
  },
  {
    tag: "CLASES 07-08",
    icon: "ƒ()",
    title: "JavaScript",
    desc: "Lo que hace la página: botones que funcionan, modo oscuro, me gusta y un mini juego propio.",
    xp: "entregable: juego propio",
  },
];

export default function Niveles() {
  return (
    <section className="section" id="niveles">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="mono-tag">stack.core</span>
          <h2 className="section-title">Los fundamentos</h2>
          <p className="section-desc">
            Tres tecnologías, un mismo copiloto: la IA te ayuda a escribir, explicar
            e iterar cada línea de código.
          </p>
        </div>
        <div className="levels">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="level-card panel reveal"
              style={{ "--d": `${i * 0.12}s` } as CSSProperties}
            >
              <span className="level-tag">{item.tag}</span>
              <div className="level-icon">{item.icon}</div>
              <h3 className="level-title">{item.title}</h3>
              <p className="level-desc">{item.desc}</p>
              <div className="level-meta">
                <span>asistido por IA</span>
                <span className="xp">{item.xp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
