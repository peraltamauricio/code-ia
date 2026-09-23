import Link from "next/link";
import { supabaseAdmin, supabaseAdminConfigured } from "@/lib/supabaseAdmin";

export const revalidate = 0;

type StudentPage = {
  id: string;
  nickname: string;
  name: string;
  url: string | null;
  fileCount: number;
};

async function getStudents(): Promise<StudentPage[]> {
  if (!supabaseAdminConfigured || !supabaseAdmin) return [];

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, nickname, name")
    .eq("role", "student")
    .order("nickname");

  if (!profiles || profiles.length === 0) return [];

  return Promise.all(
    profiles.map(async (p) => {
      const { data: files } = await supabaseAdmin!.storage.from("projects").list(p.id);
      const real = (files || []).filter((f) => f.name !== ".emptyFolderPlaceholder");
      const hasIndex = real.some((f) => f.name.toLowerCase() === "index.html");
      const url = hasIndex
        ? supabaseAdmin!.storage.from("projects").getPublicUrl(`${p.id}/index.html`).data.publicUrl
        : null;
      return { id: p.id, nickname: p.nickname, name: p.name, url, fileCount: real.length };
    })
  );
}

export default async function AlumnosPage() {
  const students = await getStudents();
  const published = students.filter((s) => s.url);
  const pending = students.filter((s) => !s.url);

  return (
    <>
      <div className="bg-grid" />
      <header className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            <div className="brand-mark">+</div>
            CODE<span style={{ color: "var(--violet-soft)" }}>+IA</span>
          </Link>
          <Link className="btn nav-cta" href="/">
            ← volver al sitio
          </Link>
        </div>
      </header>

      <section className="section" style={{ borderTop: "none" }}>
        <div className="wrap">
          <div className="section-head center">
            <span className="mono-tag">alumnos.showcase</span>
            <h2 className="section-title">Páginas de alumnos</h2>
            <p className="section-desc">
              Los sitios que construyó cada chico y chica del taller, con ayuda de IA. Se van
              sumando a medida que suben su proyecto desde el portal.
            </p>
          </div>

          {!supabaseAdminConfigured && (
            <div className="cta-panel panel portal-warning">
              <p>⚠ Todavía no está conectado Supabase, así que no hay datos para mostrar acá.</p>
            </div>
          )}

          {supabaseAdminConfigured && students.length === 0 && (
            <p className="level-desc" style={{ textAlign: "center" }}>
              Todavía no hay estudiantes cargados en el taller.
            </p>
          )}

          {published.length > 0 && (
            <div className="class-grid reveal" style={{ marginBottom: pending.length ? 36 : 0 }}>
              {published.map((s) => (
                <a
                  key={s.id}
                  href={s.url!}
                  target="_blank"
                  rel="noreferrer"
                  className="class-btn panel student-card"
                >
                  <span className="class-btn-top">
                    <span className="class-btn-icon">🌐</span>
                    <span className="class-btn-num">{s.fileCount} archivo{s.fileCount === 1 ? "" : "s"}</span>
                  </span>
                  <span className="class-btn-title" style={{ color: "var(--ink)", fontSize: 14 }}>
                    {s.name}
                  </span>
                  <span className="class-btn-foot">
                    <span className="class-btn-tool">@{s.nickname}</span>
                    <span className="class-btn-tag" style={{ color: "var(--violet-soft)", marginLeft: "auto" }}>
                      ver página →
                    </span>
                  </span>
                </a>
              ))}
            </div>
          )}

          {pending.length > 0 && (
            <>
              <div className="mono-tag" style={{ marginBottom: 14, justifyContent: "center", display: "flex" }}>
                todavía sin publicar
              </div>
              <div className="class-grid reveal">
                {pending.map((s) => (
                  <div key={s.id} className="class-btn panel" style={{ opacity: 0.55, cursor: "default" }}>
                    <span className="class-btn-top">
                      <span className="class-btn-icon">🕓</span>
                    </span>
                    <span className="class-btn-title" style={{ fontSize: 14 }}>
                      {s.name}
                    </span>
                    <span className="class-btn-foot">
                      <span className="class-btn-tool">@{s.nickname}</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
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
