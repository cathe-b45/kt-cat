import { Injectable } from '@angular/core';
import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as TipoScrollTrigger } from 'gsap/ScrollTrigger';
import type { SplitText as TipoSplitText } from 'gsap/SplitText';

type G = typeof Gsap;
type ST = typeof TipoScrollTrigger;
type SP = typeof TipoSplitText;

/** Piezas que aparecen al hacer scroll (tarjetas, polaroids, láminas…). */
const PIEZAS = [
  '.tarjeta',
  '.rejilla--polaroids > .vit',
  '.mosaico > *',
  '.sobre-mi--intro',
  '.sobre-mi__historia',
  '.creaciones-intro',
  '.tiktok__cabeza',
  '.pie__columnas > *',
].join(', ');

const CHISPAS = ['♥', '✦', '✿', '★', '♥', '✦'];
const COLORES_CHISPA = ['var(--rosa-tinta)', 'var(--cielo-tinta)', 'var(--lavanda-tinta)', 'var(--hilo)', 'var(--salvia-tinta)'];

/** Lo que tiene transición CSS en transform: hay que quitársela mientras anima GSAP. */
const LIMPIAR = 'transform,opacity,transition';

/**
 * Animaciones con GSAP. Solo se cargan en el navegador y solo si la persona
 * no ha pedido "reducir movimiento" en su sistema.
 */
@Injectable({ providedIn: 'root' })
export class AnimacionesService {
  private carga?: Promise<{ gsap: G; ScrollTrigger: ST; SplitText: SP }>;

