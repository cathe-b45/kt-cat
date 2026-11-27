import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PATRONES } from '../datos/contenido';
import { IdiomaService } from '../i18n/idioma.service';
import { Foto } from './foto';
import { Icono } from './icono';

/** Plantilla común: cada entrada de PATRONES aporta los datos de su página. */
@Component({
  selector: 'kt-patron-detalle',
  imports: [RouterLink, Foto, Icono],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="patron-volver" [routerLink]="['/', idioma(), 'patrones']">
      <span aria-hidden="true">←</span> {{ t().volverPatrones }}
    </a>
    @if (patron(); as p) {
      <article class="patron-detalle">
        <div class="patron-detalle__texto">
          <h1>{{ p.nombre }}</h1>
          <div class="patron-detalle__nivel">
            <span>{{ t().dificultad }}</span>
            <div class="dificultad" role="img" [attr.aria-label]="t().niveles[p.nivel - 1]">
              @for (n of [1, 2, 3]; track n) {
                <kt-icono nombre="ovillo" [tamano]="26" [class.lleno]="n <= p.nivel" />
              }
              <span>{{ t().niveles[p.nivel - 1] }}</span>
            </div>
          </div>
          <p>{{ p.descripcion[idioma()] }}</p>
        </div>
        <figure class="patron-detalle__imagen">
          <span class="cinta cinta--rosa" aria-hidden="true"></span>
          <kt-foto [src]="p.foto" [alt]="p.nombre" fondo="var(--cielo)" tinta="var(--cielo-tinta)" />
        </figure>
      </article>
    }
  `,
})
export class PatronDetalle {
  readonly slug = input.required<string>();
  protected readonly patron = computed(() => PATRONES.find((p) => p.slug === this.slug()));
  private readonly i18n = inject(IdiomaService);
  protected readonly t = this.i18n.t;
  protected readonly idioma = this.i18n.idioma;
}
