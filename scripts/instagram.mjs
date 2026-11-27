// Descarga tus últimas publicaciones de Instagram y las guarda en la web.
// Genera data/instagram.json y las imágenes en assets/instagram/.
// Se ejecuta desde GitHub Actions (ver .github/workflows/instagram.yml).

import { writeFile, mkdir, rm } from "node:fs/promises";

const API = "https://graph.instagram.com";
const CUANTAS = 12;
const CARPETA_FOTOS = "public/instagram";
const ARCHIVO_JSON = "public/data/instagram.json";

let token = process.env.IG_TOKEN;
if (!token) {
  console.error("Falta el secreto IG_TOKEN.");
  process.exit(1);
}

// 1. Renovar el token (dura 60 días; al renovarlo vuelve a contar desde hoy).
//    Si falla (por ejemplo, porque se renovó hace menos de 24 h), seguimos con el actual.
try {
  const r = await fetch(
    `${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`
  );
  const datos = await r.json();
  if (r.ok && datos.access_token) {
    if (datos.access_token !== token) {
      await writeFile(".ig_token_nuevo", datos.access_token);
      console.log("Token renovado (cambió).");
    } else {
      console.log("Token renovado.");
    }
    token = datos.access_token;
  } else {
    console.log("No se renovó el token:", datos.error?.message ?? r.status);
  }
} catch (e) {
  console.log("No se pudo renovar el token:", e.message);
}

// 2. Pedir las últimas publicaciones.
const campos = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const res = await fetch(
  `${API}/me/media?fields=${campos}&limit=${CUANTAS}&access_token=${encodeURIComponent(token)}`
);
const json = await res.json();
if (!res.ok) {
  console.error("Error de Instagram:", json.error?.message ?? res.status);
  process.exit(1);
}

// 3. Descargar cada imagen (los enlaces de Instagram caducan, así que guardamos una copia).
await rm(CARPETA_FOTOS, { recursive: true, force: true });
await mkdir(CARPETA_FOTOS, { recursive: true });
await mkdir("public/data", { recursive: true });

const publicaciones = [];
for (const p of json.data ?? []) {
  // En los vídeos usamos la miniatura; en los carruseles, la primera foto.
  const urlImagen = p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url;
  if (!urlImagen) continue;

  const img = await fetch(urlImagen);
  if (!img.ok) continue;
  const archivo = `${CARPETA_FOTOS}/${p.id}.jpg`;
  await writeFile(archivo, Buffer.from(await img.arrayBuffer()));

  publicaciones.push({
    id: p.id,
    imagen: archivo.replace(/^public\//, ""),
    texto: (p.caption ?? "").split("\n")[0].slice(0, 140),
    tipo: p.media_type,
    enlace: p.permalink,
    fecha: p.timestamp,
  });
}

await writeFile(
  ARCHIVO_JSON,
  JSON.stringify({ actualizado: new Date().toISOString(), publicaciones }, null, 2) + "\n"
);
console.log(`Guardadas ${publicaciones.length} publicaciones.`);
