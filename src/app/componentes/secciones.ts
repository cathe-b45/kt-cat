import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FOTO_SOBRE_MI,
  ILUSTRACIONES,
  PATRONES,
  REDES,
  TESTINGS,
  TRABAJOS,
} from '../datos/contenido';
import { IdiomaService } from '../i18n/idioma.service';
import { InstagramService } from '../servicios/instagram.service';
import { Caja } from './caja';
import { Foto } from './foto';
import { Icono } from './icono';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WidgetSocial } from './widget-social';

const FONDOS = ['var(--cielo)', 'var(--rosa)', 'var(--salvia)', 'var(--arena)', 'var(--lavanda)'];
const CINTAS = ['cinta--rosa', 'cinta--cielo', 'cinta--salvia', 'cinta--arena', 'cinta--lavanda'];
const GIROS = [-2, 1.5, -1, 2, -1.5, 1];

// ───────────── Patrones gratis ─────────────
@Component({
  selector: 'kt-patrones',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Caja, Foto, Icono, RouterLink],
  template: `
    <kt-caja ancla="patrones" [titulo]="t().patTitulo" color="cielo" [puntilla]="true">
      <p class="caja__intro">{{ t().patTexto }}</p>
      <div class="rejilla rejilla--230">
        @for (p of patrones; track p.slug) {
          <article class="tarjeta">
            <kt-foto class="tarjeta__foto" [src]="p.foto" [alt]="p.nombre" fondo="var(--cielo)" tinta="var(--cielo-tinta)" />
            <div class="tarjeta__cuerpo">
              <h3>{{ p.nombre }}</h3>
              <div class="dificultad" role="img" [attr.aria-label]="t().dificultad + ' ' + p.nivel + ' ' + t().de + ' 3'">
                @for (n of [1, 2, 3]; track n) {
                  <kt-icono nombre="ovillo" [tamano]="22" [class.lleno]="n <= p.nivel" />
                }
                <span>{{ t().niveles[p.nivel - 1] }}</span>
              </div>
              <p class="tenue">{{ p.detalle[idioma()] }}</p>
              <a class="pastilla pastilla--cielo blandito" [routerLink]="['/', idioma(), 'patrones', p.slug]">{{ t().irPatron }} <span aria-hidden="true">→</span></a>
            </div>
          </article>
        }
      </div>
    </kt-caja>
  `,
})
export class Patrones {
  private readonly i18n = inject(IdiomaService);
  protected readonly t = this.i18n.t;
  protected readonly idioma = this.i18n.idioma;
  protected readonly patrones = PATRONES;
}

