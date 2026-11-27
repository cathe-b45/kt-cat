import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio';
import { IDIOMA_POR_DEFECTO } from './i18n/textos';
import { PATRONES } from './datos/contenido';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: IDIOMA_POR_DEFECTO },
  ...['es', 'en', 'fr'].flatMap((lang) => [
    { path: lang, component: Inicio, data: { lang }, pathMatch: 'full' as const },
    ...PATRONES.map((patron) => ({
      path: `${lang}/patrones/${patron.slug}`, component: Inicio,
      data: { lang, seccion: 'patron', patronSlug: patron.slug },
    })),
    ...['patrones', 'testings', 'trabajos', 'ilustracion', 'sobre-mi', 'redes', 'encargos'].map((seccion) => ({
      path: `${lang}/${seccion}`, component: Inicio, data: { lang, seccion },
    })),
  ]),
  { path: '**', redirectTo: IDIOMA_POR_DEFECTO },
];
