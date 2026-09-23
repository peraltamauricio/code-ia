import type { CSSProperties } from "react";

const items = [
  {
    tag: "CLASE 03",
    icon: "</>",
    title: "HTML",
    desc: "Estructura de una página: títulos, párrafos, imágenes, listas y links. Se la pedimos a la IA y la explicamos línea por línea.",
    xp: "entregable: 1ª página .html",
  },
  {
    tag: "CLASE 04",
    icon: "{ }",
    title: "CSS",
    desc: 'Vocabulario visual para prompts: paleta, tipografía, espaciado. Le pedimos a la IA "modo diseñador" y elegimos variantes.',
    xp: "entregable: diseño propio",
  },
  {
    tag: "CLASE 05",
    icon: "ƒ()",
    title: "JavaScript",
    desc: "Interactividad simple: botones, temas claro/oscuro, formularios que validan. Primer contacto con debugging.",
    xp: "entregable: página interactiva",
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
            Tres tecnologías, tres clases, un mismo copiloto: la IA te ayuda a escribir, explicar
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
