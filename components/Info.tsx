import type { CSSProperties } from "react";

export default function Info() {
  return (
    <section className="section" id="info">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="mono-tag">config.taller</span>
          <h2 className="section-title">Info del taller</h2>
        </div>
        <div className="info-grid reveal">
          <div className="info-card panel">
            <div className="ic">DURACIÓN</div>
            <h4>12 × 1h45</h4>
            <p>Clases presenciales, de principio a fin</p>
          </div>
          <div className="info-card panel">
            <div className="ic">PARA QUIÉN</div>
            <h4>14 a 18 años</h4>
            <p>Sin experiencia previa en programación</p>
          </div>
          <div className="info-card panel">
            <div className="ic">REQUISITOS</div>
            <h4>Ninguno</h4>
            <p>Las computadoras las ponemos nosotros</p>
          </div>
        </div>
        <div
          className="info-grid reveal"
          style={{ marginTop: 14, "--d": ".1s" } as CSSProperties}
        >
          <div className="info-card panel">
            <div className="ic">IA QUE USAMOS</div>
            <h4>Claude · ChatGPT · Gemini</h4>
            <p>Como copilotos de código, no como reemplazo</p>
          </div>
          <div className="info-card panel">
            <div className="ic">EDITOR</div>
            <h4>VS Code</h4>
            <p>El mismo que usan los devs de verdad</p>
          </div>
          <div className="info-card panel">
            <div className="ic">DEPLOY</div>
            <h4>Git + GitHub</h4>
            <p>Publicación en GitHub Pages o Vercel</p>
          </div>
        </div>
      </div>
    </section>
  );
}