// ───────────── Testings ─────────────
@Component({
  selector: 'kt-testings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Caja, Foto],
  template: `
    <kt-caja ancla="testings" [titulo]="t().testTitulo" color="rosa" [giro]="1.5">
      <p class="caja__intro">{{ t().testTexto }}</p>
      <div class="rejilla rejilla--280">
        @for (p of testings; track $index) {
          <article class="tarjeta tarjeta--testing" [id]="'testing-' + $index">
            <div class="testing__recuerdo">
              <span class="testing__cinta" aria-hidden="true"></span>
              <button class="testing__abrir" type="button" (click)="abrir($index)" [disabled]="!p.imagenes.length"
                [attr.aria-label]="t().ampliar + ': ' + p.nombre" aria-haspopup="dialog">
                <kt-foto class="testing__foto" [src]="p.imagenes[0]" [alt]="p.nombre" fondo="var(--rosa)" tinta="var(--rosa-tinta)" />
                @if (p.imagenes.length) {
                  <span class="testing__ampliar" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
                      <circle cx="10" cy="10" r="6.5" /><path d="m15 15 5 5M7 10h6M10 7v6" />
                    </svg>
                    <span class="testing__ayuda">{{ t().ampliar }}</span>
                  </span>
                }
              </button>
            </div>
            <div class="tarjeta__cuerpo">
              <span class="etiqueta-testing">testing</span>
              <h3>{{ p.nombre }}</h3>
              <p class="tenue">{{ t().disenoDe }} {{ p.disenadora }}</p>
              @if (p.enlace && p.enlace !== '#') {
                <a class="testing__enlace" [href]="p.enlace" target="_blank" rel="noopener noreferrer">
                  {{ t().verPatron }} <span aria-hidden="true">↗</span>
                </a>
              }
            </div>
          </article>
        }
      </div>
    </kt-caja>
    <dialog #visorTesting class="visor visor--testing" aria-labelledby="testing-titulo"
      (close)="seleccionado.set(-1)" (click)="cerrarSiFondo($event)" (keydown)="teclas($event)">
      @if (testing(); as p) {
        <div class="testing__galeria">
          <header><h2 id="testing-titulo">{{ p.nombre }}</h2><p>{{ t().disenoDe }} {{ p.disenadora }}</p></header>
          <img class="visor__imagen" [src]="p.imagenes[indiceFoto()]" [alt]="p.nombre + ' · ' + (indiceFoto() + 1)" />
          @if (p.imagenes.length > 1) {
            <div class="testing__miniaturas">
              @for (foto of p.imagenes; track foto) {
                <button type="button" (click)="indiceFoto.set($index)" [attr.aria-pressed]="indiceFoto() === $index"
                  [attr.aria-label]="t().ampliar + ' ' + ($index + 1)">
                  <img [src]="foto" alt="" />
                </button>
              }
            </div>
          }
          <span aria-live="polite">{{ indiceFoto() + 1 }} / {{ p.imagenes.length }}</span>
        </div>
        <button type="button" autofocus class="visor__boton visor__cerrar circulo" (click)="cerrar()" [attr.aria-label]="t().cerrar">✕</button>
        @if (p.imagenes.length > 1) {
          <button type="button" class="visor__boton visor__anterior circulo" (click)="mover(-1)" [attr.aria-label]="t().anterior">‹</button>
          <button type="button" class="visor__boton visor__siguiente circulo" (click)="mover(1)" [attr.aria-label]="t().siguiente">›</button>
        }
      }
    </dialog>
  `,
})
export class Testings {
  protected readonly t = inject(IdiomaService).t;
  protected readonly testings = TESTINGS.map(p => ({
    ...p, imagenes: [...new Set([p.foto, ...(p.fotos ?? [])].filter((foto): foto is string => !!foto))],
  }));
  protected readonly seleccionado = signal(-1);
  protected readonly indiceFoto = signal(0);
  protected readonly testing = computed(() => this.testings[this.seleccionado()]);
  private readonly visor = viewChild.required<ElementRef<HTMLDialogElement>>('visorTesting');

  protected abrir(indice: number) {
    if (!this.testings[indice]?.imagenes.length) return;
    this.indiceFoto.set(0);
    this.seleccionado.set(indice);
    this.visor().nativeElement.showModal();
  }

  protected cerrar() { this.visor().nativeElement.close(); }

  protected mover(paso: number) {
    const total = this.testing()?.imagenes.length ?? 0;
    if (total) this.indiceFoto.update(i => (i + paso + total) % total);
  }

