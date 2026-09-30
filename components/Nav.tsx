"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/#niveles", label: "niveles" },
  { href: "/#clases", label: "clases" },
  { href: "/#metodo", label: "método" },
  { href: "/guia", label: "guía" },
  { href: "/alumnos", label: "alumnos" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">
          <Image src="/logo.png" alt="" width={28} height={28} className="brand-mark" priority />
          CODE<span style={{ color: "var(--violet-soft)" }}>+IA</span>
        </div>
        <nav className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a className="btn btn-solid nav-cta spotlight" href="/portal">
            Entrar al portal
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {open && (
        <div className="nav-mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a href="/portal" style={{ color: "var(--violet-soft)" }} onClick={() => setOpen(false)}>
            entrar al portal →
          </a>
        </div>
      )}
    </header>
  );
}
