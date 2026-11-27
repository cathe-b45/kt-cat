// Conecta tu cuenta de TikTok con la web. Solo hace falta hacerlo una vez
// (o si el refresh token caduca, al cabo de un año).
//
// Antes, en PowerShell, pon los datos de tu app de developers.tiktok.com:
//   $env:TT_CLIENT_KEY="..."; $env:TT_CLIENT_SECRET="..."; $env:TT_REDIRECT_URI="https://tu-web/es"
// (TT_REDIRECT_URI tiene que ser exactamente la misma que pusiste en la app).
//
// Paso 1:  node scripts/tiktok-conectar.mjs
//          → te da un enlace; ábrelo, inicia sesión en TikTok y acepta.
// Paso 2:  TikTok te manda a tu web con ?code=... en la barra de direcciones.
//          Copia esa dirección entera y ejecuta:
//          node scripts/tiktok-conectar.mjs "https://tu-web/es?code=...&state=..."
//          → te da el TT_REFRESH_TOKEN para guardarlo en los secretos del repositorio.

import { randomBytes } from "node:crypto";

const { TT_CLIENT_KEY, TT_CLIENT_SECRET, TT_REDIRECT_URI } = process.env;
if (!TT_CLIENT_KEY || !TT_CLIENT_SECRET || !TT_REDIRECT_URI) {
  console.error("Pon antes TT_CLIENT_KEY, TT_CLIENT_SECRET y TT_REDIRECT_URI (mira el principio de este archivo).");
  process.exit(1);
}

const entrada = process.argv[2];

if (!entrada) {
  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.search = new URLSearchParams({
    client_key: TT_CLIENT_KEY,
    scope: "user.info.basic,video.list",
    response_type: "code",
    redirect_uri: TT_REDIRECT_URI,
    state: randomBytes(8).toString("hex"),
  }).toString();
  console.log("Abre este enlace, inicia sesión en TikTok y acepta:\n");
  console.log(url.toString());
  console.log("\nLuego vuelve a ejecutar este script pasándole la dirección a la que te mande TikTok.");
  process.exit(0);
}

// Se puede pasar la dirección entera o solo el código.
const code = entrada.startsWith("http") ? new URL(entrada).searchParams.get("code") : decodeURIComponent(entrada);
if (!code) {
  console.error("No encuentro ?code= en esa dirección.");
  process.exit(1);
}

const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_key: TT_CLIENT_KEY,
    client_secret: TT_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: TT_REDIRECT_URI,
  }),
});
const datos = await r.json();
if (!r.ok || !datos.refresh_token) {
  console.error("TikTok no ha dado el token:", datos.error_description ?? datos.error ?? r.status);
  console.error("El código solo vale unos minutos y una vez: si ha caducado, repite el paso 1.");
  process.exit(1);
}

console.log("¡Conectado! Guarda esto en GitHub → Settings → Secrets and variables → Actions:\n");
console.log("TT_REFRESH_TOKEN =", datos.refresh_token);
console.log(`\n(Dura ${Math.round(datos.refresh_expires_in / 86400)} días; la GitHub Action lo va renovando sola.)`);
