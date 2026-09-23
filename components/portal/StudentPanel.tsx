"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { supabase, Profile } from "@/lib/supabaseClient";

type ProjectFile = { name: string; url: string; updatedAt?: string | null };

export default function StudentPanel({
  profile,
  onLogout,
}: {
  profile: Profile;
  onLogout: () => void;
}) {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const done = profile.progress.filter(Boolean).length;

  const loadFiles = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.storage.from("projects").list(profile.id, {
      sortBy: { column: "updated_at", order: "desc" },
    });
    if (error || !data) return;
    setFiles(
      data
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map((f) => ({
          name: f.name,
          url: supabase!.storage.from("projects").getPublicUrl(`${profile.id}/${f.name}`).data
            .publicUrl,
          updatedAt: f.updated_at,
        }))
    );
  }, [profile.id]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!supabase || !e.target.files?.length) return;
    setUploading(true);
    setUploadError("");
    const allowed = /\.(html?|css|js)$/i;
    const chosen = Array.from(e.target.files);
    for (const file of chosen) {
      if (!allowed.test(file.name)) {
        setUploadError("Solo se aceptan archivos .html, .css o .js");
        continue;
      }
      const { error } = await supabase.storage
        .from("projects")
        .upload(`${profile.id}/${file.name}`, file, { upsert: true });
      if (error) setUploadError(error.message);
    }
    setUploading(false);
    e.target.value = "";
    loadFiles();
  }

  return (
    <div className="cta-panel panel reveal" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="portal-topline">
        <span className="portal-who">
          Hola, <b>{profile.name}</b> 👋
        </span>
        <button className="logout-link" type="button" onClick={onLogout}>
          salir
        </button>
      </div>

      <p className="cta-note" style={{ marginTop: 0 }}>
        {done} de 12 clases completadas
      </p>
      <div className="progress-grid">
        {profile.progress.map((p, i) => (
          <div key={i} className={`progress-chip${p ? " done" : ""}`}>
            C{i + 1}
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--panel-line)", marginTop: 26, paddingTop: 22 }}>
        <div className="mono-tag" style={{ marginBottom: 12 }}>
          mis proyectos
        </div>
        <p className="level-desc" style={{ marginBottom: 14 }}>
          Subí los archivos de tu proyecto (.html, .css, .js). Si subís un archivo con el mismo
          nombre, reemplaza al anterior. Llamá <b style={{ color: "var(--ink)" }}>index.html</b>{" "}
          al archivo principal: es el único que aparece en{" "}
          <a href="/alumnos" style={{ color: "var(--violet-soft)" }}>
            Páginas de Alumnos
          </a>
          , la galería pública que van a ver tus padres.
        </p>

        <label
          className="btn btn-solid"
          style={{ justifyContent: "center", cursor: "pointer", width: "100%" }}
        >
          {uploading ? "Subiendo…" : "+ subir archivos"}
          <input
            type="file"
            multiple
            accept=".html,.htm,.css,.js"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
        {uploadError && <p className="portal-error">{uploadError}</p>}

        {files.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0", display: "grid", gap: 8 }}>
            {files.map((f) => (
              <li
                key={f.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid var(--panel-line)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 13,
                }}
              >
                <span>{f.name}</span>
                <a href={f.url} target="_blank" rel="noreferrer" style={{ color: "var(--violet-soft)" }}>
                  ver →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