  protected teclas(evento: KeyboardEvent) {
    if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
      evento.preventDefault();
      this.mover(evento.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  protected cerrarSiFondo(evento: MouseEvent) {
    if (evento.target === this.visor().nativeElement) this.cerrar();
  }
}

// ───────────── Trabajos terminados (Instagram) ─────────────
@Component({
  selector: 'kt-trabajos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Caja, Foto],
  template: `
    <kt-caja ancla="trabajos" [titulo]="t().trabTitulo" color="salvia" [puntilla]="true">
      <p class="caja__intro">{{ t().trabTexto }}</p>
      <div class="rejilla rejilla--200 rejilla--polaroids">
        @for (p of piezas(); track $index) {
          <div class="vit">
            <span class="bocadillo" aria-hidden="true">{{ t().bocadillos[($index % 4) + 1] }}</span>
            <a target="_blank" rel="noopener noreferrer" class="polaroid polaroid--trabajo" [href]="p.enlace || null" [style.rotate]="giros[$index % giros.length] + 'deg'">
              <span [class]="'cinta ' + cintas[$index % cintas.length]" aria-hidden="true"></span>
              <kt-foto [src]="p.foto" [alt]="p.nombre" [fondo]="fondos[$index % fondos.length]" />
              <span class="polaroid__nombre">{{ p.nombre }}</span>
            </a>
          </div>
        }
      </div>
    </kt-caja>
  `,
})
export class Trabajos {
  protected readonly t = inject(IdiomaService).t;
  private readonly instagram = inject(InstagramService);
  protected readonly giros = GIROS;
  protected readonly cintas = CINTAS;
  protected readonly fondos = FONDOS;

  /** Si hay publicaciones de Instagram descargadas, se usan; si no, los huecos de contenido.ts. */
  protected readonly piezas = computed(() => {
    const ig = this.instagram.publicaciones();
    if (ig.length) {
      return ig.slice(0, 8).map((p) => ({ nombre: p.texto, foto: p.imagen, enlace: p.enlace }));
    }
    return TRABAJOS;
  });

  constructor() {
    afterNextRender(() => this.instagram.cargar());
  }
}

// ───────────── Ilustración ─────────────
@Component({
  selector: 'kt-ilustraciones',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Caja, Foto],
  template: `
    <kt-caja ancla="ilustracion" [titulo]="t().ilusTitulo" color="lavanda" [puntilla]="true">
      <p class="caja__intro">{{ t().ilusTexto }}</p>
      <div class="mosaico">
        @for (i of ilustraciones; track $index) {
          <figure [id]="'ilustracion-' + $index" [class]="'polaroid lamina lamina--' + i.forma" [style.rotate]="giros[$index % giros.length] + 'deg'">
            <span [class]="'cinta ' + cintas[$index % cintas.length]" aria-hidden="true"></span>
            @if (i.foto) {
              <button type="button" class="lamina__ampliar" (click)="abrir(i.foto)" [attr.aria-label]="t().ampliar + ': ' + i.alt">
                <kt-foto [src]="i.foto" [alt]="i.alt" />
              </button>
            } @else {
              <kt-foto [alt]="i.alt" fondo="var(--lavanda)" tinta="var(--lavanda-tinta)" hueco="[ILUSTRACIÓN]" />
            }
          </figure>
        }
      </div>
    </kt-caja>

    <!-- Visor a pantalla completa -->
    <dialog #visor class="visor" (close)="actual.set(-1)" (click)="cerrarSiFondo($event)" (keydown)="teclas($event)">
      @if (dibujo(); as d) {
        <img class="visor__imagen" [src]="d.foto" [alt]="d.alt" />
        <button type="button" class="visor__boton visor__cerrar circulo" (click)="cerrar()" [attr.aria-label]="t().cerrar">✕</button>
        @if (conFoto.length > 1) {
          <button type="button" class="visor__boton visor__anterior circulo" (click)="mover(-1)" [attr.aria-label]="t().anterior">‹</button>
          <button type="button" class="visor__boton visor__siguiente circulo" (click)="mover(1)" [attr.aria-label]="t().siguiente">›</button>
          <span class="visor__contador">{{ actual() + 1 }} / {{ conFoto.length }}</span>
        }
      }
    </dialog>
  `,
})
export class Ilustraciones {
  protected readonly t = inject(IdiomaService).t;
  protected readonly ilustraciones = ILUSTRACIONES;
  protected readonly giros = GIROS;
  protected readonly cintas = CINTAS;

  /** Solo las ilustraciones que ya tienen dibujo se pueden ampliar. */
  protected readonly conFoto = ILUSTRACIONES.filter((i) => !!i.foto);
  protected readonly actual = signal(-1);
  protected readonly dibujo = computed(() => this.conFoto[this.actual()]);
  private readonly visor = viewChild.required<ElementRef<HTMLDialogElement>>('visor');

  protected abrir(foto: string) {
    this.actual.set(this.conFoto.findIndex((i) => i.foto === foto));
    this.visor().nativeElement.showModal();
  }

  protected cerrar() {
    this.visor().nativeElement.close();
  }

  protected mover(paso: number) {
    const total = this.conFoto.length;
    this.actual.update((n) => (n + paso + total) % total);
  }

  /** Cierra al pulsar fuera del dibujo. */
  protected cerrarSiFondo(e: MouseEvent) {
    if (e.target === this.visor().nativeElement) this.cerrar();
  }

