import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { EJEMPLO_ENCARGO, REDES } from '../datos/contenido';
import { IdiomaService } from '../i18n/idioma.service';
import { Caja } from './caja';
import { Icono } from './icono';

const TEXTOS = {
  es: {
    ejemplo: 'Un encargo que ya he tejido',
    descripcion: 'Una pareja de amigurumis que combina Hello Kitty y Spider-Man. Partí de la imagen de referencia que me enviaron para tejer mi propia versión.',
    referencia: 'Referencia recibida',
    resultado: 'Mi resultado',
    titulo: '¿Qué te gustaría que tejiera?',
    intro: '¿Tienes un personaje favorito o una idea para un regalo? Cuéntamela y vemos si puedo darle forma en crochet.',
    pasos: [
      ['Tu idea', 'Dime qué personaje o amigurumi tienes en mente. Si tienes imágenes de referencia, ¡mándamelas!'],
      ['Los detalles', 'Cuéntame el tamaño aproximado, los colores y si lo necesitas para una fecha concreta.'],
      ['Lo hablamos', 'Antes de confirmar nada, hablamos de la disponibilidad, el precio y los plazos.'],
    ],
    cierre: 'No hace falta que tengas todo decidido. Podemos empezar por una idea ♡',
  },
  en: {
    ejemplo: 'A custom order I’ve made',
    descripcion: 'A pair of amigurumi combining Hello Kitty and Spider-Man. I used the reference image I was sent to crochet my own version.',
    referencia: 'Reference received',
    resultado: 'My finished work',
    titulo: 'What would you like me to crochet?',
    intro: 'Have a favourite character or a gift idea? Tell me about it and we can see if I can bring it to life in crochet.',
    pasos: [
      ['Your idea', 'Tell me which character or amigurumi you have in mind. Reference images are welcome!'],
      ['The details', 'Let me know the approximate size, colours and whether you have a particular date in mind.'],
      ['Let’s talk', 'Before confirming anything, we’ll discuss availability, price and timing.'],
    ],
    cierre: 'You don’t need to have everything figured out. We can start with an idea ♡',
  },
  fr: {
    ejemplo: 'Une commande que j’ai réalisée',
    descripcion: 'Un duo d’amigurumis mêlant Hello Kitty et Spider-Man. À partir de l’image de référence reçue, j’ai crocheté ma propre version.',
    referencia: 'Référence reçue',
    resultado: 'Ma réalisation',
    titulo: 'Que voudrais-tu que je crochète ?',
    intro: 'Un personnage préféré ou une idée de cadeau ? Raconte-moi et voyons si je peux lui donner vie au crochet.',
    pasos: [
      ['Ton idée', 'Dis-moi quel personnage ou amigurumi tu imagines. Les images de référence sont les bienvenues !'],
      ['Les détails', 'Précise la taille approximative, les couleurs et si tu as une date particulière en tête.'],
      ['On en parle', 'Avant de confirmer quoi que ce soit, nous discutons des disponibilités, du prix et des délais.'],
    ],
    cierre: 'Pas besoin de tout avoir décidé. Une idée suffit pour commencer ♡',
  },
};

