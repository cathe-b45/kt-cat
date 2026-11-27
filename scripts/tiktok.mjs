// Descarga tus últimos vídeos de TikTok (API Display de TikTok) y los guarda en la web.
// Genera public/data/tiktok.json y las portadas en public/tiktok/.
// Se ejecuta desde GitHub Actions (ver .github/workflows/instagram.yml).
//
// Necesita tres secretos (cómo conseguirlos: scripts/tiktok-conectar.mjs y el README):
//   TT_CLIENT_KEY, TT_CLIENT_SECRET  → de tu app en developers.tiktok.com
//   TT_REFRESH_TOKEN                 → se consigue una vez con scripts/tiktok-conectar.mjs

import { writeFile, mkdir, rm } from "node:fs/promises";

const API = "https://open.tiktokapis.com/v2";
const CUANTOS = 12; // TikTok deja pedir hasta 20
const CARPETA = "public/tiktok";
const ARCHIVO_JSON = "public/data/tiktok.json";

const { TT_CLIENT_KEY, TT_CLIENT_SECRET, TT_REFRESH_TOKEN } = process.env;
if (!TT_CLIENT_KEY || !TT_CLIENT_SECRET || !TT_REFRESH_TOKEN) {
  console.error("Faltan los secretos TT_CLIENT_KEY, TT_CLIENT_SECRET o TT_REFRESH_TOKEN.");
  process.exit(1);
}

// 1. Con el refresh token sacamos un token de acceso (dura 24 h).
//    El refresh token dura un año y TikTok puede darnos uno nuevo: si cambia, lo guardamos
//    para que el siguiente paso del workflow actualice el secreto.
const r = await fetch(`${API}/oauth/token/`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_key: TT_CLIENT_KEY,
    client_secret: TT_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: TT_REFRESH_TOKEN,
  }),
});
const token = await r.json();
if (!r.ok || !token.access_token) {
  console.error("No se pudo renovar el token de TikTok:", token.error_description ?? token.error ?? r.status);
  process.exit(1);
}
if (token.refresh_token && token.refresh_token !== TT_REFRESH_TOKEN) {
  await writeFile(".tt_token_nuevo", token.refresh_token);
  console.log("Refresh token renovado (cambió).");
}

// 2. Pedir los últimos vídeos.
const campos = "id,title,video_description,cover_image_url,share_url,create_time";
const res = await fetch(`${API}/video/list/?fields=${campos}`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ max_count: CUANTOS }),
});
const json = await res.json();
if (!res.ok || (json.error?.code && json.error.code !== "ok")) {
  console.error("Error de TikTok:", json.error?.message ?? res.status);
  process.exit(1);
}

// 3. Descargar las portadas (los enlaces de TikTok caducan, así que guardamos una copia).
await rm(CARPETA, { recursive: true, force: true });
await mkdir(CARPETA, { recursive: true });
await mkdir("public/data", { recursive: true });

const videos = [];
for (const v of json.data?.videos ?? []) {
  let portada;
  if (v.cover_image_url) {
    const img = await fetch(v.cover_image_url);
    if (img.ok) {
      await writeFile(`${CARPETA}/${v.id}.jpg`, Buffer.from(await img.arrayBuffer()));
      portada = `tiktok/${v.id}.jpg`;
    }
  }
  videos.push({
    id: v.id,
    enlace: (v.share_url ?? "").split("?")[0],
    portada,
    titulo: (v.title || v.video_description || "").split("\n")[0].slice(0, 140),
    fecha: v.create_time ? new Date(v.create_time * 1000).toISOString() : undefined,
  });
}

await writeFile(
  ARCHIVO_JSON,
  JSON.stringify({ actualizado: new Date().toISOString(), videos }, null, 2) + "\n"
);
console.log(`Guardados ${videos.length} TikToks.`);
