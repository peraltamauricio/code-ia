import Link from "next/link";

export default function Cta() {
  return (
    <section className="section" id="portal-cta">
      <div className="wrap">
        <div className="cta-panel panel reveal">
          <span className="mono-tag">portal.acceso</span>
          <h2>TU PROGRESO TE ESPERA</h2>
          <p>Entrá con tu nickname y contraseña para ver cómo vas y subir tus proyectos.</p>
          <Link className="btn btn-solid spotlight" href="/portal" style={{ justifyContent: "center" }}>
            Entrar al portal →
          </Link>
        </div>
      </div>
    </section>
  );
}
