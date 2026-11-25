const items = [
  { num: "[01-02]", title: "HTML Y CSS", desc: "Una presentación propia en HTML, con colores, letras y espacios en CSS." },
  { num: "[03-04]", title: "SPOTIFY", desc: "La IA arma la página, nosotros la entendemos y la hacemos nuestra." },
  { num: "[05-06]", title: "PINTEREST", desc: "Grillas, tarjetas, hover y responsive para el celular." },
  { num: "[07]", title: "JAVASCRIPT", desc: "Botones que hacen cosas: me gusta, alertas, modo oscuro." },
  { num: "[08]", title: "MI JUEGO", desc: "Un mini juego propio con variables, if/else y azar." },
  { num: "[09]", title: "GRAN REPASO", desc: "Torneo en vivo y retos largos de HTML y CSS con autocorrección." },
  { num: "[10]", title: "PORTFOLIO + ONLINE", desc: "Juntar todos los proyectos en un portfolio y publicarlo con Netlify." },
  { num: "[11]", title: "MUESTRA FINAL", desc: "Cada participante presenta su portfolio publicado a la familia." },
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
