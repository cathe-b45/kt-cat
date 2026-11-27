import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input } from '@angular/core';

/** Inserción oficial del perfil; el enlace sigue disponible si la red bloquea el widget. */
@Component({
  selector: 'kt-widget-social',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'widget-social' },
  template: `
    @if (red() === 'tiktok') {
      <blockquote class="tiktok-embed" [attr.cite]="perfil()" [attr.data-unique-id]="usuario()" data-embed-type="creator" data-embed-from="embed_page">
        <section><a [href]="perfil()" target="_blank" rel="noopener noreferrer">&#64;{{ usuario() }} · TikTok ↗</a></section>
      </blockquote>
    } @else {
      <blockquote class="instagram-media" [attr.data-instgrm-permalink]="perfil() + '/'" data-instgrm-version="14">
        <a [href]="perfil()" target="_blank" rel="noopener noreferrer">&#64;{{ usuario() }} · Instagram ↗</a>
      </blockquote>
    }
  `,
})
export class WidgetSocial {
  readonly red = input.required<'tiktok' | 'instagram'>();
  readonly usuario = input.required<string>();
  readonly perfil = input.required<string>();
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const documento = this.elemento.nativeElement.ownerDocument;
      const ventana = documento.defaultView as (Window & { instgrm?: { Embeds: { process(): void } } }) | null;
      if (this.red() === 'instagram' && ventana?.instgrm) {
        ventana.instgrm.Embeds.process();
        return;
      }
      const script = documento.createElement('script');
      script.async = true;
      script.src = this.red() === 'tiktok' ? 'https://www.tiktok.com/embed.js' : 'https://www.instagram.com/embed.js';
      script.onload = () => {
        if (this.red() === 'instagram' && !this.destroyRef.destroyed) ventana?.instgrm?.Embeds.process();
      };
      this.elemento.nativeElement.appendChild(script);
      this.destroyRef.onDestroy(() => { script.onload = null; script.remove(); });
    });
  }
}
