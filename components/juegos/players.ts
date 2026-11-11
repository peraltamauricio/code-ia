"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Player = { id: string; nickname: string; name: string };
export type ScoreRow = { nickname: string; score: number; hits: number; total: number; cat: string; created_at: string };

/** Quién está jugando (si entró al portal). null = no logueado. */
export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!supabase) return setReady(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("id, nickname, name")
          .eq("id", session.user.id)
          .single();
        if (alive && data) setPlayer(data as Player);
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { player, ready };
}

/** Guarda una partida del quiz. Devuelve false si no se pudo. */
export async function saveScore(p: Player, score: number, hits: number, total: number, cat: string) {
  if (!supabase) return false;
  const { error } = await supabase
    .from("quiz_scores")
    .insert({ user_id: p.id, nickname: p.nickname, score, hits, total, cat });
  return !error;
}

/** El mejor puntaje de cada alumno, ordenado de mayor a menor. Con `since`, solo partidas desde esa fecha. */
export async function loadRanking(since?: Date): Promise<ScoreRow[] | null> {
  if (!supabase) return null;
  let query = supabase
    .from("quiz_scores")
    .select("nickname, score, hits, total, cat, created_at")
    .order("score", { ascending: false })
    .limit(500);
  if (since) query = query.gte("created_at", since.toISOString());
  const { data, error } = await query;
  if (error || !data) return null;
  const best = new Map<string, ScoreRow>();
  for (const row of data as ScoreRow[]) {
    if (!best.has(row.nickname)) best.set(row.nickname, row);
  }
  return Array.from(best.values());
}
