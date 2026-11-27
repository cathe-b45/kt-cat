import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Muestra una foto o, si todavía no hay, un hueco de color con un texto. */
@Component({
  selector: 'kt-foto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'foto' },
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt()" loading="lazy" />
    } @else {
      <span class="foto__hueco" [style.background]="fondo()" [style.color]="tinta()">{{ hueco() }}</span>
    }
  `,
})
export class Foto {
  readonly src = input<string | undefined>('');
  readonly alt = input('');
  readonly fondo = input('var(--papel)');
  readonly tinta = input('var(--texto-suave)');
  readonly hueco = input('[FOTO]');
}
