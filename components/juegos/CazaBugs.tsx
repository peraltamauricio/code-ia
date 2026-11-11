"use client";

import { useState } from "react";
import { bugs } from "@/lib/juegos";
import { readBest, saveBest } from "./util";

const BEST_KEY = "codeia-bugs-best";
const LANG_LABEL = { html: "index.html", css: "style.css", js: "script.js" };

export default function CazaBugs() {
  const [idx, setIdx] = useState(0);
  const [tries, setTries] = useState<number[]>([]); // líneas que ya tocó en este bug
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [record, setRecord] = useState(false);

  const bug = bugs[idx];
  const solved = tries.includes(bug.bad);

  function pick(line: number) {
    if (solved || tries.includes(line)) return;
    setTries((t) => [...t, line]);
    if (line === bug.bad && tries.length === 0) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 >= bugs.length) {
      setRecord(saveBest(BEST_KEY, score));
      setDone(true);
      return;
    }
    setIdx((n) => n + 1);
    setTries([]);
  }

  function restart() {
    setIdx(0);
    setTries([]);
    setScore(0);
    setDone(false);
    setRecord(false);
  }

  if (done) {
    const best = readBest(BEST_KEY);
    return (
      <div className="game-card panel">
        <div className="game-hero">🐛</div>
        <h3 className="game-title">
          Cazaste {score} de {bugs.length} bugs al primer intento
        </h3>
        <p className="game-desc">
          Los errores son parte de programar. Lo importante es saber dónde mirar: el nombre de
          la etiqueta, el punto de la clase, el punto y coma, las mayúsculas.
        </p>
        {record ? (
          <p className="game-record">¡Nuevo récord!</p>
        ) : (
          best !== null && <p className="game-best">🏆 Tu récord: {best}</p>
        )}
        <button type="button" className="btn btn-solid spotlight" onClick={restart}>
          Jugar otra vez
        </button>
      </div>
    );
  }

  return (
    <div className="game-card panel">
      <div className="quiz-top">
        <span className="level-tag">
          BUG {idx + 1}/{bugs.length}
        </span>
        <span className="quiz-score">🐛 {score} cazados</span>
      </div>
      <h3 className="quiz-q">“{bug.title}”</h3>
      <p className="game-desc" style={{ marginTop: -6 }}>
        Tocá la línea que tiene el error.
      </p>

      <div className="bug-editor">
        <div className="bug-editor-bar">
          <span className="code-dot" />
          <span className="code-dot" />
          <span className="code-dot" />
          <span className="code-demo-path">{LANG_LABEL[bug.lang]}</span>
        </div>
        {bug.lines.map((line, i) => {
          let cls = "bug-line";
          if (tries.includes(i)) cls += i === bug.bad ? " is-ok" : " is-bad";
          return (
            <button key={i} type="button" className={cls} onClick={() => pick(i)} disabled={solved}>
              <span className="bug-num">{i + 1}</span>
              <code>{line}</code>
            </button>
          );
        })}
      </div>

      {tries.length > 0 && !solved && (
        <p className="quiz-why">Esa línea está bien. ¡Seguí buscando! 🔍</p>
      )}

      {solved && (
        <div className="quiz-why is-ok">
          <strong>{tries.length === 1 ? "¡Bug cazado! " : "¡Ahí estaba! "}</strong>
          {bug.why}
          {bug.fix && (
            <pre className="guide-code" style={{ marginTop: 10 }}>
              <code>{`✓ ${bug.fix.trim()}`}</code>
            </pre>
          )}
          <div style={{ marginTop: 12 }}>
            <button type="button" className="btn btn-solid" onClick={next}>
              {idx + 1 >= bugs.length ? "Ver resultado" : "Siguiente bug →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
