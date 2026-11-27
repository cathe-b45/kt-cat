import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { REDES } from '../datos/contenido';
import { IdiomaService } from '../i18n/idioma.service';
import { IDIOMAS, Idioma } from '../i18n/textos';
import { Icono } from './icono';
import { SelectorPaleta } from './selector-paleta';
import { Buscador } from './buscador';

@Component({
  selector: 'kt-cabecera',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icono, SelectorPaleta, Buscador],
  host: { class: 'cabecera', '[class.cabecera--abierta]': 'menuAbierto()', '(keydown.escape)': 'cerrarMenu(true)' },
  template: `
    <div class="cabecera__fila">
      <a class="cabecera__logo" [routerLink]="['/', idioma()]" (click)="cerrarMenu()">
        <span class="cabecera__ovillo"><kt-icono nombre="ovillo" [tamano]="22" /></span>
        <span>kt.cat</span>
      </a>

      <button #botonMenu type="button" class="cabecera__hamburguesa" (click)="menuAbierto.set(!menuAbierto())"
        [attr.aria-expanded]="menuAbierto()" aria-controls="cabecera-enlaces cabecera-opciones"
        [attr.aria-label]="menuAbierto() ? t().cerrar : t().navAria">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          @if (menuAbierto()) { <path d="m6 6 12 12M6 18 18 6" /> }
          @else { <path d="M4 6h16M4 12h16M4 18h16" /> }
        </svg>
      </button>

      <nav id="cabecera-enlaces" class="cabecera__menu" [attr.aria-label]="t().navAria" (click)="cerrarMenu()">
        <a [routerLink]="['/', idioma(), 'patrones']">{{ t().navPatrones }}</a>
        <a [routerLink]="['/', idioma(), 'testings']">{{ t().navTestings }}</a>
        <a [routerLink]="['/', idioma(), 'trabajos']">{{ t().navTrabajos }}</a>
        <a [routerLink]="['/', idioma(), 'ilustracion']">{{ t().navIlustracion }}</a>
        <a [routerLink]="['/', idioma(), 'sobre-mi']">{{ t().navSobre }}</a>
      </nav>

      <div id="cabecera-opciones" class="cabecera__extra">
        <kt-buscador (seleccionado)="cerrarMenu()" />
        <div class="idiomas" role="group" [attr.aria-label]="t().idiomaAria">
          @for (i of idiomas; track i.codigo) {
            <a
              class="blandito"
              [routerLink]="rutaIdioma(i.codigo)"
              (click)="cerrarMenu()"
              [attr.hreflang]="i.codigo"
              [attr.aria-current]="i.codigo === idioma() ? 'page' : null"
              [class.activo]="i.codigo === idioma()"
              >{{ i.etiqueta }}</a
            >
          }
        </div>
        <a class="circulo circulo--cielo blandito" [href]="'https://www.instagram.com/' + redes.instagram" aria-label="Instagram">
          <kt-icono nombre="instagram" />
        </a>
        <a class="circulo circulo--rosa blandito" [href]="'https://www.tiktok.com/@' + redes.tiktok" aria-label="TikTok">
          <kt-icono nombre="tiktok" />
        </a>
        <kt-selector-paleta />
      </div>
    </div>
    <div class="puntadas" aria-hidden="true"></div>
  `,
})
export class Cabecera {
  protected readonly menuAbierto = signal(false);
  private readonly botonMenu = viewChild.required<ElementRef<HTMLButtonElement>>('botonMenu');

  protected cerrarMenu(enfocar = false) {
    if (!this.menuAbierto()) return;
    this.menuAbierto.set(false);
    if (enfocar) this.botonMenu().nativeElement.focus();
  }

  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly i18n = inject(IdiomaService);
  protected readonly t = this.i18n.t;
  protected readonly idioma = this.i18n.idioma;
  protected readonly idiomas = IDIOMAS;
  protected readonly redes = REDES;

  protected rutaIdioma(idioma: Idioma) {
    const actual = this.ruta.snapshot;
    return this.router.createUrlTree(['/', idioma, ...actual.url.slice(1).map((segmento) => segmento.path)], {
      queryParams: actual.queryParams,
      fragment: actual.fragment ?? undefined,
    });
  }

  constructor() {
    const cabecera = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const scroller = inject(ViewportScroller);
    const destroyRef = inject(DestroyRef);
    // Al saltar a una sección, deja sitio para la cabecera fija y un poco de aire,
    // así el título en cinta washi se ve entero.
    afterNextRender(() => {
      scroller.setOffset(() => [0, cabecera.offsetHeight + 28]);
      const actualizarAltura = () => cabecera.closest<HTMLElement>('kt-inicio')?.style.setProperty('--alto-cabecera', `${cabecera.offsetHeight}px`);
      actualizarAltura();
      const observer = new ResizeObserver(actualizarAltura);
      observer.observe(cabecera);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
