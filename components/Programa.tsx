const items = [
  { num: "[01-02]", title: "PERDER EL MIEDO", desc: "Primer contacto con la IA generativa y el arte del prompt aplicado a código." },
  { num: "[03-05]", title: "FUNDAMENTOS", desc: "HTML, CSS y JavaScript asistidos por IA, paso a paso." },
  { num: "[06]", title: "PLANIFICAR", desc: 'Se define el proyecto final y su plan de construcción con la IA como "arquitecta".' },
  { num: "[07-08]", title: "CONSTRUIR", desc: "Estructura del proyecto, secciones, formularios y datos externos simples." },
  { num: "[09]", title: "DEBUGGING", desc: "Diagnosticar y corregir errores con IA, sin depender ciegamente de ella." },
  { num: "[10]", title: "PULIDO", desc: "Checklist de calidad: contenido, diseño, responsive, accesibilidad básica." },
  { num: "[11]", title: "DEPLOY", desc: "Git, GitHub y publicación del proyecto con un link propio y funcionando." },
  { num: "[12]", title: "PRESENTACIÓN", desc: "Cada participante muestra su proyecto publicado y qué aprendió en el camino." },
];

export default function Programa() {
  return (
    <section className="section" id="programa">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="mono-tag">roadmap.json</span>
          <h2 className="section-title">El recorrido completo</h2>
          <p className="section-desc">
            Clases de 1h45, presenciales, con computadoras en el lugar. Cada una combina teoría
            breve + demo en vivo + práctica guiada + entregable.
          </p>
        </div>
        <div className="proc-grid reveal">
          {items.map((it) => (
            <div className="proc-item panel" key={it.num}>
              <div className="num">{it.num}</div>
              <h4>{it.title}</h4>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
