"use client";

import type { LiveState } from "./live";

const MEDALS = ["🥇", "🥈", "🥉"];

/** La carrera en vivo: una fila por jugador, con su barra de avance y sus puntos. */
export default function LiveBoard({
  players,
  connected,
  me,
  big = false,
  max = 12,
}: {
  players: LiveState[];
  connected: boolean;
  me?: string | null;
  big?: boolean;
  max?: number;
}) {
  return (
    <div className={`race panel${big ? " is-big" : ""}`}>
      <div className="race-head">
        <h3 className="race-title">🏁 Carrera en vivo</h3>
        <span className={`race-status${connected ? " is-on" : ""}`}>
          <span className="live-dot" /> {connected ? `${players.length} jugando` : "conectando…"}
        </span>
      </div>

      {players.length === 0 ? (
        <p className="race-empty">
          {connected ? "Todavía nadie está jugando. ¡Tocá Jugar y aparecés acá!" : "Conectando con la sala…"}
        </p>
      ) : (
        <ol className="race-list">
          {players.slice(0, max).map((p, i) => (
            <li
              key={p.name}
              className={`race-row${p.name === me ? " is-me" : ""}${p.done ? " is-done" : ""}`}
            >
              <span className="race-pos">{MEDALS[i] ?? i + 1}</span>
              <div className="race-mid">
                <div className="race-name">
                  {p.name}
                  {p.name === me && <span className="race-you"> vos</span>}
                  {p.streak >= 2 && !p.done && <span className="race-streak"> 🔥x{p.streak}</span>}
                  {p.last && !p.done && (
                    <span className={`race-last is-${p.last}`}>{p.last === "ok" ? "✓" : "✗"}</span>
                  )}
                </div>
                <div className="race-bar">
                  <div className="race-bar-fill" style={{ width: `${(p.q / Math.max(p.total, 1)) * 100}%` }} />
                </div>
              </div>
              <span className="race-q">{p.done ? "🏁" : `${p.q}/${p.total}`}</span>
              <span className="race-score">{p.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
