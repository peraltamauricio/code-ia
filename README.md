# CODE +IA

Sitio del taller **CODE +IA** (programación e inteligencia artificial para chicos de 14 a 18 años). Next.js 14 (App Router) + Tailwind + Supabase, publicado en Vercel.

- **Sitio en vivo:** https://code-ia-taller.vercel.app
- **Repo:** https://github.com/peraltamauricio/code-ia (público, ver "Deploy")
- **Talleristas:** Mauri y Siro · 11 clases de 1h45 · presencial

## Qué tiene el sitio

| Ruta | Qué es |
|---|---|
| `/` | Landing: hero con editor de código animado, "Los fundamentos", **Clases** (con candado), Programa, Método, Info, Talleristas |
| `/portal` | Login por nickname + contraseña. Alumno: ve su progreso y sube proyectos. Admin (Mauri/Siro): tilda progreso, da de alta alumnos, ve los archivos de cada uno |
| `/alumnos` | Galería pública "Páginas de alumnos" para que vean los padres en la muestra final |
| `/guia` | Machete de HTML, CSS y JavaScript (pestañas + buscador) |
| `/api/create-student` | Endpoint de servidor (usa la service role) para que un admin cree cuentas |

## Clases y candado

- El contenido está en [lib/curriculum.ts](lib/curriculum.ts): 11 clases (1 Bienvenida, 2 HTML, 3 CSS, 4 JavaScript, 5 Planificar, 6-7 Construir, 8 Debugging, 9 Pulido, 10 Deploy, 11 Presentación).
- **Habilitar una clase:** agregar su número a `UNLOCKED_CLASSES` en ese mismo archivo (hoy: `[1, 2, 3, 4]`), commit y push. Las no habilitadas muestran un candado y "todavía no está habilitada".
- IA recomendada por clase: 1 las tres · 2, 4, 5, 6, 7 ChatGPT · 3 Gemini · 8 a 11 Claude.
- Casi todo el sitio toma la cantidad de clases de `curriculum.length`. Lo único con números de clase escritos a mano: `components/Niveles.tsx` (etiquetas "CLASE 02/03/04"), `components/Programa.tsx` (rangos) y las notas `toolNote` dentro de `curriculum.ts`. Si se mueven clases, revisar eso.

## Portal, alumnos y Supabase

- Login: Supabase Auth con un email interno que se arma como `nickname@codeia.com` (nadie lo usa, el login real es por nickname). Cambiar ese dominio se hace en `lib/authHelpers.ts`.
- Tabla `profiles` (nickname, nombre, rol `student`/`admin`, `progress` boolean[]). Los alumnos suben `.html/.css/.js` al bucket público `projects`, cada uno en su carpeta (`<id del usuario>/`).
- `/alumnos` solo muestra el link "ver página" de quien subió un archivo llamado exactamente **`index.html`** (el panel del alumno se lo avisa). El CSS/JS del mismo proyecto funciona porque comparte carpeta.
- Proyecto de Supabase: `https://cyhzutafxsiljazjzhei.supabase.co`. Mauri y Siro ya están cargados como admins.
- Esquema y políticas: [supabase-schema.sql](supabase-schema.sql). Detalle menor: el default de `progress` en la base en vivo sigue siendo de 12 casilleros (el SQL ya dice 11); no molesta porque la pantalla muestra solo `curriculum.length`.
- Las contraseñas de admins se cambian desde el dashboard de Supabase (no hay pantalla para eso).

### Montar Supabase desde cero (si hiciera falta)

1. Crear el proyecto en https://supabase.com y correr completo `supabase-schema.sql` en el SQL Editor (una sola vez: si se repite, falla con "policy already exists").
2. **Authentication → Users → Add user**: `mauri@codeia.com` y `siro@codeia.com`.
3. Insertar sus perfiles con ID tomado de la propia tabla, así no hay errores de copiado:
   ```sql
   insert into profiles (id, nickname, name, role)
   select id, 'mauri', 'Mauri', 'admin' from auth.users where email = 'mauri@codeia.com'
   union all
   select id, 'siro', 'Siro', 'admin' from auth.users where email = 'siro@codeia.com';
   ```
4. Variables (`.env.local` y Vercel): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. La service role es secreta, solo de servidor, nunca con prefijo `NEXT_PUBLIC_`.

## Correr en local

```bash
npm install
cp .env.local.example .env.local   # completar las 3 variables
npm run dev
```

Abre en http://localhost:3000. En Windows, antes de arrancar conviene cerrar servidores viejos: si el puerto 3000 está ocupado, Next usa el 3001 y puede parecer que "no se ven los cambios". Sin la service role cargada en local, `/alumnos` y "agregar alumno" muestran el aviso de Supabase sin configurar (en producción sí funcionan).

## Deploy (Vercel)

- **Cada push a `master` despliega solo.** Equipo de Vercel `mauri-inc`, proyecto `code-ia`. Las 3 variables de Supabase ya están cargadas ahí (la service role como Secret, la cargó el dueño a mano).
- El repo es público a propósito: el plan Hobby de Vercel bloquea los deploys de repos privados dentro de un equipo.
- La protección SSO de Vercel está desactivada (`vercel project protection disable --sso`) para que las URLs sean públicas.
- **Link estable:** `code-ia-taller.vercel.app` es un alias manual y **no se actualiza solo**. Después de cada deploy hay que correr:
  ```bash
  npx vercel alias set code-ia-educar.vercel.app code-ia-taller.vercel.app
  ```
  (`code-ia-educar.vercel.app` es el dominio de producción automático y una vez cambió al principio, pero en todos los deploys posteriores se mantuvo igual; si el alias llegara a dar 404, mirar `npx vercel project ls` para ver el dominio vigente.)
- No usar `vercel deploy` desde Windows: el build local falla por permisos de symlinks (EPERM). Se despliega con `git push`. Para ver si terminó: `gh api repos/peraltamauricio/code-ia/commits/master/status` (campo `state`).
- Después de un deploy, el navegador puede mostrar la versión vieja por caché: Ctrl+Shift+R.

## Estructura

```
app/            páginas (page.tsx, portal, alumnos, guia, api/create-student), globals.css, icon.png (favicon)
components/     secciones de la landing; components/portal/ = login y paneles de alumno/admin
lib/            curriculum.ts (clases + candado), guide.ts (machete), clientes de Supabase, authHelpers.ts
public/         logo.png
legacy-static/  versión estática vieja (HTML puro), sin uso; se puede borrar
```

## Pendiente / ideas

- El candado es solo visual: el texto de las clases bloqueadas sigue viajando en el código de la página. Si importa, filtrar el contenido en el servidor.
- Pasar el "habilitar clase" al panel de admin (guardado en la base) para que Mauri y Siro lo hagan sin pedir un deploy.
- Ordenar la guía por temas (formularios, arreglos, etc.) en vez de una sola grilla.
- Next está en 14.2.35 (el intento de subir a 16 se cortó por red); `npm audit` marca avisos de esa versión.

## Notas para seguir en otro chat

- Hablar en español rioplatense, respuestas cortas, y avisar cuando algo ya está publicado.
- El usuario es Mauri (tallerista). Pide cambios chicos y seguidos; después de cada uno: type-check, commit, push, esperar el deploy, resincronizar el alias y confirmar en la URL en vivo.
- El navegador integrado de la herramienta a veces falla al sacar capturas o directamente no navega: verificar con `curl` contra el sitio publicado.
- Nunca pedir ni manejar la service role key; la carga el dueño directamente en Vercel.
