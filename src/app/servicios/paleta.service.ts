import { DOCUMENT } from '@angular/common';
import { Injectable, afterNextRender, inject, signal } from '@angular/core';

export type Paleta = 'pastel' | 'tierra' | 'blossom';
const CLAVE = 'kt-cat-paleta';
const CLAVE_MODO = 'kt-cat-modo';

@Injectable({ providedIn: 'root' })
export class PaletaService {
  private readonly documento = inject(DOCUMENT);
  private readonly seleccion = signal<Paleta>('blossom');
  readonly actual = this.seleccion.asReadonly();
  private readonly modoOscuro = signal(false);
  readonly oscuro = this.modoOscuro.asReadonly();

  constructor() {
    afterNextRender(() => {
      try {
        this.aplicar(this.documento.defaultView?.localStorage.getItem(CLAVE));
        this.aplicarModo(this.documento.defaultView?.localStorage.getItem(CLAVE_MODO) === 'oscuro');
      } catch {
        // La paleta sigue funcionando aunque el navegador bloquee el almacenamiento.
      }
    });
  }

  /**
   * Cambia entre claro y oscuro. Si se pasa `origen` (un punto de la pantalla), el tema
   * nuevo entra desde la derecha al oscurecer y desde la izquierda al aclarar.
   * Sin soporte del navegador o con
   * "reducir movimiento" activado, el cambio es instantáneo.
   */
  alternarModo(origen?: { x: number; y: number }): void {
    const oscuro = !this.oscuro();
    const ventana = this.documento.defaultView;
    const doc = this.documento as Document & {
      startViewTransition?: (cambio: () => void) => { ready: Promise<void>; finished: Promise<void> };
    };
    const reducir = ventana?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true;

    if (!origen || !ventana || !doc.startViewTransition || reducir) {
      this.aplicarModo(oscuro);
    } else {
      const raiz = this.documento.documentElement;
      const x = oscuro ? ventana.innerWidth : 0;
      const y = ventana.innerHeight / 2;
      const radio = Math.hypot(
        ventana.innerWidth,
        ventana.innerHeight / 2,
      );
      raiz.classList.add('cambiando-modo');
      const transicion = doc.startViewTransition(() => this.aplicarModo(oscuro));
      transicion.ready
        .then(() =>
          raiz.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
            { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
          ),
        )
        .catch(() => {});
      transicion.finished.finally(() => raiz.classList.remove('cambiando-modo')).catch(() => {});
    }

    try {
      this.documento.defaultView?.localStorage.setItem(CLAVE_MODO, oscuro ? 'oscuro' : 'claro');
    } catch {
      // El cambio visual no depende del almacenamiento.
    }
  }

  private aplicarModo(oscuro: boolean): void {
    this.modoOscuro.set(oscuro);
    this.documento.documentElement.dataset['modo'] = oscuro ? 'oscuro' : 'claro';
    this.actualizarColorNavegador();
  }

  private actualizarColorNavegador(): void {
    const colores = this.oscuro()
      ? { pastel: '#241f28', tierra: '#211e1a', blossom: '#19182b' }
      : { pastel: '#f6f1ea', tierra: '#f3eee5', blossom: '#f3f3fc' };
    this.documento.querySelector('meta[name="theme-color"]')?.setAttribute('content', colores[this.actual()]);
  }

  elegir(valor: string): void {
    if (!this.aplicar(valor)) return;
    try {
      this.documento.defaultView?.localStorage.setItem(CLAVE, valor);
    } catch {
      // Conservamos la elección durante esta sesión.
    }
  }

  private aplicar(valor: unknown): boolean {
    if (valor !== 'pastel' && valor !== 'tierra' && valor !== 'blossom') return false;
    this.seleccion.set(valor);
    this.documento.documentElement.dataset['paleta'] = valor;
    this.actualizarColorNavegador();
    return true;
  }
}