  protected teclas(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') this.mover(-1);
    if (e.key === 'ArrowRight') this.mover(1);
  }
}

// ───────────── TikTok: vídeos propios en marcos de móvil ─────────────
const TXT_REDES = {
  es: { verPerfil: 'Ver mi perfil', verVideo: 'Ver vídeo', enTiktok: 'en TikTok', enInsta: 'en Instagram', abrir: 'Abrir en TikTok' },
  en: { verPerfil: 'See my profile', verVideo: 'Watch video', enTiktok: 'on TikTok', enInsta: 'on Instagram', abrir: 'Open in TikTok' },
  fr: { verPerfil: 'Voir mon profil', verVideo: 'Voir la vidéo', enTiktok: 'sur TikTok', enInsta: 'sur Instagram', abrir: 'Ouvrir dans TikTok' },
};

interface VideoTikTok {
  id: string;
  enlace: string;
  portada?: string;
  titulo?: string;
}

@Component({
  selector: 'kt-tiktok',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Caja, Icono, WidgetSocial],
  template: `
    <kt-caja ancla="tiktok" titulo="TikTok" color="rosa" [giro]="2" [puntilla]="true">
      <div class="tiktok__cabeza">
        <p>{{ t().tiktokTexto }}</p>
      </div>

      <div class="red-con-widget">
        <div class="tiktok__marco-perfil">
          <a class="pastilla pastilla--rosa tiktok__etiqueta" [href]="perfil" target="_blank" rel="noopener noreferrer">
            <kt-icono nombre="tiktok" [tamano]="18" />&#64;{{ usuario }}
          </a>
          <kt-widget-social red="tiktok" [usuario]="usuario" [perfil]="perfil" />
        </div>
      </div>
    </kt-caja>

    <dialog #reproductor class="visor visor--tiktok" (close)="actual.set(-1)" (click)="cerrarSiFondo($event)">
      @if (video(); as v) {
        <div class="reproductor">
          <iframe [src]="v.url" [title]="v.titulo || 'TikTok'" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>
          <a class="pastilla pastilla--rosa" [href]="v.enlace" target="_blank" rel="noopener noreferrer">{{ tx().abrir }} →</a>
        </div>
      }
      <button type="button" class="visor__boton visor__cerrar circulo" (click)="cerrar()" [attr.aria-label]="t().cerrar">✕</button>
    </dialog>
  `,
})
export class TikTok {
  private readonly i18n = inject(IdiomaService);
  private readonly saneador = inject(DomSanitizer);
  protected readonly t = this.i18n.t;
  protected readonly tx = computed(() => TXT_REDES[this.i18n.idioma()]);
  protected readonly usuario = REDES.tiktok;
  protected readonly perfil = 'https://www.tiktok.com/@' + REDES.tiktok;
  protected readonly giros = GIROS;
  protected readonly videos = signal<VideoTikTok[]>([]);
  protected readonly actual = signal(-1);
  private readonly reproductor = viewChild.required<ElementRef<HTMLDialogElement>>('reproductor');

  /** El vídeo se ve con el reproductor oficial de TikTok, sin el widget entero. */
  protected readonly video = computed(() => {
    const v = this.videos()[this.actual()];
    if (!v) return null;
    const url = `https://www.tiktok.com/player/v1/${v.id}?autoplay=1&loop=1&rel=0&music_info=0&description=0`;
    return { ...v, url: this.saneador.bypassSecurityTrustResourceUrl(url) as SafeResourceUrl };
  });

  constructor() {
    afterNextRender(() => void this.cargar());
  }

  /**
   * Tus últimos vídeos, que descarga la GitHub Action desde la API de TikTok
   * (public/data/tiktok.json). Mientras no haya, se ve la tarjeta con tu perfil.
   */
  private async cargar() {
    try {
      const r = await fetch('data/tiktok.json');
      if (!r.ok) return;
      const videos: VideoTikTok[] = (await r.json()).videos ?? [];
      this.videos.set(videos.filter((v) => v.id && v.enlace));
    } catch {}
  }

  protected abrir(i: number) {
    this.actual.set(i);
    this.reproductor().nativeElement.showModal();
  }

  protected cerrar() {
    this.reproductor().nativeElement.close();
  }

  protected cerrarSiFondo(e: MouseEvent) {
    if (e.target === this.reproductor().nativeElement) this.cerrar();
  }
}

