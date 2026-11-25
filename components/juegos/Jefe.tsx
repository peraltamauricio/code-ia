"use client";

// El "jefe" de los retos: un ChatGPT malvado que te va tirando una misión por vez, como en un chat.
// Cada misión que cumplís le saca vida. Sirve para los Retos de código y para los de Bloques.

type M = { t: string; hint?: string };

const RETOS = [
  "Ja, ja, ja. ¿Pensás que podés conmigo? Empecemos fácil:",
  "Mmm... Con eso no me alcanza. Ahora:",
  "No está mal para un humano. Pero seguro con esto te trabás:",
  "Sigo en pie. A ver si podés con esto:",
  "Me estás poniendo nervioso... Pero todavía no ganaste:",
  "¡Mi circuito está sudando! Última vez que te lo pido así:",
  "No puede ser... Otra más y te quedás con mi corona:",
];
const REACCIONES = [
  "Grrr... esa salió bien. 😒",
  "Mmm, tuviste suerte. 😠",
  "¡Eso no me lo esperaba! 😳",
  "Ay, ay, ay... me duele. 🤕",
  "No lo puedo creer... 😵",
];

type Props = {
  misiones: M[];
  results?: boolean[] | null;
  name?: string;
  /** Texto del ejemplo de una misión (por defecto, su pista). */
  hintOf?: (m: M) => string | undefined;
};

export default function Jefe({ misiones, results, name = "ChatGPT Malvado", hintOf }: Props) {
  const total = misiones.length;
  const done = misiones.filter((_, i) => results?.[i]).length;
  const next = misiones.findIndex((_, i) => !results?.[i]);
  const vida = total ? Math.round(((total - done) / total) * 100) : 0;
  const ganaste = next === -1;
  const cara = ganaste ? "😵" : done / Math.max(1, total) > 0.6 ? "😰" : "😈";

  return (
    <div className="jefe">
      <div className="jefe-head">
        <span className={`jefe-face${ganaste ? " is-dead" : ""}`}>{cara}</span>
        <div className="jefe-info">
          <b>{name}</b>
          <div className="jefe-hp" aria-label={`Vida del jefe: ${vida}%`}>
            <div className="jefe-hp-fill" style={{ width: `${vida}%` }} />
          </div>
          <span className="jefe-hp-txt">
            {ganaste ? "¡Derrotado!" : `Le quedan ${total - done} de ${total} preguntas`}
          </span>
        </div>
      </div>

      <div className="jefe-chat">
        {misiones.map((m, i) => {
          if (!results?.[i]) return null;
          return (
            <div key={i} className="jefe-done">
              <div className="jefe-bubble is-you">✓ {m.t}</div>
              <div className="jefe-bubble is-boss is-small">{REACCIONES[i % REACCIONES.length]}</div>
            </div>
          );
        })}

        {ganaste ? (
          <div className="jefe-bubble is-boss is-win">
            ¡NOOOOO! 😭 Me ganaste... Sos mejor programador/a que yo. ¡Te dejo mi corona! 👑
          </div>
        ) : (
          (() => {
            const m = misiones[next];
            const ej = hintOf ? hintOf(m) : m.hint;
            return (
              <div className="jefe-now">
                <div className="jefe-bubble is-boss">
                  <p>{RETOS[Math.min(done, RETOS.length - 1)]}</p>
                  <p className="jefe-ask">
                    <span>Pregunta {next + 1}:</span> {m.t}
                  </p>
                  {ej && (
                    <p className="jefe-ej">
                      <b>💡 Ejemplo para vencerme:</b>
                      {"\n"}
                      {ej}
                    </p>
                  )}
                </div>
                <div className="jefe-wait">Escribilo en el editor… cuando esté bien, el jefe pierde vida solo.</div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
