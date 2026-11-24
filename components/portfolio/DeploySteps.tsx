import { guias } from "@/lib/guias";

/** Muestra una guía paso a paso (de lib/guias.ts) abierta, sin necesidad de ir a /guia. */
export default function DeploySteps({ id }: { id: string }) {
  const g = guias.find((x) => x.id === id);
  if (!g) return null;
  return (
    <div className="howto panel is-open" style={{ maxWidth: 860, margin: "0 auto" }}>
      <div className="howto-head" style={{ cursor: "default" }}>
        <span className="howto-icon">{g.icon}</span>
        <span style={{ flex: 1, textAlign: "left" }}>
          <span className="howto-title">{g.title}</span>
          <span className="howto-when">{g.when}</span>
        </span>
      </div>
      <div className="howto-body">
        <p className="howto-intro">{g.intro}</p>
        <ol className="howto-steps">
          {g.pasos.map((p, i) => (
            <li key={i}>
              <span className="howto-num">{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p>{p.t}</p>
                {p.code && (
                  <pre className="guide-code">
                    <code>{p.code}</code>
                  </pre>
                )}
                {p.tip && <p className="howto-tip">💡 {p.tip}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
