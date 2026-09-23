export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">
          <div className="brand-mark">+</div>
          CODE<span style={{ color: "var(--violet-soft)" }}>+IA</span>
        </div>
        <nav className="nav-links">
          <a href="#niveles">niveles</a>
          <a href="#clases">clases</a>
          <a href="#metodo">método</a>
        </nav>
        <a className="btn btn-solid nav-cta spotlight" href="/portal">
          Entrar al portal
        </a>
      </div>
    </header>
  );
}
