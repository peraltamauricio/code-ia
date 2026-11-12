"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

// PARTIDA EN VIVO (tipo Kahoot), con Supabase Realtime "presence".
// - El profe abre /ranking, crea una partida y la anuncia en la sala.
// - Los alumnos en /jugar ven la partida, se unen y esperan.
// - Cuando el profe toca "Empezar", a todos les toca las MISMAS preguntas
//   en el mismo orden, y cada uno manda sus puntos pregunta por pregunta.
// No se guarda nada en la base: si alguien cierra la pestaña, sale de la sala.

const ROOM = "quiz-en-vivo";

export type GameItem = { i: number; order: number[] };

export type Game = {
  id: string;
  /** Para elegir la más nueva si hubiera dos. */
  createdAt: number;
  cat: string;
  /** Las preguntas: índice dentro de `quiz` y el orden de las opciones. */
  items: GameItem[];
  status: "lobby" | "playing" | "ended";
};

export type LiveState = {
  name: string;
  gameId: string;
  score: number;
  /** Preguntas ya contestadas. */
  q: number;
  total: number;
  streak: number;
  done: boolean;
  /** Si la última respuesta fue correcta (para el ✓/✗ en pantalla). */
  last: "ok" | "bad" | null;
};

type Meta = ({ kind: "player" } & LiveState) | { kind: "host"; game: Game | null };

/**
 * Se conecta a la sala.
 * - `key` = cómo me identifico (el nombre del alumno, o "profe-xxx").
 *   Con `key` null solo miro (veo si hay partida, pero no aparezco).
 * Devuelve la partida actual, los jugadores de ESA partida y `send` para avisar mi estado.
 */
export function useLive(key: string | null) {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [connected, setConnected] = useState(false);
  const channel = useRef<RealtimeChannel | null>(null);
  const joined = useRef(false);
  const pending = useRef<Meta | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const presenceKey = key ?? `mira-${Math.random().toString(36).slice(2)}`;
    const ch = supabase.channel(ROOM, { config: { presence: { key: presenceKey } } });

    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState<Meta>();
      const list = Object.values(state)
        .map((m) => m[m.length - 1])
        .filter((m): m is typeof m & Meta => !!m && (m.kind === "player" || m.kind === "host"));
      setMetas(list);
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
  }, [key]);

  /** Manda mi estado a la sala (si todavía no conectó, lo manda apenas conecte). */
  const send = useCallback((m: Meta) => {
    pending.current = m;
    if (joined.current && channel.current) channel.current.track(m).catch(() => {});
  }, []);

  // La partida vigente: la más nueva que esté anunciando algún profe.
  let game: Game | null = null;
  for (const m of metas) {
    if (m.kind === "host" && m.game && (!game || m.game.createdAt > game.createdAt)) game = m.game;
  }

  const players = metas
    .filter((m): m is { kind: "player" } & LiveState => m.kind === "player" && !!game && m.gameId === game.id)
    .sort((a, b) => b.score - a.score || b.q - a.q);

  return { game, players, connected, send };
}