// ───────────── Sobre mí + Novedades ─────────────
@Component({
  selector: 'kt-sobre-mi',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Caja, Foto],
  host: { class: 'fila-final' },
  template: `
    <kt-caja ancla="sobre-mi" [titulo]="t().navSobre" color="rosa" [giro]="2">
      <div class="sobre-mi sobre-mi--intro">
        @if (foto) {
          <div class="polaroid sobre-mi__foto">
            <kt-foto [src]="foto" alt="Cathe" fondo="var(--rosa)" tinta="var(--rosa-tinta)" />
          </div>
        }
        <div>
          <h3 class="titulo-mano">{{ t().sobreTitulo }}</h3>
          <p>{{ t().sobreNombre }}</p>
          <p>{{ t().sobreTexto[0] }}</p>
        </div>
      </div>
      <div class="sobre-mi__historias">
        @for (bloque of bloques; track bloque.imagen; let i = $index) {
          <section class="sobre-mi__historia" [class.sobre-mi__historia--inversa]="i === 1">
            <figure class="sobre-mi__ilustracion">
              <span class="cinta cinta--lavanda" aria-hidden="true"></span>
              <img [src]="'ilustraciones/' + bloque.imagen + '.webp'" alt="" [width]="bloque.ancho" [height]="bloque.alto" loading="lazy" decoding="async" />
            </figure>
            <div class="sobre-mi__relato">
              <h3>{{ titulos[idioma()][i] }}</h3>
              @for (indice of bloque.parrafos; track indice) {
                <p>{{ t().sobreTexto[indice] }}</p>
              }
            </div>
          </section>
        }
      </div>
    </kt-caja>


  `,
})
export class SobreMi {
  private readonly i18n = inject(IdiomaService);
  protected readonly t = this.i18n.t;
  protected readonly idioma = this.i18n.idioma;
  protected readonly foto = FOTO_SOBRE_MI;
  protected readonly bloques = [
    { imagen: 'moguri', ancho: 1200, alto: 1718, parrafos: [1, 2] },
    { imagen: 'hu-tao', ancho: 1200, alto: 1718, parrafos: [3] },
    { imagen: 'chica-hamster', ancho: 1200, alto: 1294, parrafos: [4] },
  ];
  protected readonly titulos = {
    es: ['Lo que me gusta', 'Mis dibujos', 'Venti, mi pequeña supervisora'],
    en: ['Things I love', 'My drawings', 'Venti, my little supervisor'],
    fr: ['Ce que j’aime', 'Mes dessins', 'Venti, mon petit assistant'],
  };
}

// ───────────── Instagram: últimas fotos como polaroids ─────────────
// Las publicaciones las descarga la GitHub Action (public/data/instagram.json).
// Mientras no haya, se ve una tarjeta con tu perfil y algunas de tus fotos.
@Component({
  selector: 'kt-instagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Caja, Icono, WidgetSocial],
  template: `
    <kt-caja ancla="instagram" titulo="Instagram" color="cielo" [puntilla]="true">
      <div class="tiktok__cabeza">
        <p>{{ t().instagramTexto }}</p>
      </div>

      <div class="red-con-widget">
        <div class="tiktok__marco-perfil">
          <a class="pastilla pastilla--cielo tiktok__etiqueta" [href]="perfil" target="_blank" rel="noopener noreferrer">
            <kt-icono nombre="instagram" [tamano]="18" />&#64;{{ usuario }}
          </a>
          <kt-widget-social red="instagram" [usuario]="usuario" [perfil]="perfil" />
        </div>
      </div>
    </kt-caja>
  `,
})
export class Instagram {
  private readonly i18n = inject(IdiomaService);
  private readonly instagram = inject(InstagramService);
  protected readonly t = this.i18n.t;
  protected readonly tx = computed(() => TXT_REDES[this.i18n.idioma()]);
  protected readonly usuario = REDES.instagram;
  protected readonly perfil = 'https://www.instagram.com/' + REDES.instagram;
  protected readonly giros = GIROS;
  protected readonly publicaciones = computed(() => this.instagram.publicaciones().slice(0, 9));
  /** Fotos tuyas de los testings para la tarjeta de perfil. */
  protected readonly muestras = TESTINGS.map((p) => p.foto).filter((f): f is string => !!f).slice(0, 6);

  constructor() {
    afterNextRender(() => this.instagram.cargar());
  }
}
