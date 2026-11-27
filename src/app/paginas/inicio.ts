import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, input } from '@angular/core';
import { Cabecera } from '../componentes/cabecera';
import { Fondo } from '../componentes/fondo';
import { Pie } from '../componentes/pie';
import { Portada } from '../componentes/portada';
import { Ilustraciones, Instagram, Patrones, SobreMi, Testings, TikTok } from '../componentes/secciones';
import { IdiomaService } from '../i18n/idioma.service';
import { PatronDetalle } from '../componentes/patron-detalle';
import { AnimacionesService } from '../servicios/animaciones.service';
import { Encargos } from '../componentes/encargos';

@Component({
  selector: 'kt-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fondo, Cabecera, Portada, Patrones, PatronDetalle, Testings, Ilustraciones, TikTok, Instagram, SobreMi, Pie, Encargos],
  template: `
    <kt-fondo />
    <kt-cabecera />
    <main>
      @if (!seccion()) {
        <div class="contenido contenido--portada"><kt-portada /></div>
      } @else {
        <div class="contenido contenido--seccion" [class.contenido--creaciones]="seccion() === 'trabajos'">
          @switch (seccion()) {
            @case ('patrones') { <kt-patrones /> }
            @case ('patron') { <kt-patron-detalle [slug]="patronSlug() ?? ''" /> }
            @case ('testings') { <kt-testings /> }
            @case ('trabajos') {
              <header class="creaciones-intro">
                <h1 class="creaciones-titulo">{{ i18n.t().navTrabajos }}</h1>
                <p>{{ i18n.t().trabTexto }}</p>
              </header>
              <kt-tiktok />
              <kt-instagram />
            }
            @case ('ilustracion') { <kt-ilustraciones /> }
            @case ('sobre-mi') { <kt-sobre-mi /> }
            @case ('encargos') { <kt-encargos /> }
            @case ('redes') { <kt-tiktok /><kt-instagram /> }
          }
        </div>
      }
    </main>
    <kt-pie />
  `,
})
export class Inicio {
  /** Viene de la URL: /es, /en o /fr. */
  readonly lang = input<string>();
  readonly seccion = input<string>();
  readonly patronSlug = input<string>();
  protected readonly i18n = inject(IdiomaService);

  constructor() {
    effect(() => this.i18n.usar(this.lang()));

    // Animaciones con GSAP: solo en el navegador, después de pintar la página.
    const raiz = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const animaciones = inject(AnimacionesService);
    let deshacer: (() => void) | undefined;
    let vivo = true;
    inject(DestroyRef).onDestroy(() => {
      vivo = false;
      deshacer?.();
    });
    afterNextRender(() => {
      animaciones.animar(raiz).then((fin) => (vivo ? (deshacer = fin) : fin()));
    });
  }
}
