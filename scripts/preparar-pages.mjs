// Ajustes para publicar en GitHub Pages después de `ng build`.
import { copyFile, writeFile, access } from 'node:fs/promises';

const dist = 'dist/kt-cat/browser';

// Si alguien entra a una dirección que no existe, GitHub Pages muestra 404.html:
// usamos la app para que redirija a /es.
await copyFile(`${dist}/index.csr.html`, `${dist}/404.html`);

// Que GitHub Pages no procese la carpeta con Jekyll.
await writeFile(`${dist}/.nojekyll`, '');

// Si la portada no se generó como redirección, creamos una que lleve a es/.
// La ruta es relativa para que funcione igual en la raíz de un dominio que en /kt-cat/.
try {
  await access(`${dist}/index.html`);
} catch {
  await writeFile(
    `${dist}/index.html`,
    '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=es"><link rel="canonical" href="es">'
  );
}

console.log('Listo para GitHub Pages.');
