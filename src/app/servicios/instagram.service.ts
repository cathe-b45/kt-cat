import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

export interface PublicacionInstagram {
  id: string;
  imagen: string;
  texto: string;
  tipo: string;
  enlace: string;
  fecha: string;
}

/**
 * Lee las publicaciones que descarga la GitHub Action
 * (scripts/instagram.mjs → public/data/instagram.json).
 */
@Injectable({ providedIn: 'root' })
export class InstagramService {
  private readonly http = inject(HttpClient);
  private cargado = false;

  readonly publicaciones = signal<PublicacionInstagram[]>([]);

  cargar(): void {
    if (this.cargado) return;
    this.cargado = true;
    this.http
      .get<{ publicaciones: PublicacionInstagram[] }>('data/instagram.json')
      .subscribe({
        next: (datos) => this.publicaciones.set(datos.publicaciones ?? []),
        error: () => this.publicaciones.set([]),
      });
  }
}