@Component({
  selector: 'kt-encargos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Caja, Icono],
  styles: `
    :host { display: block; width: 100%; max-width: 1050px; margin-inline: auto; }
    header { text-align: center; max-width: 640px; margin: 0 auto 46px; }
    h1 { font-size: clamp(1.7rem, 3.5vw, 2.35rem); line-height: 1.3; margin: 0 0 18px; text-wrap: balance; }
    p { margin: 0; text-wrap: pretty; }
    ol { list-style: none; padding: 0; margin: 0 0 42px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
    li { --acento: var(--rosa); --tinta: var(--rosa-tinta); position: relative; min-width: 0; padding: 30px 24px 28px; border: 1px solid color-mix(in srgb, var(--acento) 65%, var(--borde)); border-radius: 35px 22px 38px 19px / 22px 35px 24px 34px; background: color-mix(in srgb, var(--acento) 18%, var(--papel)); box-shadow: 3px 6px 0 var(--sombra); }
    li::before { content: ''; position: absolute; width: 76px; height: 21px; top: -10px; left: calc(50% - 38px); background: var(--acento); rotate: -5deg; clip-path: polygon(3% 0, 97% 0, 94% 25%, 100% 50%, 95% 75%, 98% 100%, 0 100%, 4% 75%, 0 50%, 5% 25%); }
    li::after { content: ''; position: absolute; inset: 8px; border: 1px dashed color-mix(in srgb, var(--acento) 65%, var(--puntadas)); border-radius: inherit; pointer-events: none; }
    li:nth-child(2) { --acento: var(--cielo); --tinta: var(--cielo-tinta); border-radius: 22px 38px 23px 35px / 35px 24px 34px 22px; }
    li:nth-child(2)::before { rotate: 4deg; }
    li:nth-child(3) { --acento: var(--salvia); --tinta: var(--salvia-tinta); }
    li > span { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 45% 55% 40% 60%; background: var(--acento); color: var(--tinta); font-weight: 700; }
    h2 { font-size: 1.2rem; margin: 12px 0 8px; }
    li p { font-size: .95rem; }
    .contacto { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin: 28px 0 16px; }
    .nota { text-align: center; color: var(--texto-suave); font-size: .95rem; }
    .ejemplo { margin: 34px 0; padding-top: 24px; border-top: 1px dashed var(--puntadas); text-align: center; }
    .ejemplo h2 { font-size: 1.6rem; }
    .ejemplo > p { max-width: 640px; margin: 0 auto 22px; }
    .comparacion { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
    figure { margin: 0; padding: 10px; background: var(--crema); border: 1px solid var(--borde); border-radius: 24px 18px 22px 16px; }
    figure img { display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 14px; }
    .foto-referencia { object-position: 50% 52%; }
    .foto-resultado { object-position: 50% 78%; }
    figcaption { padding: 12px 4px 4px; font-weight: 700; }
    @media (max-width: 600px) { .comparacion { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 760px) { header { margin-bottom: 36px; } ol { grid-template-columns: minmax(0, 1fr); gap: 28px; } li { padding: 26px 24px; } }
  `,
  template: `
    <kt-caja ancla="encargo-personalizado" [titulo]="t().navEncargos" color="rosa">
      <header><h1 class="titulo-mano">{{ texto().titulo }}</h1><p>{{ texto().intro }}</p></header>
      <ol>
        @for (paso of texto().pasos; track $index) {
          <li><span aria-hidden="true">{{ $index + 1 }}</span><h2>{{ paso[0] }}</h2><p>{{ paso[1] }}</p></li>
        }
      </ol>
      <section class="ejemplo">
        <h2 class="titulo-mano">{{ texto().ejemplo }}</h2>
        <p>{{ texto().descripcion }}</p>
        <div class="comparacion">
          @if (ejemplo.referencia) {
            <figure><a [href]="ejemplo.referencia" target="_blank" rel="noopener" [attr.aria-label]="t().ampliar + ': ' + texto().referencia"><img class="foto-referencia" [src]="ejemplo.referencia" [alt]="texto().referencia" loading="lazy" /></a><figcaption>{{ texto().referencia }}</figcaption></figure>
          }
          @if (ejemplo.resultado) {
            <figure><a [href]="ejemplo.resultado" target="_blank" rel="noopener" [attr.aria-label]="t().ampliar + ': ' + texto().resultado"><img class="foto-resultado" [src]="ejemplo.resultado" [alt]="texto().resultado" loading="lazy" /></a><figcaption>{{ texto().resultado }}</figcaption></figure>
          }
        </div>
      </section>
      <div class="contacto">
        <a class="pastilla pastilla--cielo blandito" [href]="'https://ig.me/m/' + redes.instagram" target="_blank" rel="noopener noreferrer"><kt-icono nombre="instagram" [tamano]="18" />{{ t().dmInsta }}</a>
        <a class="pastilla pastilla--rosa blandito" [href]="'https://www.tiktok.com/@' + redes.tiktok" target="_blank" rel="noopener noreferrer"><kt-icono nombre="tiktok" [tamano]="18" />{{ t().dmTiktok }}</a>
      </div>
      <p class="nota">{{ texto().cierre }}</p>
    </kt-caja>
  `,
})
export class Encargos {
  private readonly i18n = inject(IdiomaService);
  protected readonly t = this.i18n.t;
  protected readonly texto = computed(() => TEXTOS[this.i18n.idioma()]);
  protected readonly redes = REDES;
  protected readonly ejemplo = EJEMPLO_ENCARGO;
}
