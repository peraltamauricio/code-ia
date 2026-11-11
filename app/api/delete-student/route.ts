import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseAdminConfigured } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/**
 * Borra la cuenta de un estudiante (usuario, perfil y archivos subidos).
 * Solo lo puede usar un admin logueado, y nunca borra a otro admin.
 */
export async function POST(req: NextRequest) {
  if (!supabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase no está configurado en el servidor (falta SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 500 }
    );
  }

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data: callerData, error: callerError } = await supabaseAdmin.auth.getUser(token);
  if (callerError || !callerData.user) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }

  const { data: callerProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", callerData.user.id)
    .single();
  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "Falta el alumno a borrar." }, { status: 400 });
  }

  // Solo se pueden borrar estudiantes (nunca un admin, ni a uno mismo).
  const { data: target } = await supabaseAdmin.from("profiles").select("role").eq("id", id).single();
  if (!target || target.role !== "student") {
    return NextResponse.json({ error: "Solo se pueden borrar cuentas de estudiantes." }, { status: 400 });
  }

  // 1) Archivos que subió (su carpeta en el bucket "projects").
  const { data: files } = await supabaseAdmin.storage.from("projects").list(id, { limit: 1000 });
  if (files && files.length > 0) {
    await supabaseAdmin.storage.from("projects").remove(files.map((f) => `${id}/${f.name}`));
  }

  // 2) El usuario. El perfil (y sus puntajes) se borran solos en cascada.
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  // Por si el perfil no tenía cascada, lo borramos igual.
  await supabaseAdmin.from("profiles").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}
