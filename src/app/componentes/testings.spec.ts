import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TESTINGS } from '../datos/contenido';
import { Testings } from './secciones';

describe('Galería de cada testing', () => {
  const originales = TESTINGS[0].fotos;
  const fotosSegundo = TESTINGS[1].fotos;
  afterEach(() => {
    TESTINGS[0].fotos = originales;
    TESTINGS[1].fotos = fotosSegundo;
    TestBed.resetTestingModule();
  });

  it('amplía, recorre las fotos del mismo muñeco y reinicia al abrir otro', () => {
    TESTINGS[0].fotos = [TESTINGS[0].foto!, '/fotos/otra-vista.webp'];
    TESTINGS[1].fotos = [];
    const fixture = TestBed.createComponent(Testings);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const dialog = root.querySelector('dialog')!;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn(() => dialog.dispatchEvent(new Event('close')));
    const botones = root.querySelectorAll<HTMLButtonElement>('.testing__abrir');
    botones[0].click();
    fixture.detectChanges();
    expect(dialog.showModal).toHaveBeenCalled();
    expect(root.querySelectorAll('.testing__miniaturas button')).toHaveLength(2);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelector('.visor__imagen')?.getAttribute('src')).toBe('/fotos/otra-vista.webp');
    root.querySelector<HTMLButtonElement>('.visor__siguiente')!.click();
    fixture.detectChanges();
    expect(root.querySelector('.visor__imagen')?.getAttribute('src')).toBe(TESTINGS[0].foto);
    root.querySelectorAll<HTMLButtonElement>('.testing__miniaturas button')[1].click();
    fixture.detectChanges();
    expect(root.querySelector('.visor__imagen')?.getAttribute('src')).toBe('/fotos/otra-vista.webp');
    root.querySelector<HTMLButtonElement>('.visor__cerrar')!.click();
    fixture.detectChanges();
    expect(root.querySelector('.visor__imagen')).toBeNull();
    botones[1].click();
    fixture.detectChanges();
    expect(root.querySelector('.visor__imagen')?.getAttribute('src')).toBe(TESTINGS[1].foto);
    expect(root.querySelector('.visor__siguiente')).toBeNull();
    expect(root.querySelector('a[href="#"]')).toBeNull();
  });
});
