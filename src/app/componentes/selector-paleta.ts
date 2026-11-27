import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { IdiomaService } from '../i18n/idioma.service';
import { PaletaService } from '../servicios/paleta.service';
import { AnimacionesService } from '../servicios/animaciones.service';

@Component({
  selector: 'kt-selector-paleta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'cerrarFuera($event)',
    '(keydown.escape)': 'cerrar()',
    '(focusout)': 'alSalir($event)',
  },
  template: `
    <div class="selector-paleta">
      <button #boton type="button" class="selector-paleta__boton" [attr.aria-label]="textos[idioma()].titulo"
        [attr.aria-expanded]="abierto()" aria-controls="opciones-apariencia" (click)="abierto.set(!abierto())">
        <span class="selector-paleta__muestra" aria-hidden="true"></span>
      </button>
      <div id="opciones-apariencia" class="selector-paleta__panel" [hidden]="!abierto()">
        <fieldset class="selector-paleta__campo">
          <legend>{{ textos[idioma()].titulo }}</legend>
          @for (opcion of opciones; track opcion) {
            <label class="opcion-paleta" [class.opcion-paleta--activa]="paleta.actual() === opcion">
              <input type="radio" name="paleta" [value]="opcion" [checked]="paleta.actual() === opcion"
                (change)="paleta.elegir(opcion)" />
              <span [class]="'opcion-paleta__colores opcion-paleta__colores--' + opcion" aria-hidden="true"></span>
              <span>{{ opcion === 'blossom' ? 'Blossom' : textos[idioma()][opcion] }}</span>
              <span class="opcion-paleta__check" aria-hidden="true">✓</span>
            </label>
          }
        </fieldset>
        <div class="selector-paleta__modo">
          <span>{{ textos[idioma()].oscuro }}</span>
          <button type="button" class="interruptor-modo" role="switch" [attr.aria-checked]="paleta.oscuro()"
            [attr.aria-label]="textos[idioma()].oscuro" (click)="alternarModo($event)">
            <span class="interruptor-modo__indicador" aria-hidden="true"></span>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="4" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SelectorPaleta {
  protected readonly opciones = ['pastel', 'tierra', 'blossom'] as const;
  protected readonly abierto = signal(false);
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly boton = viewChild.required<ElementRef<HTMLButtonElement>>('boton');
  protected readonly paleta = inject(PaletaService);
  private readonly animaciones = inject(AnimacionesService);
  protected readonly idioma = inject(IdiomaService).idioma;
  protected readonly textos = {
    es: { titulo: 'Paleta', pastel: 'Pastel original', tierra: 'Pastel tierra', oscuro: 'Modo oscuro' },
    en: { titulo: 'Palette', pastel: 'Original pastel', tierra: 'Earthy pastel', oscuro: 'Dark mode' },
    fr: { titulo: 'Palette', pastel: 'Pastel original', tierra: 'Pastel terre', oscuro: 'Mode sombre' },
  };

  /** Activa la transición lateral y anima el interruptor, también desde el teclado. */
  protected alternarModo(event: MouseEvent): void {
    const boton = event.currentTarget as HTMLElement;
    const caja = boton.getBoundingClientRect();
    // Con la transición del navegador el modo cambia un instante después: lo calculamos antes.
    const oscuro = !this.paleta.oscuro();
    this.paleta.alternarModo({ x: caja.left + caja.width / 2, y: caja.top + caja.height / 2 });
    void this.animaciones.cambioModo(boton, oscuro).catch(() => {});
  }

  protected cerrar(): void {
    if (!this.abierto()) return;
    this.abierto.set(false);
    this.boton().nativeElement.focus();
  }

  protected cerrarFuera(event: Event): void {
    if (!this.elemento.nativeElement.contains(event.target as Node)) this.abierto.set(false);
  }

  protected alSalir(event: FocusEvent): void {
    if (event.relatedTarget && !this.elemento.nativeElement.contains(event.relatedTarget as Node)) this.abierto.set(false);
  }
}
