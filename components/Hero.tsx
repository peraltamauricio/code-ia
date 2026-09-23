import Link from "next/link";
import HeroParticles from "./HeroParticles";
import CodeDemo from "./CodeDemo";

export default function Hero() {
  return (
    <section className="hero">
      <HeroParticles />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="dot pulse" /> TALLER DE PROGRAMACIÓN E INTELIGENCIA ARTIFICIAL
          </div>
          <h1 className="title">
            Programá tu primer
            <br />
            sitio con <span className="accent">IA</span> como copiloto
          </h1>
          <p className="subtitle">
            Perdé el miedo a la tecnología, aprendé a pensar como developer y construí tu propio
            sitio web usando Claude, ChatGPT y Gemini. Teoría, ejercicios y un lugar para subir
            tus propios proyectos, clase a clase.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-solid spotlight" href="/portal">
              Entrar al portal
            </Link>
            <a className="btn" href="#clases">
              Ver clases
            </a>
          </div>
        </div>
        <div className="code-demo-stack" aria-hidden="true">
          <pre className="code-ghost code-ghost-1">
            <code>{`git commit -m "listo"\nnpm run deploy\n✓ publicado`}</code>
          </pre>
          <pre className="code-ghost code-ghost-2">
            <code>{`const ia = usar("claude")\nia.ayuda("mi css")\n// generando...`}</code>
          </pre>
          <CodeDemo />
        </div>
      </div>
    </section>
  );
}
