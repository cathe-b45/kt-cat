# kt.cat · web de amigurumis

Web de crochet de Cathe en Angular, en español, inglés y francés.

## Arrancar en local

```bash
npm install
npm start
```

Abre http://localhost:4200 (te lleva a `/es`).

## Dónde se cambia cada cosa

| Quiero cambiar…                                   | Archivo                               |
| ------------------------------------------------- | ------------------------------------- |
| Patrones, testings, trabajos, ilustraciones, novedades, fotos de portada y sobre mí, redes | `src/app/datos/contenido.ts` |
| Textos de la web en los tres idiomas              | `src/app/i18n/textos.ts`              |
| Colores, tamaños, animaciones                     | `src/styles.scss`                     |
| Estrellitas y corazones del fondo                 | `src/app/componentes/fondo.ts`        |
| Cursor de ganchillo                               | `public/ganchillo.svg`                |

Las fotos van en `public/fotos/` y en `contenido.ts` se escriben como `'fotos/nombre.jpg'`
(sin `/` al principio, para que funcionen también en `https://cathe-b45.github.io/kt-cat/`).
Los PDF de los patrones van en `public/patrones/`.

## Idiomas

Cada idioma tiene su propia dirección: `/es`, `/en` y `/fr`. Al compilar se genera una página
HTML ya rellena para cada una, así Google puede leerlas.

## Instagram

`scripts/instagram.mjs` descarga tus últimas publicaciones a `public/data/instagram.json` y
`public/instagram/`. Lo ejecuta la GitHub Action `Actualizar Instagram` cada 6 horas.
Si hay publicaciones, salen en **Trabajos terminados**; si no, se ven los huecos de `contenido.ts`.

Secretos que hay que crear en el repositorio (Settings → Secrets and variables → Actions):

- `IG_TOKEN`: token de la API de Instagram (cuenta de creador).
- `GH_PAT`: token de GitHub con permiso de escritura de *Secrets* en este repositorio.

## TikTok

`scripts/tiktok.mjs` pide tus últimos vídeos a la API de TikTok y los guarda en
`public/data/tiktok.json` (portadas en `public/tiktok/`). Lo ejecuta la misma GitHub Action
cada 6 horas. Si todavía no hay vídeos, se ve una tarjeta con tu perfil.

Para conectarlo (una sola vez):

1. En [developers.tiktok.com](https://developers.tiktok.com) crea una app y añádele los productos
   **Login Kit** y **Display API**, con los permisos `user.info.basic` y `video.list`.
   En *Redirect URI* pon la dirección de tu web (por ejemplo `https://ktcat.es/es`).
   Mientras la app está en *Sandbox*, añade tu cuenta como *Target user*; para dejarla
   publicada hay que enviarla a revisión.
2. En PowerShell, desde la carpeta del proyecto:
   ```powershell
   $env:TT_CLIENT_KEY="..."; $env:TT_CLIENT_SECRET="..."; $env:TT_REDIRECT_URI="https://ktcat.es/es"
   node scripts/tiktok-conectar.mjs
   ```
   Abre el enlace que sale, acepta, copia la dirección a la que te manda TikTok y ejecuta
   `node scripts/tiktok-conectar.mjs "<esa dirección>"`. Te dará el `TT_REFRESH_TOKEN`.
3. Crea estos secretos en el repositorio: `TT_CLIENT_KEY`, `TT_CLIENT_SECRET` y
   `TT_REFRESH_TOKEN`. La Action renueva el token sola (usa también `GH_PAT`).

## Publicar en GitHub Pages

La web está en **https://cathe-b45.github.io/kt-cat/** (repositorio `cathe-b45/kt-cat`,
Settings → Pages con "Source" en **GitHub Actions**). Cada vez que subes cambios a `main` se
publica sola, y también cuando la Action de Instagram/TikTok encuentra publicaciones nuevas.

`build:pages` compila con `--base-href /kt-cat/`. Si algún día usas tu propio dominio
(por ejemplo `ktcat.es`), configúralo en Settings → Pages → Custom domain y cambia en
`package.json` ese `--base-href /kt-cat/` por `--base-href /`.
