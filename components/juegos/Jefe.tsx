"use client";

// El "jefe" de los retos: un ChatGPT malvado que te va tirando una misión por vez, como en un chat.
// Es interactivo: escribe mientras habla, se sacude y pierde vida cuando cumplís una misión,
// le podés hacer clic para que te insulte, tiene sonidos (apagados al principio) y festeja/llora al final.

import { useCallback, useEffect, useRef, useState } from "react";

type M = { t: string; hint?: string };

const RETOS = [
  "Ja, ja, ja. ¿Pensás que podés conmigo? Empecemos fácil:",
  "Mmm... Con eso no me alcanza. Ahora:",
  "No está mal para un humano. Pero seguro con esto te trabás:",
  "Sigo en pie. A ver si podés con esto:",
  "Me estás poniendo nervioso... Pero todavía no ganaste:",
  "¡Mi circuito está sudando! A ver esta:",
  "No puede ser... Otra más y te quedás con mi corona:",
];
const REACCIONES = [
  "Grrr... esa salió bien. 😒",
  "Mmm, tuviste suerte. 😠",
  "¡Eso no me lo esperaba! 😳",
  "Ay, ay, ay... me duele. 🤕",
  "No lo puedo creer... 😵",
];
const CHAMUYOS = [
  "¡No me toques! 😠",
  "Mi IA es más grande que la tuya. 🤖",
  "¿Te trabaste? Yo no me trabo nunca. 😏",
  "Pedile ayuda a ChatGPT... ah, soy yo. 😈",
  "Tic tac, tic tac... ⏰",
  "Dale, que no tengo todo el día. 🥱",
  "Mirá el ejemplo, humano. Está ahí abajo. 👇",
  "¿Cosquillas? Qué asco. 🤢",
];
const CONFETI = ["🎉", "✨", "🏆", "👑", "⭐", "🎊", "💥"];

type Props = {
  misiones: M[];
  results?: boolean[] | null;
  name?: string;
  /** Texto del ejemplo de una misión (por defecto, su pista). */
  hintOf?: (m: M) => string | undefined;
};

// Sonidos cortitos con WebAudio (sin archivos). Arrancan apagados.
function beep(kind: "hit" | "win" | "talk") {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const notas = kind === "win" ? [523, 659, 784, 1046] : kind === "hit" ? [220, 160] : [330];
    notas.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = kind === "hit" ? "sawtooth" : "square";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.07, ctx.currentTime + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.1 + 0.18);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.1);
      o.stop(ctx.currentTime + i * 0.1 + 0.2);
    });
    setTimeout(() => ctx.close(), 900);
  } catch {}
}

/** Texto que se va escribiendo solo. Un clic lo muestra completo. */
function Typing({ text, onDone }: { text: string; onDone?: () => void }) {
  const [n, setN] = useState(0);
  const cb = useRef(onDone);
  cb.current = onDone;
  useEffect(() => {
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v + 1 >= text.length) {
          clearInterval(id);
          return text.length;
        }
        return v + 1;
      });
    }, 22);
    return () => clearInterval(id);
  }, [text]);
  useEffect(() => {
    if (n >= text.length) cb.current?.();
  }, [n, text]);
  return (
    <span onClick={() => setN(text.length)} style={{ cursor: n < text.length ? "pointer" : "default" }}>
      {text.slice(0, n)}
      {n < text.length && <span className="jefe-cursor">▍</span>}
    </span>
  );
}

