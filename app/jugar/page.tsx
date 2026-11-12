"use client";

import { useState } from "react";
import SubNav from "@/components/SubNav";
import Quiz from "@/components/juegos/Quiz";
import Memotest from "@/components/juegos/Memotest";
import CazaBugs from "@/components/juegos/CazaBugs";
import EditorVivo from "@/components/juegos/EditorVivo";

const GAMES = [
  { key: "quiz", icon: "🧠", label: "Quiz", desc: "Preguntas contra reloj" },
  { key: "memo", icon: "🃏", label: "Memotest", desc: "Código ↔ qué hace" },
  { key: "bugs", icon: "🐛", label: "Cazá el bug", desc: "Encontrá el error" },
  { key: "editor", icon: "🧪", label: "Editor en vivo", desc: "Probá código al toque" },
] as const;

type GameKey = (typeof GAMES)[number]["key"];

export default function JugarPage() {
  const [game, setGame] = useState<GameKey>("quiz");

  return (
    <>
      <div className="bg-grid" />
      <SubNav links={[{ href: "/guia", label: "📖 guía" }]} />

      <section className="section" style={{ borderTop: "none" }}>
        <div className="wrap">
          <div className="section-head center">
            <span className="mono-tag">zona.de.juegos</span>
            <h2 className="section-title">Repasá jugando</h2>
            <p className="section-desc">
              HTML, CSS y JavaScript en modo juego. Poné tu nombre en el quiz y competí en vivo
              con todo el grupo: ¿quién saca más puntos?
            </p>
          </div>

          <div className="game-picker">
            {GAMES.map((g) => (
              <button
                key={g.key}
                type="button"
                className={`game-pick panel${game === g.key ? " is-active" : ""}`}
                onClick={() => setGame(g.key)}
              >
                <span className="game-pick-icon">{g.icon}</span>
                <span className="game-pick-label">{g.label}</span>
                <span className="game-pick-desc">{g.desc}</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            {game === "quiz" && <Quiz />}
            {game === "memo" && <Memotest />}
            {game === "bugs" && <CazaBugs />}
            {game === "editor" && <EditorVivo />}
          </div>
        </div>
      </section>

      <footer>
        <span className="brand-mini">
          CODE<span style={{ color: "var(--violet-soft)" }}>+IA</span>
        </span>
        hecho con IA, para la próxima generación de programadores
      </footer>
    </>
  );
}
