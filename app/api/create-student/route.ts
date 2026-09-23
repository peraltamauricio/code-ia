import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { nicknameToEmail } from "@/lib/authHelpers";

export const runtime = "nodejs";

/**
 * Creates a new student account. Only callable by someone already
 * authenticated as an admin — the caller's access token is verified
 * server-side (with the service role key) before anything is created,
 * so this can't be used to self-promote or spoof another admin.
 */
export async function POST(req: NextRequest) {
  if (!supabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase no está configurado en el servidor (falta SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data: callerData, error: callerError } = await supabaseAdmin.auth.getUser(token);
  if (callerError || !callerData.user) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }

  const { data: callerProfile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", callerData.user.id)
    .single();

  if (profileError || callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const nickname = (body?.nickname || "").trim().toLowerCase();
  const name = (body?.name || "").trim();
  const password = body?.password || "";

  if (!nickname || !name || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Faltan datos, o la contraseña tiene menos de 6 caracteres." },
      { status: 400 }
    );
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: nicknameToEmail(nickname),
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message || "No se pudo crear el usuario (¿nickname repetido?)." },
      { status: 400 }
    );
  }

  const { error: insertError } = await supabaseAdmin.from("profiles").insert({
    id: created.user.id,
    nickname,
    name,
    role: "student",
  });

  if (insertError) {
    // roll back the auth user so we don't leave an orphaned account
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, nickname });
}
