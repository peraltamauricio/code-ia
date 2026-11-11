import Link from "next/link";
import Image from "next/image";

/** Barra de arriba para las páginas internas (/guia, /jugar). */
export default function SubNav({ links = [] }: { links?: { href: string; label: string }[] }) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <Image src="/logo.png" alt="" width={28} height={28} className="brand-mark" />
          CODE<span style={{ color: "var(--violet-soft)" }}>+IA</span>
        </Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {links.map((l) => (
            <Link key={l.href} className="btn nav-cta subnav-extra" href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link className="btn nav-cta" href="/">
            ← volver al sitio
          </Link>
        </div>
      </div>
    </header>
  );
}
