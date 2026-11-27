import { RenderMode, ServerRoute } from '@angular/ssr';

// Cada idioma se genera como una página estática (/es, /en, /fr), buena para Google.
export const serverRoutes: ServerRoute[] = [
  { path: 'es', renderMode: RenderMode.Prerender },
  { path: 'en', renderMode: RenderMode.Prerender },
  { path: 'fr', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender },
];
