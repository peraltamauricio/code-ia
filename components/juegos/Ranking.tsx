"use client";

import { useCallback, useEffect, useState } from "react";
import { QUIZ_CATS } from "@/lib/juegos";
import { loadRanking, ScoreRow } from "./players";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Ranking({ me, refreshKey }: { me?: string; refreshKey: number }) {
  const [rows, setRows] = useState<ScoreRow[] | null | undefined>(undefined);

  // Si Supabase no contesta en 10 segundos, mostramos el aviso en vez de "Cargando…" para siempre.
  const load = useCallback(async () => {
    setRows(undefined);
    const timeout = new Promise<null>((r) => setTimeout(() => r(null), 10000));
    try {
      setRows(await Promise.race([loadRanking(), timeout]));
    } catch {
      setRows(null);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  // Si la tabla del ranking histórico no existe (o no carga), no mostramos nada.
  if (rows === null) return null;

  return (
    <div className="rank panel">
      <div className="rank-head">
        <h3 className="rank-title">🏆 Mejores puntajes</h3>
        <button type="button" className="btn" style={{ padding: "8px 16px", fontSize: 12 }} onClick={load}>
          ↻ actualizar
        </button>
      </div>
      {rows === undefined && <p className="rank-empty">Cargando…</p>}
      {rows && rows.length === 0 && (
        <p className="rank-empty">Nadie jugó todavía. ¡Sé el primero en el ranking!</p>
      )}
      {rows && rows.length > 0 && (
        <ol className="rank-list">
          {rows.slice(0, 15).map((r, i) => (
            <li key={r.nickname} className={`rank-row${r.nickname === me ? " is-me" : ""}`}>
              <span className="rank-pos">{MEDALS[i] ?? i + 1}</span>
              <span className="rank-name">
                {r.nickname}
                {r.nickname === me && " (vos)"}
              </span>
              <span className="rank-meta">
                {r.hits}/{r.total} · {QUIZ_CATS.find((c) => c.key === r.cat)?.label ?? r.cat}
              </span>
              <span className="rank-score">{r.score} pts</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
