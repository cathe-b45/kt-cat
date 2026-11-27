import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input, signal, viewChild } from '@angular/core';

export type ColorCaja = 'cielo' | 'rosa' | 'salvia' | 'lavanda';

/** Caja con borde de cuadros vichy y el título en un trozo de cinta washi. */
@Component({
  selector: 'kt-caja',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.id]': 'ancla()', '[class]': '"caja caja--" + color()' },
  template: `
    <div class="caja__cinta" [style.rotate]="giro() + 'deg'">
      <h2>{{ titulo() }}</h2>
    </div>
    <div class="caja__vichy" #marco>
      @if (marcoAdaptable()) {
        <svg class="caja__contorno" [attr.viewBox]="vista()" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="caja__silueta" [attr.d]="contorno(0)" />
          <path class="caja__costura" [attr.d]="contorno(14)" />
        </svg>
      } @else {
      <svg class="caja__contorno" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="caja__silueta" d="M62 24 C180 5 250 38 365 23 S555 10 680 25 S855 4 935 30 C984 40 984 84 977 145 S990 270 977 340 S993 470 970 535 C955 582 900 588 820 577 S680 591 570 579 S400 594 285 577 S130 594 65 574 C18 560 12 530 22 460 S10 325 23 260 S10 145 22 90 C28 51 31 34 62 24Z" />
        <path class="caja__costura" d="M66 40 C180 22 250 54 365 39 S555 26 680 41 S855 20 932 46 C966 55 968 85 961 145 S974 270 961 340 S977 470 954 531 C943 565 900 572 820 561 S680 575 570 563 S400 578 285 561 S130 578 69 558 C36 546 28 530 38 460 S26 325 39 260 S26 145 38 94 C44 62 45 48 66 40Z" />
      </svg>
      }
      <div class="caja__papel">
        <ng-content />
      </div>
    </div>
    @if (puntilla()) {
      <div class="puntilla" aria-hidden="true"></div>
    }
  `,
})
export class Caja {
  private readonly marco = viewChild.required<ElementRef<HTMLElement>>('marco');
  private readonly destroyRef = inject(DestroyRef);
  private readonly dimensiones = signal({ ancho: 1000, alto: 600 });
  protected readonly marcoAdaptable = computed(() => this.dimensiones().ancho <= 760 || ['sobre-mi', 'testings', 'tiktok', 'instagram', 'encargo-personalizado'].includes(this.ancla()));
  protected readonly vista = computed(() => `0 0 ${this.dimensiones().ancho} ${this.dimensiones().alto}`);

  constructor() {
    afterNextRender(() => {
      const elemento = this.marco().nativeElement;
      const actualizar = () => {
        if (elemento.clientWidth && elemento.clientHeight) {
          this.dimensiones.set({ ancho: elemento.clientWidth, alto: elemento.clientHeight });
        }
      };
      actualizar();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(actualizar);
      observer.observe(elemento);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /** Ondas de profundidad fija: nunca crecen hacia el texto en las cajas largas. */
  protected contorno(inset: number): string {
    const { ancho: w, alto: h } = this.dimensiones();
    if (w <= 760) {
      const l = 8 + inset * .65, r = w - l, t = 16 + inset * .65, b = h - t;
      const c = Math.min(28, w * .09);
      return `M ${l + c} ${t}
        C ${w * .28} ${t - 9} ${w * .36} ${t + 10} ${w * .52} ${t}
        S ${w * .78} ${t - 8} ${r - c} ${t}
        Q ${r} ${t} ${r} ${t + c}
        C ${r - 5} ${h * .3} ${r + 4} ${h * .65} ${r} ${b - c}
        Q ${r} ${b} ${r - c} ${b}
        C ${w * .72} ${b + 8} ${w * .62} ${b - 9} ${w * .46} ${b}
        S ${w * .2} ${b + 7} ${l + c} ${b}
        Q ${l} ${b} ${l} ${b - c}
        C ${l + 5} ${h * .7} ${l - 4} ${h * .35} ${l} ${t + c}
        Q ${l} ${t} ${l + c} ${t} Z`;
    }
    const l = 12 + inset, r = w - l, t = 20 + inset, b = h - t;
    const c = Math.min(42, w * .09);
    return `M ${l + c} ${t}
      C ${w * .22} ${t - 20} ${w * .24} ${t + 22} ${w * .42} ${t}
      S ${w * .64} ${t - 18} ${w * .74} ${t}
      S ${w * .88} ${t - 12} ${r - c} ${t}
      Q ${r} ${t} ${r} ${t + c}
      C ${r - 12} ${h * .28} ${r + 10} ${h * .35} ${r} ${h * .52}
      S ${r - 12} ${h * .78} ${r} ${b - c}
      Q ${r} ${b} ${r - c} ${b}
      C ${w * .78} ${b + 18} ${w * .7} ${b - 20} ${w * .54} ${b}
      S ${w * .29} ${b + 16} ${w * .2} ${b}
      S ${l + c} ${b - 8} ${l + c} ${b}
      Q ${l} ${b} ${l} ${b - c}
      C ${l + 12} ${h * .72} ${l - 9} ${h * .66} ${l} ${h * .48}
      S ${l + 10} ${h * .25} ${l} ${t + c}
      Q ${l} ${t} ${l + c} ${t} Z`;
  }

  readonly ancla = input.required<string>();
  readonly titulo = input.required<string>();
  readonly color = input<ColorCaja>('cielo');
  readonly giro = input(-2);
  readonly puntilla = input(false);
}
