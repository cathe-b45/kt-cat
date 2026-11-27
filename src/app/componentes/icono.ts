import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NombreIcono =
  | 'instagram'
  | 'tiktok'
  | 'correo'
  | 'ovillo'
  | 'regalo'
  | 'lupa'
  | 'corazon'
  | 'video'
  | 'pincel';

/** Iconos de trazo, a juego con la web. Heredan el color del texto. */
@Component({
  selector: 'kt-icono',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', style: 'display: inline-flex' },
  template: `
    <svg
      [attr.width]="tamano()"
      [attr.height]="tamano()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @switch (nombre()) {
        @case ('instagram') {
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        }
        @case ('tiktok') {
          <path d="M14 3.5v11a3.75 3.75 0 1 1-3.75-3.75" />
          <path d="M14 3.5c.6 2.7 2.6 4.4 5.5 4.6" />
        }
        @case ('correo') {
          <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
          <path d="M4 7l8 6 8-6" />
        }
        @case ('ovillo') {
          <circle cx="12" cy="12" r="8" />
          <path d="M5 9.5c4.5-2.5 9.5-2 14 1M4.5 13.5c5-2 10-1.2 15 1.5M9 4.6c3.5 4 4.5 9.5 2.5 15.2" />
        }
        @case ('regalo') {
          <path d="M4 9h16v11H4zM12 9v11M4 13h16M12 9C10 5 6.5 5 7 7.5S10 9 12 9zm0 0c2-4 5.5-4 5-1.5S14 9 12 9z" />
        }
        @case ('lupa') {
          <path d="M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 1 0 0-13zM16 16l5 5M8.5 11l2 2 3.5-4" />
        }
        @case ('corazon') {
          <path d="M12 20s-7-4.4-8.6-9A4.6 4.6 0 0 1 12 7.2 4.6 4.6 0 0 1 20.6 11C19 15.6 12 20 12 20z" />
        }
        @case ('video') {
          <path d="M6 5.5h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2zM10 9.5v5l4.5-2.5z" />
        }
        @case ('pincel') {
          <path d="M14.5 4.5l5 5L10 19H5v-5zM12.5 6.5l5 5" />
        }
      }
    </svg>
  `,
})
export class Icono {
  readonly nombre = input.required<NombreIcono>();
  readonly tamano = input(20);
}
