import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Adorno {
  tipo: 'estrella' | 'corazon' | 'punto';
  x: number;
  y: number;
  escala: number;
  giro: number;
  color: string;
  duracion: number;
  retraso: number;
  alterna: boolean;
  parpadea: boolean;
}

const COLORES = ['var(--salvia)', 'var(--cielo)', 'var(--rosa)', 'var(--salvia)'];
const ROSAS = ['var(--rosa)', 'var(--rosa)', 'var(--rosa)', 'var(--lavanda)'];

/** Números pseudoaleatorios fijos, para que los adornos salgan siempre en el mismo sitio. */
function semilla(n: number): () => number {
  return () => {
    n = (n * 9301 + 49297) % 233280;
    return n / 233280;
  };
}

function crearAdornos(): Adorno[] {
  const r = semilla(7);
  const lista: Adorno[] = [];
  for (let y = 120; y < 4400; y += 170) {
    for (const lado of [0, 1]) {
      const tirada = r();
      const tipo = tirada < 0.5 ? 'estrella' : tirada < 0.8 ? 'corazon' : 'punto';
      lista.push({
        tipo,
        x: lado === 0 ? 25 + r() * 205 : 1210 + r() * 205,
        y: y + (r() - 0.5) * 120,
        escala: tipo === 'corazon' ? 0.9 + r() * 1.2 : 1.1 + r() * 1.6,
        giro: Math.round((r() - 0.5) * 44),
        color: tipo === 'corazon' ? ROSAS[Math.floor(r() * 4)] : COLORES[Math.floor(r() * 4)],
        duracion: 4.5 + r() * 3.5,
        retraso: -r() * 8,
        alterna: r() > 0.5,
        parpadea: tipo === 'estrella' && r() > 0.65,
      });
    }
  }
  return lista;
}

