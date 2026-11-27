import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REDES } from '../datos/contenido';
import { IdiomaService } from '../i18n/idioma.service';
import { Icono } from './icono';

@Component({
  selector: 'kt-pie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icono],
  host: { class: 'pie' },
  template: `
    <div class="pie__ondas" aria-hidden="true"></div>
    <div class="pie__columnas">
      <div class="pie__marca">
        <span class="pie__logo">kt.cat</span>
        <p>{{ t().lema }}</p>
        <div class="pie__redes">
          <a class="circulo blandito" [href]="'https://www.instagram.com/' + redes.instagram" aria-label="Instagram"><kt-icono nombre="instagram" /></a>
          <a class="circulo blandito" [href]="'https://www.tiktok.com/@' + redes.tiktok" aria-label="TikTok"><kt-icono nombre="tiktok" /></a>
          <a class="circulo blandito" [href]="'mailto:' + redes.correo" [attr.aria-label]="t().correo"><kt-icono nombre="correo" /></a>
        </div>
      </div>

      <nav class="pie__nav" [attr.aria-label]="t().explorar">
        <span class="titulo-mano">{{ t().explorar }}</span>
        <a [routerLink]="['/', idioma(), 'patrones']">{{ t().navPatrones }}</a>
        <a [routerLink]="['/', idioma(), 'testings']">{{ t().navTestings }}</a>
        <a [routerLink]="['/', idioma(), 'trabajos']">{{ t().navTrabajos }}</a>
        <a [routerLink]="['/', idioma(), 'ilustracion']">{{ t().navIlustracion }}</a>
        <a [routerLink]="['/', idioma(), 'trabajos']" fragment="tiktok">TikTok</a>
        <a [routerLink]="['/', idioma(), 'trabajos']" fragment="instagram">Instagram</a>
        <a [routerLink]="['/', idioma(), 'sobre-mi']">{{ t().navSobre }}</a>
        <a [routerLink]="['/', idioma(), 'encargos']">{{ t().navEncargos }}</a>
      </nav>

      <div class="encargos" id="encargos">
        <span class="cinta cinta--rosa encargos__cinta" aria-hidden="true"></span>
        <span class="titulo-mano">{{ t().encargoTitulo }}</span>
        <p>{{ t().encargoTexto }}</p>
        <div class="encargos__botones">
          <a class="pastilla pastilla--cielo blandito" [href]="'https://ig.me/m/' + redes.instagram">
            <kt-icono nombre="instagram" [tamano]="18" />{{ t().dmInsta }}
          </a>
          <a class="pastilla pastilla--rosa blandito" [href]="'https://www.tiktok.com/@' + redes.tiktok">
            <kt-icono nombre="tiktok" [tamano]="18" />{{ t().dmTiktok }}
          </a>
        </div>
      </div>
    </div>
    <div class="puntadas pie__puntadas" aria-hidden="true"></div>
    <p class="pie__firma">{{ t().pie }}</p>
  `,
})
export class Pie {
  private readonly i18n = inject(IdiomaService);
  protected readonly t = this.i18n.t;
  protected readonly idioma = this.i18n.idioma;
  protected readonly redes = REDES;
}
