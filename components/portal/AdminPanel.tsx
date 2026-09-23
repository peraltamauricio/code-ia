"use client";

import { Fragment, FormEvent, useCallback, useEffect, useState } from "react";
import { supabase, Profile } from "@/lib/supabaseClient";

type ProjectFile = { name: string; url: string };

export default function AdminPanel({
  profile,
  onLogout,
}: {
  profile: Profile;
  onLogout: () => void;
}) {
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFilesFor, setOpenFilesFor] = useState<string | null>(null);
  const [filesByStudent, setFilesByStudent] = useState<Record<string, ProjectFile[]>>({});

  const [newNick, setNewNick] = useState("");
  const [newName, setNewName] = useState("");
  const [newPass, setNewPass] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const loadStudents = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .order("nickname");
    setStudents((data as Profile[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  async function toggleProgress(student: Profile, classIndex: number) {
    if (!supabase) return;
    const next = [...student.progress];
    next[classIndex] = !next[classIndex];
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, progress: next } : s))
    );
    const { error } = await supabase.from("profiles").update({ progress: next }).eq("id", student.id);
    if (error) {
      // revert on failure
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, progress: student.progress } : s))
      );
      alert("No se pudo guardar: " + error.message);
    }
  }

  async function toggleFiles(student: Profile) {
    if (openFilesFor === student.id) {
      setOpenFilesFor(null);
      return;
    }
    setOpenFilesFor(student.id);
    if (!supabase || filesByStudent[student.id]) return;
    const { data } = await supabase.storage.from("projects").list(student.id);
    const list =
      data
        ?.filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map((f) => ({
          name: f.name,
          url: supabase!.storage.from("projects").getPublicUrl(`${student.id}/${f.name}`).data
            .publicUrl,
        })) || [];
    setFilesByStudent((prev) => ({ ...prev, [student.id]: list }));
  }

  async function handleAddStudent(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setAddError("");
    setAdding(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const res = await fetch("/api/create-student", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nickname: newNick, name: newName, password: newPass }),
    });
    const json = await res.json();
    setAdding(false);
    if (!res.ok) {
      setAddError(json.error || "No se pudo crear el alumno.");
      return;
    }
    setNewNick("");
    setNewName("");
    setNewPass("");
    loadStudents();
  }

  return (
    <div className="panel reveal" style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="portal-topline">
        <span className="portal-who">
          Panel de <b>{profile.name}</b>
        </span>
        <button className="logout-link" type="button" onClick={onLogout}>
          salir
        </button>
      </div>

      <div className="admin-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              {Array.from({ length: 12 }, (_, i) => (
                <th key={i}>C{i + 1}</th>
              ))}
              <th>Proyecto</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <Fragment key={s.id}>
                <tr>
                  <td>
                    {s.name} ({s.nickname})
                  </td>
                  {s.progress.map((p, i) => (
                    <td key={i}>
                      <input type="checkbox" checked={p} onChange={() => toggleProgress(s, i)} />
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="logout-link"
                      onClick={() => toggleFiles(s)}
                      style={{ fontSize: 12 }}
                    >
                      {openFilesFor === s.id ? "ocultar" : "ver"}
                    </button>
                  </td>
                </tr>
                {openFilesFor === s.id && (
                  <tr>
                    <td colSpan={14} style={{ textAlign: "left", background: "rgba(255,255,255,0.02)" }}>
                      {!filesByStudent[s.id] && <span className="level-desc">cargando…</span>}
                      {filesByStudent[s.id]?.length === 0 && (
                        <span className="level-desc">Todavía no subió archivos.</span>
                      )}
                      {filesByStudent[s.id]?.length ? (
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", padding: "10px 4px" }}>
                          {filesByStudent[s.id].map((f) => (
                            <a
                              key={f.name}
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "var(--violet-soft)", fontSize: 13 }}
                            >
                              {f.name} →
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {!loading && students.length === 0 && (
              <tr>
                <td colSpan={14} className="level-desc" style={{ textAlign: "center", padding: 20 }}>
                  Todavía no hay estudiantes cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form className="add-student" onSubmit={handleAddStudent}>
        <input
          placeholder="nickname"
          required
          value={newNick}
          onChange={(e) => setNewNick(e.target.value)}
        />
        <input
          placeholder="nombre"
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          placeholder="contraseña"
          type="password"
          required
          minLength={6}
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <button type="submit" className="btn-solid" disabled={adding}>
          {adding ? "creando…" : "+ agregar"}
        </button>
      </form>
      {addError && <p className="portal-error">{addError}</p>}
    </div>
  );
}
