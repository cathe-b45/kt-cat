/**
 * Todo el contenido de la web está aquí.
 * Para añadir un patrón, un testing, un trabajo o una ilustración,
 * copia uno de los bloques y cambia los datos.
 * Las fotos van en la carpeta `public/fotos/` y se escriben como 'fotos/nombre.jpg'.
 * Si `foto` está vacía, se ve un hueco de color con el texto [FOTO].
 */
import { Idioma } from '../i18n/textos';

type PorIdioma = Record<Idioma, string>;

export const REDES = {
  instagram: 'kt.cat',
  tiktok: 'kt.cath',
  correo: 'ktttt.04@gmail.com',
};

export interface Patron {
  /** Identificador único para la URL. Al añadir un patrón, su página se genera automáticamente. */
  slug: string;
  nombre: string;
  detalle: PorIdioma;
  descripcion: PorIdioma;
  nivel: 1 | 2 | 3;
  foto?: string;
}

export const PATRONES: Patron[] = [
  {
    slug: 'patron-1',
    nombre: '[NOMBRE DEL PATRÓN]',
    descripcion: { es: '[Breve descripción del patrón]', en: '[Short pattern description]', fr: '[Courte description du patron]' },
    detalle: { es: '[Lana · tamaño]', en: '[Yarn · size]', fr: '[Laine · taille]' },
    nivel: 1,
  },
  {
    slug: 'patron-2',
    nombre: '[NOMBRE DEL PATRÓN]',
    descripcion: { es: '[Breve descripción del patrón]', en: '[Short pattern description]', fr: '[Courte description du patron]' },
    detalle: { es: '[Lana · tamaño]', en: '[Yarn · size]', fr: '[Laine · taille]' },
    nivel: 2,
  },
  {
    slug: 'patron-3',
    nombre: '[NOMBRE DEL PATRÓN]',
    descripcion: { es: '[Breve descripción del patrón]', en: '[Short pattern description]', fr: '[Courte description du patron]' },
    detalle: { es: '[Lana · tamaño]', en: '[Yarn · size]', fr: '[Laine · taille]' },
    nivel: 3,
  },
];

export interface Testing {
  nombre: string;
  disenadora: string;
  enlace: string;
  foto?: string;
  /** Fotos adicionales del mismo amigurumi, en orden. La portada sigue siendo `foto`. */
  fotos?: string[];
}

export const TESTINGS: Testing[] = [
  {
    nombre: 'Pumpkin Monsters',
    disenadora: '@yrvitz',
    enlace: 'https://www.instagram.com/yrvitz',
    foto: 'fotos/testings/pikachu-calabaza.webp',
    fotos: ['fotos/testings/pikachu-calabaza-2.webp'],
  },
  {
    nombre: 'Happy Pink Puff',
    disenadora: '@fildeminuit',
    enlace: 'https://www.instagram.com/fildeminuit',
    foto: 'fotos/testings/happy-pink-puff.webp',
    fotos: ['fotos/testings/happy-pink-puff-2.webp', 'fotos/testings/happy-pink-puff-3.webp'],
  },
  {
    nombre: 'The Puppet mini plushie',
    disenadora: '@knotsewbinka',
    enlace: 'https://www.instagram.com/knotsewbinka',
    foto: 'fotos/testings/marionetas.webp',
    fotos: ['fotos/testings/marionetas-2.webp', 'fotos/testings/marionetas-3.webp', 'fotos/testings/marionetas-4.webp', 'fotos/testings/marionetas-5.webp', 'fotos/testings/marionetas-6.webp'],
  },
  {
    nombre: 'Freminet',
    disenadora: '@cuckoo.craft',
    enlace: 'https://www.instagram.com/cuckoo.craft',
    foto: 'fotos/testings/freminet.webp',
    fotos: ['fotos/testings/freminet-2.webp', 'fotos/testings/freminet-3.webp'],
  },
  {
    nombre: 'Pers',
    disenadora: '@ells.crochet',
    enlace: 'https://www.instagram.com/ells.crochet',
    foto: 'fotos/testings/pinguino-pan.webp',
    fotos: ['fotos/testings/pinguino-pan-2.webp', 'fotos/testings/pinguino-pan-3.webp'],
  },
  {
    nombre: 'Maomao',
    disenadora: '@valeegurumis707',
    enlace: 'https://www.instagram.com/valeegurumis707',
    foto: 'fotos/testings/maomao.webp',
    fotos: ['fotos/testings/maomao-2.webp'],
  },
];

export interface Trabajo {
  nombre: string;
  foto?: string;
  enlace?: string;
}

/** Imagen en las manos = referencia; imagen en la silla = trabajo terminado de Cathe. */
export const EJEMPLO_ENCARGO = {
  referencia: 'fotos/encargos/referencia.png',
  resultado: 'fotos/encargos/resultado.jpg',
};

/** Se usan mientras no haya publicaciones de Instagram descargadas. */
export const TRABAJOS: Trabajo[] = [
  { nombre: '[NOMBRE]' },
  { nombre: '[NOMBRE]' },
  { nombre: '[NOMBRE]' },
  { nombre: '[NOMBRE]' },
];

export interface Ilustracion {
  foto?: string;
  alt: string;
  forma: 'vertical' | 'horizontal' | 'cuadrada';
}

export const ILUSTRACIONES: Ilustracion[] = [
  { foto: 'ilustraciones/moguri.webp', alt: 'Ilustración de dos moguris blancos con pompón, sobre fondo amarillo', forma: 'vertical' },
  { alt: '[Descripción de la ilustración]', forma: 'horizontal' },
  { foto: 'ilustraciones/chica-hamster.webp', alt: 'Ilustración de una chica con sudadera negra sosteniendo un hámster blanco con gafas', forma: 'cuadrada' },
  { alt: '[Descripción de la ilustración]', forma: 'cuadrada' },
  { foto: 'ilustraciones/hu-tao.webp', alt: 'Retrato ilustrado de Hu Tao con su sombrero negro, sobre fondo oscuro', forma: 'vertical' },
  { alt: '[Descripción de la ilustración]', forma: 'cuadrada' },
];

export interface Novedad {
  fecha: string;
  texto: PorIdioma;
}

export const NOVEDADES: Novedad[] = [
  {
    fecha: '[FECHA]',
    texto: { es: '[Patrón nuevo subido]', en: '[New pattern uploaded]', fr: '[Nouveau patron en ligne]' },
  },
  {
    fecha: '[FECHA]',
    texto: { es: '[Testing terminado]', en: '[Testing finished]', fr: '[Test terminé]' },
  },
  {
    fecha: '[FECHA]',
    texto: {
      es: '[Fotos nuevas en trabajos]',
      en: '[New photos in finished work]',
      fr: '[Nouvelles photos de réalisations]',
    },
  },
];

/** Foto grande de la portada. */
export const FOTO_PORTADA = 'ilustraciones/cathe-venti-transparente.png';
/** Tu foto de "Sobre mí". */
export const FOTO_SOBRE_MI = '';
