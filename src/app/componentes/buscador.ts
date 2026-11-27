import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ILUSTRACIONES, PATRONES, TESTINGS } from '../datos/contenido';
import { IdiomaService } from '../i18n/idioma.service';

export function coincideBusqueda(texto: string, consulta: string): boolean {
  const normalizar = (valor: string) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return normalizar(consulta).trim().split(/\s+/).every(palabra => normalizar(texto).includes(palabra));
}

const ETIQUETAS = {
  es: { buscar: 'Buscar', ejemplo: 'Prueba «Maomao», «Hu Tao»…', vacio: 'No encuentro resultados. Prueba otro nombre o una diseñadora.', ayuda: 'Busca por nombre, personaje o diseñadora.', resultados: 'resultados', limpiar: 'Borrar búsqueda' },
  en: { buscar: 'Search', ejemplo: 'Try “Maomao”, “Hu Tao”…', vacio: 'No results found. Try another name or designer.', ayuda: 'Search by name, character or designer.', resultados: 'results', limpiar: 'Clear search' },
  fr: { buscar: 'Rechercher', ejemplo: 'Essaie « Maomao », « Hu Tao »…', vacio: 'Aucun résultat. Essaie un autre nom ou une créatrice.', ayuda: 'Recherche par nom, personnage ou créatrice.', resultados: 'résultats', limpiar: 'Effacer la recherche' },
};

@Component({
  selector: 'kt-buscador',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styleUrl: './buscador.scss',
  template: `
    <button type="button" class="buscar-boton" (click)="abrir()" [attr.aria-label]="texto().buscar" aria-haspopup="dialog">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 5 5" /></svg>
    </button>
    <dialog #dialogo class="buscador" aria-labelledby="buscador-titulo" (click)="fondo($event)" (keydown.escape)="$event.stopPropagation()">
      <header><h2 id="buscador-titulo">{{ texto().buscar }}</h2><button type="button" (click)="cerrar()" [attr.aria-label]="t().cerrar">✕</button></header>
      <div class="buscador__campo" role="search">
        <input #campo type="search" autofocus [value]="consulta()" (input)="consulta.set(campo.value)" [placeholder]="texto().ejemplo" [attr.aria-label]="texto().buscar" aria-controls="buscador-resultados" autocomplete="off" />
        @if (consulta()) { <button type="button" (click)="consulta.set(''); campo.focus()" [attr.aria-label]="texto().limpiar">✕</button> }
      </div>
      <p class="buscador__estado" role="status">{{ consulta().trim() ? resultados().length + ' ' + texto().resultados : texto().ayuda }}</p>
      <ul id="buscador-resultados">
        @for (r of resultados(); track $index) {
          <li><a [routerLink]="['/', idioma(), ...r.ruta]" [fragment]="r.fragmento" (click)="elegir()">
            @if (r.foto) { <img [src]="r.foto" alt="" loading="lazy" /> }
            @else { <span class="buscador__simbolo" aria-hidden="true">✧</span> }
            <span><strong>{{ r.nombre }}</strong><small>{{ r.categoria }}</small></span><span aria-hidden="true">→</span>
          </a></li>
        } @empty { <li class="buscador__vacio">{{ texto().vacio }}</li> }
      </ul>
    </dialog>
  `,
})
export class Buscador {
  private readonly i18n = inject(IdiomaService);
  protected readonly idioma = this.i18n.idioma;
  protected readonly t = this.i18n.t;
  protected readonly texto = computed(() => ETIQUETAS[this.idioma()]);
  protected readonly consulta = signal('');
  readonly seleccionado = output<void>();
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly campo = viewChild.required<ElementRef<HTMLInputElement>>('campo');
  protected readonly resultados = computed(() => {
    const t = this.t(), idioma = this.idioma();
    const secciones = [
      { nombre: t.navPatrones, ruta: ['patrones'], categoria: t.explorar },
      { nombre: t.navTestings, ruta: ['testings'], categoria: t.explorar },
      { nombre: t.navTrabajos, ruta: ['trabajos'], categoria: t.explorar },
      { nombre: t.navIlustracion, ruta: ['ilustracion'], categoria: t.explorar },
      { nombre: t.navSobre, ruta: ['sobre-mi'], categoria: t.explorar },
      { nombre: t.navEncargos, ruta: ['encargos'], categoria: t.explorar },
    ];
    const entradas: { nombre: string; categoria: string; ruta: string[]; fragmento?: string; foto?: string; palabras?: string }[] = [
      ...secciones,
      ...PATRONES.filter(p => !p.nombre.startsWith('[')).map(p => ({ nombre: p.nombre, categoria: t.navPatrones, ruta: ['patrones', p.slug], foto: p.foto, palabras: p.descripcion[idioma] + ' ' + p.detalle[idioma] })),
      ...TESTINGS.filter(p => !p.nombre.startsWith('[')).map(p => ({ nombre: p.nombre, categoria: t.navTestings + ' · ' + p.disenadora, ruta: ['testings'], fragmento: 'testing-' + TESTINGS.indexOf(p), foto: p.foto })),
      ...ILUSTRACIONES.map((p, i) => ({ nombre: p.alt, categoria: t.navIlustracion, ruta: ['ilustracion'], fragmento: 'ilustracion-' + i, foto: p.foto })).filter(p => p.foto && !p.nombre.startsWith('[')),
    ];
    if (!this.consulta().trim()) return entradas.slice(0, secciones.length);
    return entradas.filter(r => coincideBusqueda(r.nombre + ' ' + r.categoria + ' ' + (r.palabras ?? ''), this.consulta()));
  });
  protected abrir() { this.consulta.set(''); this.dialogo().nativeElement.showModal(); this.campo().nativeElement.focus(); }
  protected cerrar() { this.dialogo().nativeElement.close(); }
  protected elegir() { this.cerrar(); this.seleccionado.emit(); }
  protected fondo(e: MouseEvent) { if (e.target === this.dialogo().nativeElement) this.cerrar(); }
}
