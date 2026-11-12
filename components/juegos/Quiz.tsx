"use client";

import { useEffect, useState } from "react";
import { quiz, QUIZ_CATS, QuizCat, QuizQ } from "@/lib/juegos";
import { readBest, saveBest, shuffle } from "./util";
import { saveScore, usePlayer } from "./players";
import Ranking from "./Ranking";
import LiveBoard from "./LiveBoard";
import { Game, useLive } from "./live";

const ROUND = 10;
const SECONDS = 30;
const BEST_KEY = "codeia-quiz-best";
const NAME_KEY = "codeia-nombre";

type Q = QuizQ & { order: number[] };
type Phase = "menu" | "lobby" | "play" | "end";

/** Arma las preguntas de una partida en vivo (iguales para todos). */
function questionsFromGame(game: Game): Q[] {
  return game.items.filter((it) => quiz[it.i]).map((it) => ({ ...quiz[it.i], order: it.order }));
}

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [cat, setCat] = useState<QuizCat | "todo">("todo");
  const [qs, setQs] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null); // índice original elegido, -1 = se acabó el tiempo
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(SECONDS);
  const [best, setBest] = useState<number | null>(null);
  const [record, setRecord] = useState(false);
  const { player, ready } = usePlayer();
  const [saved, setSaved] = useState(false);
  const [refresh, setRefresh] = useState(0);

  // Partida en vivo
  const [guestName, setGuestName] = useState("");
  const [liveName, setLiveName] = useState<string | null>(null); // con qué nombre me uní
  const [gameId, setGameId] = useState<string | null>(null); // a qué partida me uní (null = práctica)
  const live = useLive(liveName);
  const game = live.game && live.game.status !== "ended" ? live.game : null;
  const inGame = gameId !== null;

  useEffect(() => {
    setBest(readBest(BEST_KEY));
    try {
      setGuestName(localStorage.getItem(NAME_KEY) ?? "");
    } catch {
      /* sin nombre guardado */
    }
  }, []);

  const myName = player?.nickname ?? guestName.trim().toLowerCase().slice(0, 16);

  function resetRound(round: Q[]) {
    setQs(round);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setHits(0);
    setStreak(0);
    setTime(SECONDS);
    setRecord(false);
    setSaved(false);
  }

  // Unirme a la partida en vivo.
  function join() {
    if (!myName || !live.game) return;
    if (!player) {
      try {
        localStorage.setItem(NAME_KEY, myName);
      } catch {
        /* no pasa nada */
      }
    }
    setLiveName(myName);
    setGameId(live.game.id);
    resetRound(questionsFromGame(live.game));
    setPhase(live.game.status === "playing" ? "play" : "lobby");
  }

  // Lo que hace el profe se refleja solo: arrancar, o una partida nueva.
  useEffect(() => {
    if (!inGame) return;
    const g = live.game;
    if (!g) return;
    if (g.id !== gameId && (phase === "lobby" || phase === "end")) {
      // El profe creó una partida nueva: me paso a esa.
      setGameId(g.id);
      resetRound(questionsFromGame(g));
      setPhase(g.status === "playing" ? "play" : "lobby");
    } else if (g.id === gameId && g.status === "playing" && phase === "lobby") {
      setPhase("play"); // ¡arrancó!
    }
  }, [live.game, inGame, gameId, phase]);

  // Le aviso a la sala cómo voy.
  const { send } = live;
  useEffect(() => {
    if (!liveName || !gameId || phase === "menu") return;
    send({
      kind: "player",
      name: liveName,
      gameId,
      score,
      q: phase === "end" ? qs.length : phase === "lobby" ? 0 : idx + (picked !== null ? 1 : 0),
      total: qs.length,
      streak,
      done: phase === "end",
      last: phase !== "play" || picked === null ? null : picked === qs[idx]?.ok ? "ok" : "bad",
    });
  }, [liveName, gameId, phase, score, idx, picked, streak, qs, send]);

  // Reloj de cada pregunta.
  useEffect(() => {
    if (phase !== "play" || picked !== null) return;
    if (time <= 0) {
      setPicked(-1);
      setStreak(0);
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, picked, time]);

  // Práctica sola (sin partida en vivo).
  function startSolo() {
    setLiveName(null);
    setGameId(null);
    const pool = cat === "todo" ? quiz : quiz.filter((q) => q.cat === cat);
    resetRound(
      shuffle(pool)
        .slice(0, ROUND)
        .map((q) => ({ ...q, order: shuffle(q.opts.map((_, i) => i)) }))
    );
    setPhase("play");
  }

  function leave() {
    setLiveName(null);
    setGameId(null);
    setPhase("menu");
  }

  function answer(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === qs[idx].ok) {
      setHits((h) => h + 1);
      setScore((s) => s + 100 + time * 5 + streak * 20);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  }

  function next() {
    if (idx + 1 >= qs.length) {
      setRecord(saveBest(BEST_KEY, score));
      setBest(readBest(BEST_KEY));
      setPhase("end");
      if (player) {
        saveScore(player, score, hits, qs.length, inGame ? "vivo" : cat).then((ok) => {
          setSaved(ok);
          setRefresh((n) => n + 1);
        });
      }
      return;
    }
    setIdx((n) => n + 1);
    setPicked(null);
    setTime(SECONDS);
  }

  const board = inGame ? (
    <LiveBoard players={live.players} connected={live.connected} me={liveName} max={phase === "play" ? 8 : 20} />
  ) : null;

  // ---------------- MENÚ ----------------
  if (phase === "menu") {
    return (
      <>
        {game && (
          <div className="game-card panel live-invite">
            <div className="live-badge" style={{ margin: "0 auto 10px", width: "fit-content" }}>
              <span className="live-dot" /> PARTIDA EN VIVO
            </div>
            <h3 className="game-title">¡El profe abrió una partida!</h3>
            <p className="game-desc">
              Todos juegan las mismas {game.items.length} preguntas y se ve el top en vivo.
              {game.status === "playing" && " Ya arrancó, ¡pero todavía podés entrar!"}
            </p>
            {ready && (
              <p className="game-player">
                {player ? (
                  <>
                    Vas a jugar como <b>{player.nickname}</b>
                  </>
                ) : (
                  <input
                    className="game-name"
                    placeholder="Escribí tu nombre"
                    maxLength={16}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    aria-label="Tu nombre para la partida"
                  />
                )}
              </p>
            )}
            <button type="button" className="btn btn-solid spotlight" onClick={join} disabled={!myName}>
              🎮 Unirme a la partida
            </button>
            {ready && !myName && <p className="game-best">Escribí tu nombre para unirte</p>}
          </div>
        )}

        <div className="game-card panel" style={game ? { marginTop: 20 } : undefined}>
          <div className="game-hero">🧠</div>
          <h3 className="game-title">{game ? "O practicá solo/a" : "Quiz CODE+IA"}</h3>
          <p className="game-desc">
            {ROUND} preguntas, {SECONDS} segundos cada una. Sumás más puntos si contestás rápido y si
            encadenás respuestas correctas 🔥
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
          <button type="button" className={`btn${game ? "" : " btn-solid spotlight"}`} onClick={startSolo}>
            {game ? "Practicar" : "¡Jugar!"}
          </button>
          {best !== null && <p className="game-best">🏆 Tu récord en esta compu: {best} puntos</p>}
          {!game && (
            <p className="game-player" style={{ marginTop: 14 }}>
              Cuando el profe abra una partida en vivo, aparece acá arriba.
            </p>
          )}
        </div>
        <Ranking me={player?.nickname} refreshKey={refresh} />
      </>
    );
  }

  // ---------------- SALA DE ESPERA ----------------
  if (phase === "lobby") {
    const stillThere = live.game && live.game.id === gameId;
    return (
      <>
        <div className="game-card panel">
          <div className="game-hero">{stillThere ? "⏳" : "😕"}</div>
          {stillThere ? (
            <>
              <h3 className="game-title">¡Estás adentro, {liveName}!</h3>
              <p className="game-desc">
                Esperando que el profe arranque la partida… Mirá el proyector. Somos{" "}
                <b>{live.players.length}</b> jugando.
              </p>
              <div className="lobby-names">
                {live.players.map((p) => (
                  <span key={p.name} className={`lobby-name${p.name === liveName ? " is-me" : ""}`}>
                    {p.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="game-title">La partida se cerró</h3>
              <p className="game-desc">El profe cerró la partida. Esperá que abra otra.</p>
            </>
          )}
          <button type="button" className="btn" onClick={leave} style={{ marginTop: 16 }}>
            Salir
          </button>
        </div>
      </>
    );
  }

  // ---------------- RESULTADO ----------------
  if (phase === "end") {
    const pos = inGame ? live.players.findIndex((p) => p.name === liveName) + 1 : 0;
    const msg =
      hits === qs.length
        ? "¡Perfecto! Sos un crack 🏆"
        : hits >= qs.length * 0.7
          ? "¡Muy bien! 💪"
          : hits >= qs.length * 0.4
            ? "Bien ahí. Repasá la guía y volvé a intentar 📖"
            : "Arrancamos de a poco. Mirá la guía y probá de nuevo 🙌";
    return (
      <>
        <div className="game-card panel">
          <div className="game-hero">{pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "🎯"}</div>
          <h3 className="game-title">{score} puntos</h3>
          {pos > 0 && (
            <p className="game-record" style={{ animation: "none" }}>
              Vas {pos}º de {live.players.length}
            </p>
          )}
          <p className="game-desc">
            {hits} de {qs.length} correctas. {msg}
          </p>
          {!inGame && record && <p className="game-record">¡Nuevo récord!</p>}
          {saved && (
            <p className="game-player">
              ✓ Guardado en el ranking como <b>{player?.nickname}</b>
            </p>
          )}
          <div className="game-row">
            {inGame ? (
              <>
                <span className="game-player" style={{ margin: 0 }}>
                  Esperá la próxima partida del profe 👀
                </span>
                <button type="button" className="btn" onClick={leave}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-solid spotlight" onClick={startSolo}>
                  Jugar otra vez
                </button>
                <button type="button" className="btn" onClick={leave}>
                  Cambiar tema
                </button>
              </>
            )}
          </div>
        </div>
        {board}
      </>
    );
  }

  // ---------------- JUGANDO ----------------
  const q = qs[idx];
  const answered = picked !== null;
  return (
    <>
      <div className="game-card panel">
        <div className="quiz-top">
          <span className="level-tag">
            {inGame && "🔴 EN VIVO · "}PREGUNTA {idx + 1}/{qs.length}
          </span>
          <span className="quiz-score">
            {streak >= 2 && <span className="quiz-streak">🔥 x{streak}</span>}
            {score} pts
          </span>
        </div>
        <div className="quiz-timer">
          <div
            className={`quiz-timer-fill${time <= 5 ? " is-low" : ""}`}
            style={{ width: `${(time / SECONDS) * 100}%` }}
          />
        </div>
        <h3 className="quiz-q">{q.q}</h3>
        <div className="quiz-opts">
          {q.order.map((i, pos) => {
            let cls = "quiz-opt";
            if (answered && i === q.ok) cls += " is-ok";
            else if (answered && i === picked) cls += " is-bad";
            return (
              <button key={i} type="button" className={cls} onClick={() => answer(i)} disabled={answered}>
                <span className="quiz-letter">{"ABCD"[pos]}</span>
                <code>{q.opts[i]}</code>
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`quiz-why${picked === q.ok ? " is-ok" : ""}`}>
            <strong>
              {picked === q.ok ? "¡Correcto! " : picked === -1 ? "⏰ ¡Se acabó el tiempo! " : "Casi. "}
            </strong>
            {q.why}
            <div style={{ marginTop: 12 }}>
              <button type="button" className="btn btn-solid" onClick={next}>
                {idx + 1 >= qs.length ? "Ver resultado" : "Siguiente →"}
              </button>
            </div>
          </div>
        )}
        {!inGame && (
          <p className="game-player" style={{ marginTop: 14, marginBottom: 0 }}>
            Modo práctica ·{" "}
            <button type="button" className="logout-link" onClick={leave} style={{ fontSize: 13 }}>
              salir
            </button>
          </p>
        )}
      </div>
      {board}
    </>
  );
}
