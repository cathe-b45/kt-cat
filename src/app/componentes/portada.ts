import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FOTO_PORTADA, REDES } from '../datos/contenido';
import { IdiomaService } from '../i18n/idioma.service';
import { Foto } from './foto';
import { Icono, NombreIcono } from './icono';

@Component({
  selector: 'kt-portada',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Foto, Icono],
  styleUrl: './portada.scss',
  host: { class: 'portada', id: 'inicio' },
  template: `
    <div class="portada__sombra" aria-hidden="true"></div>
    <svg class="portada__hilo" viewBox="0 0 1200 700" fill="none" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M-30 530C80 660 180 640 170 540S20 475 70 570C130 680 370 650 490 605S700 510 830 580S1110 710 1230 540" />
      <path d="M850 30C980 100 1080-25 1140 65S1080 195 1050 125S1170 65 1230 155" />
    </svg>
    <div class="portada__tarjeta">
      <div class="portada__izq">
        <div class="vit portada__marco-wrap">
          <span class="bocadillo" aria-hidden="true">{{ t().bocadillos[0] }}</span>
          <div class="polaroid vichy vichy--rosa portada__marco">
            <div class="portada__retrato">
              <svg class="portada__cielo" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                <g class="portada__corazones">
                  <g transform="translate(18 25)">
                    <path d="M0 6C-12-1-6-10 0-4C6-10 12-1 0 6Z" fill="var(--rosa-tinta)" opacity=".5" />
                  </g>
                  <g transform="translate(83 61) scale(.8)">
                    <path d="M0 6C-12-1-6-10 0-4C6-10 12-1 0 6Z" fill="var(--cielo-tinta)" opacity=".45" />
                  </g>
                </g>
                <g class="portada__lunitas">
                  <path d="M22 16C13 19 14 30 23 31C17 36 9 30 11 23C12 19 17 15 22 16Z" />
                  <path d="M86 55C80 57 81 64 87 65C82 69 76 64 78 59C79 56 83 54 86 55Z" />
                </g>
                <g class="portada__estrellitas">
                  <path d="m78 17 1.8 4 4.4.5-3.3 3 .9 4.3-3.8-2.2-3.8 2.2.9-4.3-3.3-3 4.4-.5Z" />
                  <path d="m15 51 1.4 3.2 3.5.4-2.6 2.4.7 3.4-3-1.7-3 1.7.7-3.4-2.6-2.4 3.5-.4Z" />
                  <path d="m88 37 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" />
                  <path d="m24 74 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" />
                </g>
                <g class="portada__polvo">
                  <circle cx="28" cy="12" r=".65" /><circle cx="10" cy="42" r=".8" />
                  <circle cx="24" cy="41" r=".55" /><circle cx="84" cy="31" r=".7" />
                  <circle cx="91" cy="50" r=".5" /><circle cx="73" cy="12" r=".5" />
                  <circle cx="13" cy="68" r=".65" /><circle cx="81" cy="76" r=".8" />
                </g>
              </svg>
              <kt-foto [src]="foto" alt="Cathe & Venti" fondo="var(--papel)" />
            </div>
          </div>
          <span class="cinta cinta--salvia portada__cinta1" aria-hidden="true"></span>
          <span class="cinta cinta--cielo portada__cinta2" aria-hidden="true"></span>
        </div>
        <p class="portada__lema">{{ t().lema }}</p>
        <div class="portada__redes">
          <a class="pastilla pastilla--cielo blandito" [href]="'https://www.instagram.com/' + redes.instagram">
            <kt-icono nombre="instagram" [tamano]="16" />&#64;{{ redes.instagram }}
          </a>
          <a class="pastilla pastilla--rosa blandito" [href]="'https://www.tiktok.com/@' + redes.tiktok">
            <kt-icono nombre="tiktok" [tamano]="16" />&#64;{{ redes.tiktok }}
          </a>
        </div>
      </div>

      <div class="portada__der">
        <h1>kt.cat</h1>
        @for (b of botones(); track b.ancla) {
          <a class="boton-grande blandito" [routerLink]="['/', idioma(), b.ancla]" [style.background]="b.fondo" [style.color]="b.tinta">
            <span class="boton-grande__texto">{{ b.texto }}</span>
            <span class="boton-grande__icono" aria-hidden="true"><kt-icono [nombre]="b.icono" [tamano]="26" /></span>
          </a>
        }
      </div>
    </div>
  `,
})
export class Portada {
  private readonly i18n = inject(IdiomaService);
  protected readonly t = this.i18n.t;
  protected readonly idioma = this.i18n.idioma;
  protected readonly foto = FOTO_PORTADA;
  protected readonly redes = REDES;

  protected readonly botones = computed(() => {
    const t = this.t();
    const lista: { ancla: string; texto: string; icono: NombreIcono; fondo: string; tinta: string }[] = [
      { ancla: 'patrones', texto: t.navPatrones, icono: 'regalo', fondo: 'var(--cielo)', tinta: 'var(--cielo-tinta)' },
      { ancla: 'testings', texto: t.navTestings, icono: 'lupa', fondo: 'var(--rosa)', tinta: 'var(--rosa-tinta)' },
      { ancla: 'trabajos', texto: t.navTrabajos, icono: 'corazon', fondo: 'var(--salvia)', tinta: 'var(--salvia-tinta)' },
      { ancla: 'ilustracion', texto: t.navIlustracion, icono: 'pincel', fondo: 'var(--lavanda)', tinta: 'var(--lavanda-tinta)' },
      { ancla: 'sobre-mi', texto: t.navSobre, icono: 'ovillo', fondo: 'var(--arena)', tinta: 'var(--texto)' },
    ];
    return lista;
  });
}
