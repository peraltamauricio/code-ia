"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { nicknameToEmail } from "@/lib/authHelpers";

export default function LoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!supabase) return;
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: nicknameToEmail(nickname),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError("Nickname o contraseña incorrectos.");
      return;
    }
    onLoggedIn();
  }

  return (
    <div className="cta-panel panel reveal" style={{ maxWidth: 400, margin: "0 auto" }}>
      <form className="portal-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="nickname"
          autoComplete="username"
          required
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="contraseña"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-solid" style={{ justifyContent: "center" }} disabled={loading}>
          {loading ? "Ingresando…" : "Ingresar →"}
        </button>
      </form>
      {error && <p className="portal-error">{error}</p>}
      <p className="portal-hint">¿No tenés cuenta? Pedísela a Mauri o Siro en clase.</p>
    </div>
  );
}
