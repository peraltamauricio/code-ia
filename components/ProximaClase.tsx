import Link from "next/link";
import { curriculum, isUnlocked, nextClass } from "@/lib/curriculum";

// Los hitos del camino: la clase donde se termina cada proyecto.
const HITOS = [
  { n: 2, icon: "👋", label: "Presentación" },
  { n: 4, icon: "🎧", label: "Spotify" },
  { n: 6, icon: "📌", label: "Pinterest" },
  { n: 8, icon: "🎮", label: "Juego JS" },
  { n: 9, icon: "💼", label: "Portfolio" },
  { n: 10, icon: "🚀", label: "Online" },
];

export default function ProximaClase() {
  const done = curriculum.filter((c) => isUnlocked(c.n)).length;
  const pct = Math.round((done / curriculum.length) * 100);
  const quedan = curriculum.length - done;

  return (
    <section className="section" id="proxima" style={{ borderTop: "none", paddingTop: 20 }}>
      <div className="wrap">
        <div className="path panel reveal">
          <div className="path-head">
            <span className="mono-tag">camino.al.portfolio</span>
            <span className="path-count">
              {done}/{curriculum.length} clases · {quedan === 0 ? "¡terminamos!" : `quedan ${quedan}`}
            </span>
          </div>
          <div className="path-bar">
            <div className="path-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <ol className="path-steps">
            {HITOS.map((h, i) => {
              const firstTodo = HITOS.findIndex((x) => !isUnlocked(x.n));
              const state = isUnlocked(h.n) ? "done" : i === firstTodo ? "now" : "todo";
              return (
                <li key={h.label} className={`path-step is-${state}`}>
                  <span className="path-dot">{state === "done" ? "✓" : h.icon}</span>
                  <span className="path-label">{h.label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {nextClass && (
          <div className="next-card reveal" style={{ marginTop: 20 }}>
            <div className="next-glow" aria-hidden="true" />
            <div className="next-body">
              <div className="next-eyebrow">
                <span className="dot pulse" /> PRÓXIMA CLASE · {String(nextClass.n).padStart(2, "0")}
              </div>
              <h2 className="next-title">{nextClass.title}</h2>
              <p className="next-desc">{nextClass.objetivo}</p>

              <div className="next-cols">
                <div>
                  <div className="next-label">vamos a hacer</div>
                  <ul className="class-list class-list-check">
                    {nextClass.practica.slice(0, 3).map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                {nextClass.preparate && (
                  <div>
                    <div className="next-label">para llegar con todo</div>
                    <ul className="class-list">
                      {nextClass.preparate.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="next-cta">
                <a className="btn btn-solid spotlight" href="#clases">
                  Ver la clase completa →
                </a>
                <Link className="btn" href="/jugar">
                  🎮 Repasar jugando
                </Link>
                <Link className="btn" href="/guia">
                  📖 Guía
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
