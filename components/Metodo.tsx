const steps = [
  { n: "01", title: "TEORÍA BREVE", desc: "Lo justo y necesario para entender el concepto del día, sin perder tiempo en jerga técnica." },
  { n: "02", title: "DEMO EN VIVO", desc: "Mostramos cómo se hace, en pantalla, con la IA como copiloto del código." },
  { n: "03", title: "PRÁCTICA GUIADA", desc: "Cada participante prueba, itera y pide ayuda a Claude, ChatGPT o Gemini cuando algo no funciona." },
  { n: "04", title: "ENTREGABLE", desc: "La clase termina con algo concreto y funcionando, anotado en la bitácora de prompts propia." },
];

export default function Metodo() {
  return (
    <section className="section" id="metodo">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="mono-tag">loop.clase</span>
          <h2 className="section-title">El método CODE+IA</h2>
          <p className="section-desc">
            Desde la Clase 2, cada encuentro arranca con un desafío exprés de 10-15 minutos y
            sigue esta misma estructura, sin tareas para hacer en casa.
          </p>
        </div>
        <div className="roadmap reveal">
          {steps.map((s) => (
            <div className="road-step" key={s.n}>
              <div className="road-dot">{s.n}</div>
              <div className="road-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
