"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

// Competencia en vivo: todos los que juegan el quiz se conectan a la misma
// "sala" (Supabase Realtime, presence) y mandan sus puntos pregunta por pregunta.
// No guarda nada en la base: cuando alguien cierra la pestaña, sale de la sala.

const ROOM = "quiz-en-vivo";

export type LiveState = {
  name: string;
  score: number;
  /** Preguntas ya contestadas. */
  q: number;
  total: number;
  streak: number;
  done: boolean;
  /** Si la última respuesta fue correcta (para el ✓/✗ en pantalla). */
  last: "ok" | "bad" | null;
};

/**
 * Se conecta a la sala. Con `name` juega (aparece en la carrera);
 * sin `name` solo mira (por ejemplo, la pantalla del proyector).
 */
export function useLive(name: string | null) {
  const [players, setPlayers] = useState<LiveState[]>([]);
  const [connected, setConnected] = useState(false);
  const channel = useRef<RealtimeChannel | null>(null);
  const joined = useRef(false);
  const pending = useRef<LiveState | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const key = name ?? `mira-${Math.random().toString(36).slice(2)}`;
    const ch = supabase.channel(ROOM, { config: { presence: { key } } });

    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState<LiveState>();
      const list = Object.values(state)
        .map((metas) => metas[metas.length - 1])
        .filter((p): p is typeof p & LiveState => !!p && typeof p.name === "string");
      list.sort((a, b) => b.score - a.score || b.q - a.q);
      setPlayers(list);
    });

    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        joined.current = true;
        setConnected(true);
        if (pending.current) ch.track(pending.current).catch(() => {});
      } else if (status === "CLOSED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        joined.current = false;
        setConnected(false);
      }
    });
    channel.current = ch;

    return () => {
      joined.current = false;
      channel.current = null;
      setConnected(false);
      supabase?.removeChannel(ch);
    };
  }, [name]);

  /** Manda mi estado a la sala (si todavía no conectó, lo manda apenas conecte). */
  const update = useCallback((s: LiveState) => {
    pending.current = s;
    if (joined.current && channel.current) channel.current.track(s).catch(() => {});
  }, []);

  return { players, connected, update };
}
