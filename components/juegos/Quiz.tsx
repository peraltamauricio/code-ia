"use client";

import { useEffect, useState } from "react";
import { quiz, QUIZ_CATS, QuizCat, QuizQ } from "@/lib/juegos";
import Link from "next/link";
import { readBest, saveBest, shuffle } from "./util";
import { saveScore, usePlayer } from "./players";
import Ranking from "./Ranking";
import LiveBoard from "./LiveBoard";
import { useLive } from "./live";

const ROUND = 10;
const SECONDS = 30;
const BEST_KEY = "codeia-quiz-best";
const NAME_KEY = "codeia-nombre";

type Q = QuizQ & { order: number[] };

export default function Quiz() {
  const [phase, setPhase] = useState<"menu" | "play" | "end">("menu");
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
  const [saved, setSaved] = useState<"no" | "ok" | "error">("no");
  const [refresh, setRefresh] = useState(0);
  // Nombre para la carrera en vivo: el nickname si entró al portal, si no el que escriba.
  const [guestName, setGuestName] = useState("");
  const [liveName, setLiveName] = useState<string | null>(null);
  const live = useLive(liveName);

  useEffect(() => {
    setBest(readBest(BEST_KEY));
    try {
      setGuestName(localStorage.getItem(NAME_KEY) ?? "");
    } catch {
      /* sin nombre guardado */
    }
  }, []);

  const myName = player?.nickname ?? guestName.trim().toLowerCase().slice(0, 16);

  // Cada vez que cambia algo de mi partida, se lo mando a la sala en vivo.
  const { update } = live;
  useEffect(() => {
    if (!liveName || phase === "menu") return;
    const answered = idx + (picked !== null ? 1 : 0);
    update({
      name: liveName,
      score,
      q: phase === "end" ? qs.length : answered,
      total: qs.length,
      streak,
      done: phase === "end",
      last: picked === null ? null : picked === qs[idx]?.ok ? "ok" : "bad",
    });
  }, [liveName, phase, score, idx, picked, streak, qs, update]);

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

  function start() {
    if (!myName) return;
    if (!player) {
      try {
        localStorage.setItem(NAME_KEY, myName);
      } catch {
        /* no pasa nada */
      }
    }
    setLiveName(myName);
    const pool = cat === "todo" ? quiz : quiz.filter((q) => q.cat === cat);
    const round = shuffle(pool)
      .slice(0, ROUND)
      .map((q) => ({ ...q, order: shuffle(q.opts.map((_, i) => i)) }));
    setQs(round);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setHits(0);
    setStreak(0);
    setTime(SECONDS);
    setRecord(false);
    setSaved("no");
    setPhase("play");
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
        saveScore(player, score, hits, qs.length, cat).then((ok) => {
          setSaved(ok ? "ok" : "error");
          setRefresh((n) => n + 1);
        });
      }
      return;
    }
    setIdx((n) => n + 1);
    setPicked(null);
    setTime(SECONDS);
  }

  if (phase === "menu") {
    return (
      <>
      <div className="game-card panel">
        <div className="game-hero">🧠</div>
        <h3 className="game-title">Quiz CODE+IA</h3>
        <p className="game-desc">
          {ROUND} preguntas, {SECONDS} segundos cada una. Sumás más puntos si contestás rápido y
          si encadenás respuestas correctas 🔥
        </p>
        {ready && (
          <p className="game-player">
            {player ? (
              <>
                Jugando como <b>{player.nickname}</b> · aparecés en la carrera en vivo 🏁
              </>
            ) : (
              <>
                <input
                  className="game-name"
                  placeholder="Escribí tu nombre"
                  maxLength={16}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  aria-label="Tu nombre para la carrera en vivo"
                />
                <br />
                o <Link href="/portal" style={{ color: "var(--violet-soft)" }}>entrá al portal</Link> con tu usuario.
              </>
            )}
          </p>
        )}
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
        <button type="button" className="btn btn-solid spotlight" onClick={start} disabled={!myName}>
          ¡Jugar!
        </button>
        {ready && !myName && <p className="game-best">Escribí tu nombre para jugar</p>}
        {best !== null && <p className="game-best">🏆 Tu récord en esta compu: {best} puntos</p>}
      </div>
      <LiveBoard players={live.players} connected={live.connected} me={liveName} />
      <Ranking me={player?.nickname} refreshKey={refresh} />
      </>
    );
  }

  if (phase === "end") {
    const msg =
      hits === qs.length
        ? "¡Perfecto! Sos un crack 🏆"
        : hits >= qs.length * 0.7
          ? "¡Muy bien! Estás listo/a para la próxima clase 💪"
          : hits >= qs.length * 0.4
            ? "Bien ahí. Repasá la guía y volvé a intentar 📖"
            : "Arrancamos de a poco. Mirá la guía y probá de nuevo 🙌";
    return (
      <>
      <div className="game-card panel">
        <div className="game-hero">{record ? "🏆" : "🎯"}</div>
        <h3 className="game-title">{score} puntos</h3>
        <p className="game-desc">
          {hits} de {qs.length} correctas. {msg}
        </p>
        {record && <p className="game-record">¡Nuevo récord!</p>}
        {!record && best !== null && <p className="game-best">🏆 Tu récord: {best} puntos</p>}
        {saved === "ok" && <p className="game-player">✓ Guardado en el ranking como <b>{player?.nickname}</b></p>}
        <div className="game-row">
          <button type="button" className="btn btn-solid spotlight" onClick={start}>
            Jugar otra vez
          </button>
          <button type="button" className="btn" onClick={() => setPhase("menu")}>
            Cambiar tema
          </button>
        </div>
      </div>
      <LiveBoard players={live.players} connected={live.connected} me={liveName} />
      <Ranking me={player?.nickname} refreshKey={refresh} />
      </>
    );
  }

  const q = qs[idx];
  const answered = picked !== null;
  return (
    <>
    <div className="game-card panel">
      <div className="quiz-top">
        <span className="level-tag">
          PREGUNTA {idx + 1}/{qs.length}
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
    </div>
    <LiveBoard players={live.players} connected={live.connected} me={liveName} max={8} />
    </>
  );
}