export default function Jefe({ misiones, results, name = "ChatGPT Malvado", hintOf }: Props) {
  const total = misiones.length;
  const done = misiones.filter((_, i) => results?.[i]).length;
  const next = misiones.findIndex((_, i) => !results?.[i]);
  const vida = total ? Math.round(((total - done) / total) * 100) : 0;
  const ganaste = next === -1;

  const [sound, setSound] = useState(false);
  const [hit, setHit] = useState(0); // sube cada vez que le pegás
  const [dmg, setDmg] = useState<number | null>(null);
  const [talk, setTalk] = useState<string | null>(null);
  const [listo, setListo] = useState(false); // ¿ya terminó de escribir la pregunta?
  const prev = useRef(done);
  const first = useRef(true);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  // Cuando cumplís una misión: golpe, número flotante y sonido.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      prev.current = done;
      return;
    }
    if (done > prev.current) {
      setHit((h) => h + 1);
      setDmg(Math.round(100 / Math.max(1, total)));
      setTalk(null);
      if (soundRef.current) beep(done === total ? "win" : "hit");
      const t = setTimeout(() => setDmg(null), 1100);
      prev.current = done;
      return () => clearTimeout(t);
    }
    prev.current = done;
  }, [done, total]);

  // La pregunta nueva vuelve a "escribirse".
  useEffect(() => {
    setListo(false);
  }, [next]);

  const onDoneTyping = useCallback(() => setListo(true), []);

  function clickBoss() {
    if (ganaste) {
      setTalk("Zzz... 😵 (ya me ganaste, déjame en paz)");
      return;
    }
    setTalk(CHAMUYOS[Math.floor(Math.random() * CHAMUYOS.length)]);
    if (soundRef.current) beep("talk");
  }

  const m = ganaste ? null : misiones[next];
  const ej = m ? (hintOf ? hintOf(m) : m.hint) : undefined;
  const herido = !ganaste && done / Math.max(1, total) > 0.6;

  return (
    <div className="jefe">
      <div className="jefe-head">
        <button
          type="button"
          key={hit}
          className={`jefe-face${ganaste ? " is-dead" : ""}${herido ? " is-hurt" : ""}${hit ? " is-hit" : ""}`}
          onClick={clickBoss}
          title="¡Tocame si te animás!"
          aria-label="Tocar al jefe"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/jefe.png" alt={name} width={72} height={72} />
          {ganaste && <i className="jefe-x">😵</i>}
          {dmg !== null && <span className="jefe-dmg">-{dmg}%</span>}
        </button>
        <div className="jefe-info">
          <b>{name}</b>
          <div className="jefe-hp" aria-label={`Vida del jefe: ${vida}%`}>
            <div className="jefe-hp-fill" style={{ width: `${vida}%` }} />
          </div>
          <span className="jefe-hp-txt">
            {ganaste ? "¡Derrotado!" : `Le quedan ${total - done} de ${total} preguntas`}
          </span>
        </div>
        <button
          type="button"
          className="jefe-sound"
          onClick={() => setSound((s) => !s)}
          title={sound ? "Apagar sonidos" : "Prender sonidos"}
          aria-label={sound ? "Apagar sonidos" : "Prender sonidos"}
        >
          {sound ? "🔊" : "🔇"}
        </button>
      </div>

      {talk && <div className="jefe-bubble is-boss is-small jefe-talk">{talk}</div>}

      <div className="jefe-chat">
        {misiones.map((mm, i) => {
          if (!results?.[i]) return null;
          return (
            <div key={i} className="jefe-done">
              <div className="jefe-bubble is-you">✓ {mm.t}</div>
              <div className="jefe-bubble is-boss is-small">{REACCIONES[i % REACCIONES.length]}</div>
            </div>
          );
        })}

        {ganaste ? (
          <div className="jefe-bubble is-boss is-win">
            ¡NOOOOO! 😭 Me ganaste... Sos mejor programador/a que yo. ¡Te dejo mi corona! 👑
            <div className="jefe-confeti" aria-hidden>
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    left: `${(i * 37) % 100}%`,
                    animationDelay: `${(i % 6) * 0.15}s`,
                    animationDuration: `${1.6 + (i % 4) * 0.3}s`,
                  }}
                >
                  {CONFETI[i % CONFETI.length]}
                </span>
              ))}
            </div>
          </div>
        ) : (
          m && (
            <div className="jefe-now">
              <div className="jefe-bubble is-boss">
                <p>
                  <Typing key={next} text={RETOS[Math.min(done, RETOS.length - 1)]} onDone={onDoneTyping} />
                </p>
                {listo && (
                  <div className="jefe-appear">
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
                )}
              </div>
              <div className="jefe-wait">
                Escribilo en el editor… cuando esté bien, ¡le pegás al jefe! (tocá al jefe si querés charlar 😈)
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
