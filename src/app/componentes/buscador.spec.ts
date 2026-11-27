import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, describe, expect, it } from 'vitest';
import { Buscador, coincideBusqueda } from './buscador';
import { IdiomaService } from '../i18n/idioma.service';

describe('Buscador', () => {
  afterEach(() => TestBed.resetTestingModule());
  it('ignora tildes, mayúsculas y espacios, y exige todas las palabras', () => {
    expect(coincideBusqueda('Ilustración de Hu Tao', '  ILUSTRACION tao ')).toBe(true);
    expect(coincideBusqueda('Maomao', 'Maomao Freminet')).toBe(false);
  });
  it('encuentra un testing por diseñadora, conserva el idioma y enlaza a su tarjeta', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    TestBed.inject(IdiomaService).usar('fr');
    const fixture = TestBed.createComponent(Buscador);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector('input')!;
    input.value = 'valeegurumis';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const resultado = root.querySelector('li a')!;
    expect(resultado.textContent).toContain('Maomao');
    expect(resultado.getAttribute('href')).toBe('/fr/testings#testing-1');
    input.value = 'zzzzsinresultados';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root.querySelector('li a')).toBeNull();
    expect(root.querySelector('.buscador__vacio')?.textContent).toContain('Aucun résultat');
  });
});
