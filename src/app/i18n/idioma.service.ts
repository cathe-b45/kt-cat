import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { IDIOMA_POR_DEFECTO, Idioma, TEXTOS, esIdioma } from './textos';

/** Guarda el idioma actual y da acceso a sus textos con `t()`. */
@Injectable({ providedIn: 'root' })
export class IdiomaService {
  private readonly documento = inject(DOCUMENT);
  private readonly titulo = inject(Title);
  private readonly meta = inject(Meta);

  readonly idioma = signal<Idioma>(IDIOMA_POR_DEFECTO);
  readonly t = computed(() => TEXTOS[this.idioma()]);

  usar(valor: string | undefined): void {
    const idioma = esIdioma(valor) ? valor : IDIOMA_POR_DEFECTO;
    this.idioma.set(idioma);

    const t = TEXTOS[idioma];
    this.documento.documentElement.lang = idioma;
    this.titulo.setTitle(t.metaTitulo);
    this.meta.updateTag({ name: 'description', content: t.metaDescripcion });
    this.meta.updateTag({ property: 'og:title', content: t.metaTitulo });
    this.meta.updateTag({ property: 'og:description', content: t.metaDescripcion });
  }
}
