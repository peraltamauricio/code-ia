"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LiveBoard from "@/components/juegos/LiveBoard";
import { Game, useLive } from "@/components/juegos/live";
import { shuffle } from "@/components/juegos/util";
import { quiz, QUIZ_CATS, QuizCat } from "@/lib/juegos";

// PANTALLA DEL PROFE (para proyectar): crea la partida, la arranca y muestra el top en vivo.
const ROUND = 10;

function newGame(cat: QuizCat | "todo"): Game {
  const pool = quiz.map((q, i) => ({ q, i })).filter(({ q }) => cat === "todo" || q.cat === cat);
  const items = shuffle(pool)
    .slice(0, ROUND)
    .map(({ q, i }) => ({ i, order: shuffle(q.opts.map((_, k) => k)) }));
  const createdAt = Date.now();
  return { id: createdAt.toString(36), createdAt, cat, items, status: "lobby" };
}

export default function ProfePage() {
  // Cada pestaña del profe tiene su propia "llave" en la sala.
  const hostKey = useRef(`profe-${Math.random().toString(36).slice(2, 8)}`);
  const live = useLive(hostKey.current);
  const [game, setGame] = useState<Game | null>(null);
  const [cat, setCat] = useState<QuizCat | "todo">("todo");
  const adopted = useRef(false);

  // Si recargo la página y había una partida andando, la retomo.
  useEffect(() => {
    if (!adopted.current && live.connected && live.game && !game) {
      adopted.current = true;
      setGame(live.game);
    }
  }, [live.connected, live.game, game]);

  // Anuncio mi partida a la sala cada vez que cambia.
  const { send } = live;
  useEffect(() => {
    send({ kind: "host", game });
  }, [game, send]);

  const players = game && live.game?.id === game.id ? live.players : [];
  const status = game?.status ?? "none";
  const catLabel = (c: string) => QUIZ_CATS.find((x) => x.key === c)?.label ?? c;

  return (
    <>
      <div className="bg-grid" />
      <main className="live">
        <header className="live-head">
          <Link href="/" className="brand">
            <Image src="/logo.png" alt="" width={34} height={34} className="brand-mark" />
            CODE<span style={{ color: "var(--violet-soft)" }}>+IA</span>
          </Link>
          <div className="live-badge">
            <span className="live-dot" /> {live.connected ? "EN VIVO" : "CONECTANDO…"}
          </div>
        </header>

        {/* SIN PARTIDA: elegir tema y crear */}
        {(status === "none" || status === "ended") && (
          <div style={{ textAlign: "center" }}>
            <h1 className="live-title">{status === "ended" ? "🏆 Resultado final" : "🎮 Quiz en vivo"}</h1>
            {status === "ended" && <LiveBoard players={players} connected={live.connected} big max={20} />}
            <div className="host-box panel">
              <p className="live-sub" style={{ marginBottom: 14 }}>
                {status === "ended" ? "¿Otra ronda? Elegí el tema:" : "Elegí el tema de la partida:"}
              </p>
              <div className="game-chips">
                {QUIZ_CATS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`guide-tab${cat === c.key ? " is-active" : ""}`}
                    onClick={() => setCat(c.key)}
                  >
                    <span>{c.icon}</span> {c.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-solid spotlight host-btn"
                onClick={() => setGame(newGame(cat))}
                disabled={!live.connected}
              >
                🎮 Crear partida
              </button>
            </div>
          </div>
        )}

        {/* SALA DE ESPERA */}
        {status === "lobby" && game && (
          <div style={{ textAlign: "center" }}>
            <h1 className="live-title">¡Unite a la partida!</h1>
            <p className="live-sub host-url">
              Entrá a <b>code-ia-taller.vercel.app/jugar</b>
              <br />
              poné tu nombre y tocá <b>Unirme a la partida</b>
            </p>
            <p className="host-count">
              {players.length} {players.length === 1 ? "jugador" : "jugadores"} · tema {catLabel(game.cat)}
            </p>
            <div className="lobby-names is-big">
              {players.length === 0 && <span className="race-empty">Esperando jugadores…</span>}
              {players.map((p) => (
                <span key={p.name} className="lobby-name">
                  {p.name}
                </span>
              ))}
            </div>
            <div className="game-row" style={{ marginTop: 26 }}>
              <button
                type="button"
                className="btn btn-solid spotlight host-btn"
                onClick={() => setGame({ ...game, status: "playing" })}
                disabled={players.length === 0}
              >
                ▶ ¡Empezar!
              </button>
              <button type="button" className="btn" onClick={() => setGame(null)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* JUGANDO: el top en vivo */}
        {status === "playing" && game && (
          <>
            <h1 className="live-title">🏁 ¡A jugar!</h1>
            <p className="live-sub">
              {players.filter((p) => p.done).length} de {players.length} terminaron · tema {catLabel(game.cat)}
            </p>
            <LiveBoard players={players} connected={live.connected} big max={20} />
            <div className="game-row" style={{ marginTop: 20 }}>
              <button type="button" className="btn" onClick={() => setGame({ ...game, status: "ended" })}>
                🏆 Terminar y ver el podio
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
