export default function StatusBar() {
  return (
    <section className="section" style={{ paddingTop: 0, borderTop: "none" }}>
      <div className="wrap">
        <div className="status-bar reveal">
          <div className="status-item">
            <div className="val" data-count-to={12}>
              0
            </div>
            <div className="lbl">CLASES</div>
          </div>
          <div className="status-item">
            <div className="val">1H45</div>
            <div className="lbl">DURACIÓN</div>
          </div>
          <div className="status-item">
            <div className="val">14-18</div>
            <div className="lbl">EDAD</div>
          </div>
          <div className="status-item">
            <div className="val">PRESENCIAL</div>
            <div className="lbl">MODALIDAD</div>
          </div>
        </div>
      </div>
    </section>
  );
}
