"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigured, Profile } from "@/lib/supabaseClient";
import LoginForm from "@/components/portal/LoginForm";
import StudentPanel from "@/components/portal/StudentPanel";
import AdminPanel from "@/components/portal/AdminPanel";

export default function PortalPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checking, setChecking] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setProfile(null);
      setChecking(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    setProfile((data as Profile) || null);
    setChecking(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleLogout() {
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
  }

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
            <span className="mono-tag">portal.login</span>
            <h2 className="section-title">Portal de alumnos</h2>
            <p className="section-desc">Entrá con tu nickname y contraseña.</p>
          </div>

          {!supabaseConfigured && (
            <div className="cta-panel panel portal-warning">
              <p>
                ⚠ El portal todavía no está conectado a Supabase. Completá{" "}
                <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                en <code>.env.local</code> (ver <code>.env.local.example</code>) y corré{" "}
                <code>supabase-schema.sql</code> en tu proyecto de Supabase.
              </p>
            </div>
          )}

          {supabaseConfigured && checking && (
            <p className="level-desc" style={{ textAlign: "center" }}>
              cargando…
            </p>
          )}

          {supabaseConfigured && !checking && !profile && (
            <LoginForm onLoggedIn={loadProfile} />
          )}

          {supabaseConfigured && !checking && profile?.role === "student" && (
            <StudentPanel profile={profile} onLogout={handleLogout} />
          )}

          {supabaseConfigured && !checking && profile?.role === "admin" && (
            <AdminPanel profile={profile} onLogout={handleLogout} />
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
