import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Cabecera } from './cabecera';

@Component({ imports: [Cabecera], template: '<kt-cabecera />' })
class PaginaPrueba {}

describe('Cambio de idioma desde la cabecera', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: PaginaPrueba }])],
    });
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('abre el menú y lo cierra con Escape o al elegir una sección', async () => {
    const harness = await RouterTestingHarness.create('/es');
    harness.detectChanges();
    const root = harness.routeNativeElement!;
    const boton = root.querySelector<HTMLButtonElement>('.cabecera__hamburguesa')!;
    expect(boton.getAttribute('aria-expanded')).toBe('false');
    boton.click();
    harness.detectChanges();
    expect(boton.getAttribute('aria-expanded')).toBe('true');
    boton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    harness.detectChanges();
    expect(boton.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(boton);
    boton.click();
    harness.detectChanges();
    root.querySelector<HTMLAnchorElement>('.cabecera__menu a')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(root.querySelector('.cabecera__hamburguesa')?.getAttribute('aria-expanded')).toBe('false');
    expect(TestBed.inject(Router).url).toBe('/es/patrones');
  });

  it.each(['/es', '/es/sobre-mi', '/es/patrones/patron-2', '/es/trabajos?origen=menu#instagram'])(
    'mantiene la página y sus parámetros desde %s', async (url) => {
      const harness = await RouterTestingHarness.create(url);
      harness.detectChanges();
      const enlace: HTMLAnchorElement = harness.routeNativeElement!.querySelector('.idiomas [hreflang="fr"]')!;
      const destino = url.replace(/^\/es/, '/fr');
      expect(enlace.getAttribute('href')).toBe(destino);
      enlace.click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(destino);
      expect(harness.routeNativeElement!.querySelector('.idiomas [hreflang="en"]')!.getAttribute('href'))
        .toBe(url.replace(/^\/es/, '/en'));
    },
  );
});
