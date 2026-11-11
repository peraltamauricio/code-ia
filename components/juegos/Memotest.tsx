"use client";

import { useEffect, useState } from "react";
import { memoPairs } from "@/lib/juegos";
import { readBest, saveBest, shuffle } from "./util";

const PAIRS = 8;
const BEST_KEY = "codeia-memo-best";

type Card = { id: number; pair: number; text: string; code: boolean };

function newDeck(): Card[] {
  const chosen = shuffle(memoPairs).slice(0, PAIRS);
  const cards = chosen.flatMap((p, i) => [
    { pair: i, text: p.a, code: true },
    { pair: i, text: p.b, code: false },
  ]);
  return shuffle(cards).map((c, id) => ({ ...c, id }));
}

export default function Memotest() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [record, setRecord] = useState(false);

  // Se mezcla recién en el navegador (si se mezcla en el servidor, no coincide).
  useEffect(() => {
    setDeck(newDeck());
    setBest(readBest(BEST_KEY));
  }, []);

  const won = deck.length > 0 && found.length === PAIRS;

  function flip(card: Card) {
    if (open.length === 2 || open.includes(card.id) || found.includes(card.pair)) return;
    const nowOpen = [...open, card.id];
    setOpen(nowOpen);
    if (nowOpen.length < 2) return;

    const total = moves + 1;
    setMoves(total);
    const [a, b] = nowOpen.map((id) => deck.find((c) => c.id === id)!);
    if (a.pair === b.pair) {
      const nowFound = [...found, a.pair];
      setFound(nowFound);
      setOpen([]);
      if (nowFound.length === PAIRS) {
        setRecord(saveBest(BEST_KEY, total, true));
        setBest(readBest(BEST_KEY));
      }
    } else {
      setTimeout(() => setOpen([]), 900);
    }
  }

  function restart() {
    setDeck(newDeck());
    setOpen([]);
    setFound([]);
    setMoves(0);
    setRecord(false);
  }

  return (
    <div className="game-card panel">
      <div className="quiz-top">
        <span className="level-tag">ENCONTRÁ CADA CÓDIGO CON LO QUE HACE</span>
        <span className="quiz-score">
          {found.length}/{PAIRS} pares · {moves} movimientos
        </span>
      </div>

      {won ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div className="game-hero">{record ? "🏆" : "🎉"}</div>
          <h3 className="game-title">¡Completaste el memotest en {moves} movimientos!</h3>
          {record && <p className="game-record">¡Nuevo récord!</p>}
          {!record && best !== null && <p className="game-best">🏆 Tu récord: {best} movimientos</p>}
          <button type="button" className="btn btn-solid spotlight" onClick={restart}>
            Jugar otra vez
          </button>
        </div>
      ) : (
        <>
          <div className="memo-grid">
            {deck.map((c) => {
              const isUp = open.includes(c.id) || found.includes(c.pair);
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`memo-card${isUp ? " is-up" : ""}${found.includes(c.pair) ? " is-found" : ""}`}
                  onClick={() => flip(c)}
                  aria-label={isUp ? c.text : "Carta tapada"}
                >
                  <span className="memo-inner">
                    <span className="memo-back">?</span>
                    <span className={`memo-front${c.code ? " is-code" : ""}`}>{c.text}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="game-row" style={{ marginTop: 16 }}>
            <button type="button" className="btn" onClick={restart}>
              ↻ Mezclar de nuevo
            </button>
            {best !== null && <span className="game-best">🏆 Récord: {best} movimientos</span>}
          </div>
        </>
      )}
    </div>
  );
}
