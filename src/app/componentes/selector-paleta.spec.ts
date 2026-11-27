import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectorPaleta } from './selector-paleta';
import { PaletaService } from '../servicios/paleta.service';

describe('Selector de paleta', () => {
  beforeEach(() => {
    localStorage.removeItem('kt-cat-modo');
    delete document.documentElement.dataset['modo'];
    localStorage.removeItem('kt-cat-paleta');
    delete document.documentElement.dataset['paleta'];
    TestBed.configureTestingModule({ imports: [SelectorPaleta] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.removeItem('kt-cat-modo');
    delete document.documentElement.dataset['modo'];
    localStorage.removeItem('kt-cat-paleta');
    delete document.documentElement.dataset['paleta'];
    TestBed.resetTestingModule();
  });

  it('restaura la elección guardada al mostrar el selector', async () => {
    localStorage.setItem('kt-cat-paleta', 'tierra');
    const fixture = TestBed.createComponent(SelectorPaleta);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(document.documentElement.dataset['paleta']).toBe('tierra');
    expect(fixture.nativeElement.querySelector('input:checked').value).toBe('tierra');
  });

  it('aplica y guarda las tres opciones desde el control', async () => {
    const fixture = TestBed.createComponent(SelectorPaleta);
    fixture.detectChanges();
    await fixture.whenStable();
    for (const value of ['pastel', 'tierra', 'blossom']) {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input[value="' + value + '"]');
      input.click();
      fixture.detectChanges();
      expect(input.checked).toBe(true);
      expect(document.documentElement.dataset['paleta']).toBe(value);
      expect(localStorage.getItem('kt-cat-paleta')).toBe(value);
    }
  });

  it('ignora valores guardados desconocidos', async () => {
    localStorage.setItem('kt-cat-paleta', 'invalid');
    const fixture = TestBed.createComponent(SelectorPaleta);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(TestBed.inject(PaletaService).actual()).toBe('blossom');
    expect(document.documentElement.dataset['paleta']).toBeUndefined();
  });

  it('permite cambiar de paleta cuando el almacenamiento está bloqueado', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked'); });
    const fixture = TestBed.createComponent(SelectorPaleta);
    fixture.detectChanges();
    await fixture.whenStable();
    const servicio = TestBed.inject(PaletaService);
    expect(() => servicio.elegir('pastel')).not.toThrow();
    expect(servicio.actual()).toBe('pastel');
    expect(document.documentElement.dataset['paleta']).toBe('pastel');
    expect(() => servicio.alternarModo()).not.toThrow();
    expect(document.documentElement.dataset['modo']).toBe('oscuro');
  });

  it('restaura modo oscuro y lo conserva al cambiar las tres paletas', async () => {
    localStorage.setItem('kt-cat-paleta', 'tierra');
    localStorage.setItem('kt-cat-modo', 'oscuro');
    const fixture = TestBed.createComponent(SelectorPaleta);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const servicio = TestBed.inject(PaletaService);
    expect(servicio.actual()).toBe('tierra');
    expect(fixture.nativeElement.querySelector('[role="switch"]').getAttribute('aria-checked')).toBe('true');
    for (const valor of ['pastel', 'tierra', 'blossom']) {
      servicio.elegir(valor);
      expect(document.documentElement.dataset['modo']).toBe('oscuro');
    }
    fixture.nativeElement.querySelector('[role="switch"]').click();
    fixture.detectChanges();
    expect(document.documentElement.dataset['modo']).toBe('claro');
    expect(localStorage.getItem('kt-cat-modo')).toBe('claro');
    expect(servicio.actual()).toBe('blossom');
  });

  it('abre el panel y lo cierra con Escape o al pulsar fuera', async () => {
    const fixture = TestBed.createComponent(SelectorPaleta);
    fixture.detectChanges();
    await fixture.whenStable();
    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('.selector-paleta__boton');
    const panel: HTMLElement = fixture.nativeElement.querySelector('.selector-paleta__panel');
    expect(panel.hidden).toBe(true);
    boton.click();
    fixture.detectChanges();
    expect(panel.hidden).toBe(false);
    expect(boton.getAttribute('aria-expanded')).toBe('true');
    panel.querySelector('input')!.focus();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(boton);
    boton.click();
    fixture.detectChanges();
    document.body.click();
    fixture.detectChanges();
    expect(panel.hidden).toBe(true);
  });
});
