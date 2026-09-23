# CODE +IA

Sitio del taller CODE +IA — Next.js 14 (App Router) + Tailwind + Supabase.

## Correr en local

```bash
npm install
cp .env.local.example .env.local   # completá las 3 claves (ver abajo)
npm run dev
```

Abrí http://localhost:3000

## Configurar Supabase

1. Creá un proyecto en https://supabase.com
2. **SQL Editor** → pegá y corré todo `supabase-schema.sql`
3. **Project Settings → API** → copiá `Project URL`, `anon public key` y `service_role key` a tu `.env.local`
4. **Authentication → Users → Add user** → creá a Mauri y Siro (emails internos `mauri@codeia.local` / `siro@codeia.local`, la contraseña que quieras) — el login real de la app es por nickname, el email es solo interno de Supabase Auth
5. Copiá el UUID de cada uno y corré el `insert into profiles (...)` que está comentado al final de `supabase-schema.sql`

Desde ahí, Mauri y Siro ya pueden entrar a `/portal`, agregar estudiantes y tildar el progreso de cada clase. Los estudiantes suben sus proyectos (`.html`, `.css`, `.js`) desde su propio panel — quedan en Supabase Storage, bucket `projects`, cada uno en su propia carpeta.

## Deploy en Vercel

1. Subí este proyecto a un repo de GitHub
2. En Vercel: **Add New → Project** → importá el repo
3. En **Environment Variables** cargá las mismas 3 variables de `.env.local` (la `SUPABASE_SERVICE_ROLE_KEY` también, como variable de servidor)
4. Deploy. Listo — Next.js no necesita configuración extra en Vercel.

## Estructura

- `app/page.tsx` — landing del taller (hero, niveles, clases, programa, método, info, talleristas, CTA)
- `app/portal/page.tsx` — login + panel de estudiante / admin
- `app/api/create-student/route.ts` — endpoint server-side (service role) para que un admin cree cuentas
- `lib/curriculum.ts` — teoría/práctica/entregable de las 12 clases (contenido real del taller)
- `supabase-schema.sql` — tablas, RLS y bucket de Storage
- `legacy-static/` — versión estática anterior (HTML/CSS/JS puro), ya no se usa pero queda de referencia