  private cargar() {
    return (this.carga ??= Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
      import('gsap/DrawSVGPlugin'),
    ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }, { DrawSVGPlugin }]) => {
      gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
      // Las mismas animaciones sirven para todas las páginas y no todas tienen cada pieza
      // (cintas, intros, botones de portada…): si falta, simplemente no se anima, sin avisos.
      gsap.config({ nullTargetWarn: false });
      return { gsap, ScrollTrigger, SplitText };
    }));
  }

  /** Anima todo lo que haya dentro de `raiz`. Devuelve una función que lo deshace. */
  async animar(raiz: HTMLElement): Promise<() => void> {
    const { gsap, ScrollTrigger, SplitText } = await this.cargar();
    const mm = gsap.matchMedia(raiz);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const quitar: (() => void)[] = [];
      this.portada(gsap, SplitText, raiz, quitar);
      this.cajas(gsap, raiz);
      this.piezas(gsap, ScrollTrigger, raiz);
      this.encargos(gsap, raiz);
      this.iconos(gsap, raiz, quitar);
      this.chispas(gsap, raiz, quitar);
      this.recalcular(ScrollTrigger, raiz, quitar);
      return () => quitar.forEach((f) => f());
    });

    return () => mm.revert();
  }

  // ── Portada: la tarjeta entra, el hilo se "cose" y el título salta letra a letra ──
  private portada(gsap: G, SplitText: SP, raiz: HTMLElement, quitar: (() => void)[]) {
    const portada = raiz.querySelector<HTMLElement>('.portada');
    if (!portada) return;
    const q = gsap.utils.selector(portada);
    const botones = q('.boton-grande, .portada__redes .pastilla, .portada__marco');
    gsap.set(botones, { transition: 'none' });

    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });
    tl.fromTo(q('.portada__sombra'), { opacity: 0, x: -24, y: -18 }, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo(q('.portada__tarjeta'), { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '<0.05')
      .from(q('.portada__hilo path'), { drawSVG: '0%', duration: 2.4, ease: 'power1.inOut', stagger: 0.35 }, '<0.2')
      .from(q('.portada__marco'), { opacity: 0, scale: 0.8, rotate: -14, duration: 0.9, clearProps: LIMPIAR }, '<0.1')
      .from(q('.portada__cinta1, .portada__cinta2'), { scaleX: 0, opacity: 0, transformOrigin: 'left center', duration: 0.4, stagger: 0.15, ease: 'power2.out' }, '-=0.35');

    const h1 = q('h1')[0];
    if (h1) {
      const letras = SplitText.create(h1, { type: 'chars' }).chars;
      tl.from(letras, { y: 60, opacity: 0, rotate: () => gsap.utils.random(-25, 25), duration: 0.7, stagger: 0.06 }, 0.45);
    }

    tl.from(q('.boton-grande'), { x: 80, opacity: 0, rotate: 4, duration: 0.6, stagger: 0.08, clearProps: LIMPIAR }, 0.55)
      .from(q('.portada__lema, .portada__redes .pastilla'), { y: 18, opacity: 0, duration: 0.5, stagger: 0.08, clearProps: LIMPIAR }, '-=0.3')
      .from(q('.portada__estrellitas path, .portada__lunitas path'), { scale: 0, opacity: 0, transformOrigin: 'center', duration: 0.5, stagger: 0.07, ease: 'back.out(3)' }, '-=0.6');

    // La foto flota un poquito, como si colgara.
    gsap.to(q('.portada__marco-wrap'), { y: -8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 });

    // El cielo de la foto y el hilo siguen al ratón (parallax suave).
    const cielo = q('.portada__cielo')[0];
    const hilo = q('.portada__hilo')[0];
    if (cielo && hilo && matchMedia('(pointer: fine)').matches) {
      const cx = gsap.quickTo(cielo, 'x', { duration: 0.8, ease: 'power3' });
      const cy = gsap.quickTo(cielo, 'y', { duration: 0.8, ease: 'power3' });
      const hx = gsap.quickTo(hilo, 'x', { duration: 1.2, ease: 'power3' });
      const hy = gsap.quickTo(hilo, 'y', { duration: 1.2, ease: 'power3' });
      const mover = (e: PointerEvent) => {
        const r = portada.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        cx(dx * 14); cy(dy * 14);
        hx(dx * -18); hy(dy * -12);
      };
      portada.addEventListener('pointermove', mover);
      quitar.push(() => portada.removeEventListener('pointermove', mover));
    }
  }

  // ── Cajas de sección: el papel sube y la cinta washi se "pega" ──
  private cajas(gsap: G, raiz: HTMLElement) {
    for (const caja of gsap.utils.toArray<HTMLElement>('.caja', raiz)) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: caja, start: 'top 88%', once: true } });
      tl.from(caja.querySelector('.caja__vichy'), { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from(caja.querySelector('.caja__cinta'), { scaleX: 0, opacity: 0, transformOrigin: 'left center', duration: 0.5, ease: 'back.out(2)' }, '-=0.5')
        .from(caja.querySelectorAll('.caja__intro'), { y: 14, opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.25');
    }
  }

  // ── Tarjetas, polaroids y láminas: aparecen por tandas con un saltito ──
  private piezas(gsap: G, ScrollTrigger: ST, raiz: HTMLElement) {
    const piezas = gsap.utils.toArray<HTMLElement>(PIEZAS, raiz);
    if (!piezas.length) return;
    gsap.set(piezas, { opacity: 0, y: 46, rotate: () => gsap.utils.random(-3, 3), transition: 'none' });

    ScrollTrigger.batch(piezas, {
      start: 'top 92%',
      once: true,
      onEnter: (lote) => {
        gsap.to(lote, { opacity: 1, y: 0, rotate: 0, duration: 0.7, stagger: 0.09, ease: 'back.out(1.5)', clearProps: LIMPIAR });
        const cintas = (lote as HTMLElement[]).flatMap((el) => [...el.querySelectorAll('.testing__cinta, .cinta')]);
        gsap.from(cintas, { scaleX: 0, opacity: 0, transformOrigin: 'left center', duration: 0.45, stagger: 0.09, delay: 0.35, ease: 'back.out(2)' });
      },
    });
  }

  // ── Caja de encargos del pie: la cinta se pega y los botones botan ──
  private encargos(gsap: G, raiz: HTMLElement) {
    const caja = raiz.querySelector<HTMLElement>('.encargos');
    if (!caja) return;
    const botones = caja.querySelectorAll('.pastilla');
    gsap.set(botones, { transition: 'none' });
    gsap.timeline({ scrollTrigger: { trigger: caja, start: 'top 90%', once: true } })
      .from(caja.querySelector('.encargos__cinta'), { scaleX: 0, opacity: 0, transformOrigin: 'left center', duration: 0.5, ease: 'back.out(2)' }, 0.35)
      .from(botones, { scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2.5)', clearProps: LIMPIAR }, 0.5);
  }

  // ── Los iconos de los botones grandes se menean al pasar el ratón ──
  private iconos(gsap: G, raiz: HTMLElement, quitar: (() => void)[]) {
    for (const boton of gsap.utils.toArray<HTMLElement>('.boton-grande', raiz)) {
      const icono = boton.querySelector('.boton-grande__icono');
      if (!icono) continue;
      const menear = () =>
        gsap.fromTo(icono, { rotate: 0 }, { keyframes: { rotate: [0, -16, 12, -6, 0] }, duration: 0.6, ease: 'power1.inOut', overwrite: true });
      boton.addEventListener('pointerenter', menear);
      quitar.push(() => boton.removeEventListener('pointerenter', menear));
    }
  }

  // ── Al pulsar un botón o enlace salen corazoncitos y estrellitas ──
  private chispas(gsap: G, raiz: HTMLElement, quitar: (() => void)[]) {
    const vivas = new Set<HTMLElement>();
    const lanzar = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest('a, button')) return;
      for (let i = 0; i < 7; i++) {
        const chispa = document.createElement('span');
        chispa.className = 'chispa';
        chispa.setAttribute('aria-hidden', 'true');
        chispa.textContent = gsap.utils.random(CHISPAS);
        chispa.style.left = `${e.clientX}px`;
        chispa.style.top = `${e.clientY}px`;
        chispa.style.color = gsap.utils.random(COLORES_CHISPA);
        document.body.append(chispa);
        vivas.add(chispa);
        const angulo = (Math.PI * 2 * i) / 7 + gsap.utils.random(-0.3, 0.3);
        const distancia = gsap.utils.random(26, 48);
        gsap.timeline({ onComplete: () => { chispa.remove(); vivas.delete(chispa); } })
          .fromTo(chispa, { scale: 0.3, opacity: 1 }, {
            x: Math.cos(angulo) * distancia,
            y: Math.sin(angulo) * distancia - 12,
            rotate: gsap.utils.random(-90, 90),
            scale: gsap.utils.random(0.8, 1.2),
            duration: 0.45,
            ease: 'power3.out',
          })
          .to(chispa, { opacity: 0, y: '+=14', scale: 0.4, duration: 0.35, ease: 'power1.in' });
      }
    };
    raiz.addEventListener('pointerdown', lanzar);
    quitar.push(() => {
      raiz.removeEventListener('pointerdown', lanzar);
      vivas.forEach((c) => c.remove());
    });
  }

  /**
   * Interruptor de claro/oscuro: el icono del modo nuevo entra girando con rebote y salen
   * chispitas del tema (estrellas y lunas al oscurecer, destellos y corazones al aclarar).
   * Solo carga GSAP, no los plugins.
   */
  async cambioModo(boton: HTMLElement, oscuro: boolean): Promise<void> {
    if (!window.matchMedia?.('(prefers-reduced-motion: no-preference)').matches) return;
    const { gsap } = await import('gsap');
    const [sol, luna] = Array.from(boton.querySelectorAll('svg'));
    const nuevo = oscuro ? luna : sol;
    const viejo = oscuro ? sol : luna;
    if (nuevo) {
      gsap.fromTo(nuevo, { rotation: oscuro ? -140 : 180, scale: 0.3 },
        { rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(2.4)', clearProps: 'transform' });
    }
    if (viejo) {
      gsap.fromTo(viejo, { rotation: 0, scale: 1 },
        { rotation: oscuro ? 90 : -45, scale: 0.85, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1, clearProps: 'transform' });
    }

    const caja = boton.getBoundingClientRect();
    const simbolos = oscuro ? ['★', '✦', '☾', '✦', '★'] : ['✧', '♥', '✦', '✧', '♥'];
    const cuantas = 10;
    for (let i = 0; i < cuantas; i++) {
      const chispa = document.createElement('span');
      chispa.className = 'chispa';
      chispa.setAttribute('aria-hidden', 'true');
      chispa.textContent = simbolos[i % simbolos.length];
      chispa.style.left = `${caja.left + caja.width / 2}px`;
      chispa.style.top = `${caja.top + caja.height / 2}px`;
      chispa.style.color = gsap.utils.random(COLORES_CHISPA);
      document.body.append(chispa);
      const angulo = (Math.PI * 2 * i) / cuantas + gsap.utils.random(-0.25, 0.25);
      const distancia = gsap.utils.random(40, 72);
      gsap.timeline({ delay: i * 0.015, onComplete: () => chispa.remove() })
        .fromTo(chispa, { scale: 0.2, opacity: 1 }, {
          x: Math.cos(angulo) * distancia,
          y: Math.sin(angulo) * distancia,
          rotate: gsap.utils.random(-120, 120),
          scale: gsap.utils.random(0.9, 1.4),
          duration: 0.55,
          ease: 'power3.out',
        })
        .to(chispa, { opacity: 0, y: '+=16', scale: 0.4, duration: 0.4, ease: 'power1.in' });
    }
  }

  // Instagram y TikTok cargan tarde y cambian la altura: recalcula los disparadores.
  private recalcular(ScrollTrigger: ST, raiz: HTMLElement, quitar: (() => void)[]) {
    let espera: ReturnType<typeof setTimeout> | undefined;
    const obs = new ResizeObserver(() => {
      clearTimeout(espera);
      espera = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    obs.observe(raiz);
    quitar.push(() => { obs.disconnect(); clearTimeout(espera); });
  }
}

