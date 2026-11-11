"use client";

import Link from "next/link";
import Image from "next/image";
import LiveBoard from "@/components/juegos/LiveBoard";
import Ranking from "@/components/juegos/Ranking";
import { useLive } from "@/components/juegos/live";

// Pantalla para PROYECTAR en clase: muestra la carrera del quiz en vivo.
// Solo mira (no juega), así que no aparece en la lista.
export default function RankingPage() {
  const { players, connected } = useLive(null);

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
            <span className="live-dot" /> EN VIVO
          </div>
        </header>

        <h1 className="live-title">🏆 Competencia del quiz</h1>
        <p className="live-sub">
          Entrá a <b>code-ia-taller.vercel.app/jugar</b>, poné tu nombre y tocá <b>¡Jugar!</b>
        </p>

        <LiveBoard players={players} connected={connected} big max={20} />
        <Ranking refreshKey={0} />
      </main>
    </>
  );
}