/** Estrellitas, corazones y puntos que flotan en el fondo. */
@Component({
  selector: 'kt-fondo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fondo', 'aria-hidden': 'true' },
  template: `
    <div class="dia__ambiente">
      @for (estrella of estrellas.slice(0, 55); track $index) {
        <span class="dia__destello" [class.dia__destello--cruz]="estrella.destello"
          [style.left.%]="estrella.x" [style.top.%]="estrella.y"
          [style.width.px]="estrella.tamano + 1" [style.height.px]="estrella.tamano + 1"
          [style.animation-delay.s]="estrella.retraso" [style.animation-duration.s]="estrella.duracion + 4"></span>
      }
      @for (adorno of nocturnos.slice(0, 6); track $index) {
        <svg class="dia__corazon" [class.dia__corazon--derecha]="adorno.derecha"
          [style.top.%]="[19, 28, 58, 67, 85, 91][$index]" [style.--distancia]="adorno.distancia"
          [style.rotate.deg]="adorno.giro" [style.animation-delay.s]="adorno.retraso"
          viewBox="0 0 64 64" focusable="false">
          <path d="M32 54C-10 29 12-2 32 18C52-2 74 29 32 54Z" fill="currentColor" />
          <path d="M15 23Q15 17 21 17" fill="none" stroke="var(--papel)" stroke-width="3" stroke-linecap="round" opacity=".7" />
        </svg>
      }
    </div>
    <div class="noche">
      @for (estrella of estrellas; track $index) {
        <span class="noche__estrella" [class.noche__estrella--destello]="estrella.destello"
          [style.left.%]="estrella.x" [style.top.%]="estrella.y"
          [style.width.px]="estrella.tamano" [style.height.px]="estrella.tamano"
          [style.animation-delay.s]="estrella.retraso" [style.animation-duration.s]="estrella.duracion"></span>
      }
      @for (adorno of nocturnos; track $index) {
        <svg class="noche__adorno" [class.noche__adorno--derecha]="adorno.derecha"
          [class.noche__adorno--luna]="adorno.luna" [style.top.%]="adorno.y"
          [style.--distancia]="adorno.distancia" [style.--escala]="adorno.escala"
          [style.animation-duration.s]="adorno.duracion" [style.animation-delay.s]="adorno.retraso"
          [style.rotate.deg]="adorno.giro" viewBox="0 0 64 64" focusable="false">
          @if (adorno.luna) {
            <path d="M43 8C27 12 24 33 38 43C44 47 51 47 56 45C49 59 29 62 16 50C2 37 8 15 23 8C30 5 37 5 43 8Z" fill="currentColor" />
            <path d="M50 10L52 16L58 18L52 20L50 26L48 20L42 18L48 16Z" fill="currentColor" opacity=".75" />
          } @else {
            <path d="M32 5L40 23L59 25L45 39L49 58L32 48L15 58L19 39L5 25L24 23Z"
              fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round" />
            <circle cx="53" cy="9" r="2.5" fill="currentColor" />
          }
        </svg>
      }
      <svg class="noche__constelacion" viewBox="0 0 90 220" fill="none" focusable="false">
        <path d="M20 18L65 66L28 110L58 164L20 202" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="3 6" />
        <g fill="currentColor"><circle cx="20" cy="18" r="2.5" /><circle cx="65" cy="66" r="3" /><circle cx="28" cy="110" r="2" /><circle cx="58" cy="164" r="3" /><circle cx="20" cy="202" r="2" /></g>
      </svg>
    </div>
    <svg class="fondo__dia" viewBox="0 0 1440 4500" preserveAspectRatio="xMidYMin slice">
      <defs>
        <path
          id="kt-estrella"
          d="M0 -10 L2.9 -3.5 L9.5 -3.1 L4.4 1.3 L5.9 8.1 L0 4.5 L-5.9 8.1 L-4.4 1.3 L-9.5 -3.1 L-2.9 -3.5 Z"
          stroke-linejoin="round"
          stroke-width="2.4"
        />
        <path
          id="kt-corazon"
          d="M0 8 C-7 3 -10 -1 -10 -4.5 C-10 -7.8 -7.6 -10 -5 -10 C-3 -10 -1.2 -8.8 0 -7 C1.2 -8.8 3 -10 5 -10 C7.6 -10 10 -7.8 10 -4.5 C10 -1 7 3 0 8 Z"
          stroke-linejoin="round"
          stroke-width="2.4"
        />
      </defs>
      @for (a of adornos; track $index) {
        <g
          [class]="a.alterna ? 'flota2' : 'flota'"
          [style.animation-duration.s]="a.duracion"
          [style.animation-delay.s]="a.retraso"
        >
          @if (a.tipo === 'punto') {
            <circle [attr.cx]="a.x" [attr.cy]="a.y" [attr.r]="a.escala * 3" [attr.fill]="a.color" />
          } @else {
            <use
              [attr.href]="a.tipo === 'estrella' ? '#kt-estrella' : '#kt-corazon'"
              [attr.transform]="'translate(' + a.x + ' ' + a.y + ') scale(' + a.escala + ') rotate(' + a.giro + ')'"
              [attr.fill]="a.color"
              [attr.stroke]="a.color"
              [class.parpadea]="a.parpadea"
              [style.animation-delay.s]="a.retraso"
            />
          }
        </g>
      }
    </svg>
  `,
})
export class Fondo {
  protected readonly adornos = crearAdornos();
  protected readonly nocturnos = Array.from({ length: 12 }, (_, i) => ({
    derecha: i % 2 === 1,
    luna: i % 4 === 0 || i % 4 === 3,
    y: [12, 18, 31, 38, 47, 52, 65, 70, 78, 83, 92, 94][i],
    distancia: [0.56, 0.22, 0.12, 0.68, 0.74, 0.38, 0.32, 0.78, 0.65, 0.16, 0.08, 0.57][i],
    escala: [1.1, 0.72, 0.82, 1, 0.68, 0.9, 0.95, 0.64, 0.78, 1.05, 0.62, 0.84][i],
    giro: [-24, 16, -8, 32, 12, -18, -32, 8, 26, -12, -6, 22][i],
    duracion: 7 + (i * 3 % 7),
    retraso: -i * 1.7,
  }));
  // La semilla fija mantiene iguales el HTML del servidor y el del navegador.
  protected readonly estrellas = (() => {
    const r = semilla(29);
    return Array.from({ length: 90 }, (_, i) => ({
      x: r() * 100,
      y: r() * 100,
      tamano: i % 7 === 0 ? 7 + r() * 5 : 1.5 + r() * 1.5,
      destello: i % 7 === 0,
      retraso: -r() * 10,
      duracion: 5 + r() * 5,
    }));
  })();
}
