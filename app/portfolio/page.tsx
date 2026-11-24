import type { Metadata } from "next";
import Link from "next/link";
import SubNav from "@/components/SubNav";
import PortfolioBuilder from "@/components/portfolio/PortfolioBuilder";
import DeploySteps from "@/components/portfolio/DeploySteps";

export const metadata: Metadata = {
  title: "Armá tu portfolio · CODE +IA",
  description: "Armá tu portfolio completando un formulario y subilo a internet.",
};

export default function PortfolioPage() {
  return (
    <>
      <div className="bg-grid" />
      <SubNav links={[{ href: "/guia", label: "📖 guía" }]} />

      <section className="section" style={{ borderTop: "none" }}>
        <div className="wrap">
          <div className="section-head center">
            <span className="mono-tag">portfolio.builder</span>
            <h2 className="section-title">Armá tu portfolio</h2>
            <p className="section-desc">
              Completá los 4 pasos y mirá cómo se arma tu portfolio en vivo. Cuando te guste, lo descargás y
              lo subís a internet.
            </p>
          </div>

          <PortfolioBuilder />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head center">
            <span className="mono-tag">deploy.netlify</span>
            <h2 className="section-title">Subilo a internet</h2>
            <p className="section-desc">
              Seguí este paso a paso con tu carpeta <b>portfolio/</b> lista. Para la muestra, también subí tu{" "}
              <b>index.html</b> al <Link href="/portal" style={{ color: "var(--violet-soft)" }}>portal</Link>.
            </p>
          </div>
          <DeploySteps id="deploy-netlify" />
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
