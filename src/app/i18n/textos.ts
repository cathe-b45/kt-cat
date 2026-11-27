export type Idioma = 'es' | 'en' | 'fr';

export const IDIOMAS: { codigo: Idioma; etiqueta: string }[] = [
  { codigo: 'es', etiqueta: 'ES' },
  { codigo: 'en', etiqueta: 'EN' },
  { codigo: 'fr', etiqueta: 'FR' },
];

export const IDIOMA_POR_DEFECTO: Idioma = 'es';

export function esIdioma(valor: unknown): valor is Idioma {
  return valor === 'es' || valor === 'en' || valor === 'fr';
}

export interface Textos {
  metaTitulo: string;
  metaDescripcion: string;
  idiomaAria: string;
  navAria: string;
  lema: string;
  bocadillos: string[];

  navPatrones: string;
  navTestings: string;
  navTrabajos: string;
  navIlustracion: string;
  navSobre: string;
  navNovedades: string;
  navEncargos: string;
  correo: string;

  patTitulo: string;
  patTexto: string;
  irPatron: string;
  volverPatrones: string;
  niveles: [string, string, string];
  dificultad: string;
  de: string;

  testTitulo: string;
  testTexto: string;
  disenoDe: string;
  verPatron: string;

  trabTitulo: string;
  trabTexto: string;

  ilusTitulo: string;
  ilusTexto: string;
  ampliar: string;
  cerrar: string;
  anterior: string;
  siguiente: string;

  tiktokTexto: string;
  instagramTexto: string;

  sobreTitulo: string;
  sobreNombre: string;
  sobreTexto: string[];

  novTitulo: string;

  explorar: string;
  encargoTitulo: string;
  encargoTexto: string;
  dmInsta: string;
  dmTiktok: string;
  pie: string;
}

export const TEXTOS: Record<Idioma, Textos> = {
  es: {
    metaTitulo: 'kt.cat · amigurumis de crochet',
    metaDescripcion:
      'Amigurumis de crochet hechos a mano, casi todos en chenilla. Patrones gratis, testings, trabajos terminados e ilustraciones.',
    idiomaAria: 'Idioma',
    navAria: 'Secciones',
    lema: 'Personajes que me encantan, hechos a mano en crochet.',
    bocadillos: ['¡hola!', 'me tejí en 3 días', 'soy de chenilla', 'abrázame', '¿me adoptas?'],

    navPatrones: 'Patrones',
    navTestings: 'Testings',
    navTrabajos: 'Mis creaciones',
    navIlustracion: 'Ilustración',
    navSobre: 'Sobre mí',
    navNovedades: 'Novedades',
    navEncargos: 'Encargos',
    correo: 'Correo',

    patTitulo: 'Patrones',
    patTexto: 'Mis patrones de crochet, con sus detalles en una página para cada creación.',
    irPatron: 'Ir al patrón',
    volverPatrones: 'Volver a patrones',
    niveles: ['Fácil', 'Intermedio', 'Avanzado'],
    dificultad: 'Dificultad',
    de: 'de',

    testTitulo: 'Testings',
    testTexto: 'Mis pruebas de patrones de otras diseñadoras, antes de su publicación.',
    disenoDe: 'Diseño de',
    verPatron: 'Ver el patrón',

    trabTitulo: 'Mis creaciones',
    trabTexto: 'Aquí puedes ver lo que voy creando y compartiendo en mis redes. Me encantan los videojuegos y el anime, así que lo que más disfruto es tejer fanmades: dar vida en crochet a mis personajes favoritos.',

    ilusTitulo: 'Ilustración',
    ilusTexto: 'Además de tejer, me gusta dibujar. Aquí van algunas de mis ilustraciones.',
    ampliar: 'Ver en grande',
    cerrar: 'Cerrar',
    anterior: 'Anterior',
    siguiente: 'Siguiente',

    instagramTexto: 'Un vistazo a mi día a día entre hilos, nuevas creaciones y pequeños detalles.',
    tiktokTexto: 'Vídeos cortos de lo que voy tejiendo, procesos y algún tutorial.',

    sobreTitulo: 'Soy Cathe',
    sobreNombre: 'Me llamo Catherine, pero todo el mundo me llama Cathe. Lo gracioso es que, cuando digo mi nombre, nadie sabe muy bien cómo pronunciarlo, haha. De ahí salió KT: ¡suena como mi apodo al decir las dos letras seguidas!',
    sobreTexto: [
      'Empecé a hacer crochet en agosto de 2025 y aquí comparto lo que voy creando y aprendiendo. Aunque me encanta tejer, mi mayor pasión es la informática: soy ingeniera informática y también trabajo de ello.',
      'Me encantan los videojuegos, especialmente Zelda, Kingdom Hearts y Final Fantasy. Eso sí, en mi tiempo libre lo que más juego es al LoL, hehe. ¡Y, por supuesto, soy fan de T1! Mi afición también se nota en mis tatuajes: tengo unos cuantos y todos están inspirados en videojuegos. ;)',
      'Lo que más disfruto tejiendo son fanmades de personajes que me gustan. Todavía estoy empezando a crear patrones, así que suelo hacer diseños sencillos de esas cosas para las que no encuentro un patrón hecho. Y si hay alguien que me parece especialmente adorable, ¡es Cinnamoroll!',
      'Dibujar me ha gustado toda la vida, aunque con el dibujo digital todavía no termino de sentirme cómoda. Aun así, quiero seguir intentándolo y compartir por aquí mis avances, mis pruebas y todo lo que vaya aprendiendo. :)',
      'Mi compañera de aventuras es Venti, mi chinchilla. Sí, se llama así por Venti de Genshin Impact. Le encanta subirse encima de mí y, por alguna misteriosa razón, morderme la lana. ¡La supervisión de mis proyectos está asegurada!',
    ],

    novTitulo: 'Novedades',

    explorar: 'Explorar',
    encargoTitulo: '¿Quieres uno por encargo?',
    encargoTexto:
      'Si te gusta algún amigurumi o tienes una idea, escríbeme por mensaje directo y lo hablamos.',
    dmInsta: 'DM en Instagram',
    dmTiktok: 'Mensaje en TikTok',
    pie: 'Hecho por Cathe · 2026',
  },

  en: {
    metaTitulo: 'kt.cat · crochet amigurumi',
    metaDescripcion:
      'Handmade crochet amigurumi, mostly in chenille. Free patterns, pattern testing, finished work and illustrations.',
    idiomaAria: 'Language',
    navAria: 'Sections',
    lema: 'Characters I love, crocheted by hand.',
    bocadillos: ['hi!', 'made in 3 days', 'I’m chenille', 'hug me', 'adopt me?'],

    navPatrones: 'Patterns',
    navTestings: 'Pattern testing',
    navTrabajos: 'My creations',
    navIlustracion: 'Illustration',
    navSobre: 'About me',
    navNovedades: 'Updates',
    navEncargos: 'Custom orders',
    correo: 'Email',

    patTitulo: 'Patterns',
    patTexto: 'My crochet patterns, with a dedicated page for each creation.',
    irPatron: 'View pattern',
    volverPatrones: 'Back to patterns',
    niveles: ['Easy', 'Intermediate', 'Advanced'],
    dificultad: 'Difficulty',
    de: 'of',

    testTitulo: 'Pattern testing',
    testTexto: 'My pattern tests for other designers, ahead of their release.',
    disenoDe: 'Designed by',
    verPatron: 'See the pattern',

    trabTitulo: 'My creations',
    trabTexto: 'Here you can see what I’m creating and sharing on social media. I love video games and anime, so my favourite projects are fan-made pieces: bringing my favourite characters to life in crochet.',

    ilusTitulo: 'Illustration',
    ilusTexto: 'Besides crochet, I love drawing. Here are some of my illustrations.',
    ampliar: 'View larger',
    cerrar: 'Close',
    anterior: 'Previous',
    siguiente: 'Next',

    instagramTexto: 'Everyday moments with yarn, new creations and little details.',
    tiktokTexto: 'Short videos of what I’m making, works in progress and the odd tutorial.',

    sobreTitulo: 'I’m Cathe',
    sobreNombre: 'My name is Catherine, but everyone calls me Cathe. The funny thing is that whenever I introduce myself, nobody quite knows how to pronounce it, haha. That’s where KT came from: saying those two letters together sounds like my nickname!',
    sobreTexto: [
      'I started crocheting in August 2025, and this is where I share what I’m making and learning. As much as I love crochet, my biggest passion is computing: I’m a computer engineer, and that’s also what I do for work.',
      'I love video games, especially Zelda, Kingdom Hearts and Final Fantasy. That said, most of my gaming time goes to LoL, hehe. And of course, I’m a T1 fan! My love of games shows in my tattoos too: I have quite a few, and every one is inspired by a video game. ;)',
      'My favourite crochet projects are fan-made versions of characters I love. I’m still new to designing patterns, so I tend to make simple designs for things I can’t find an existing pattern for. And if there’s one character I find especially adorable, it’s Cinnamoroll!',
      'I’ve loved drawing all my life, though digital art still doesn’t quite feel natural to me. I want to keep trying, and I’ll share my progress, experiments and everything I learn here. :)',
      'My companion on these adventures is Venti, my chinchilla. Yes, she’s named after Venti from Genshin Impact. She loves climbing onto me and, for some mysterious reason, chewing my yarn. My projects certainly don’t lack supervision!',
    ],

    novTitulo: 'Updates',

    explorar: 'Explore',
    encargoTitulo: 'Want a custom order?',
    encargoTexto:
      'If you like one of my amigurumi or have an idea, send me a DM and we’ll talk about it.',
    dmInsta: 'DM on Instagram',
    dmTiktok: 'Message on TikTok',
    pie: 'Made by Cathe · 2026',
  },

  fr: {
    metaTitulo: 'kt.cat · amigurumis au crochet',
    metaDescripcion:
      'Amigurumis au crochet faits main, presque tous en chenille. Patrons gratuits, tests de patrons, réalisations et illustrations.',
    idiomaAria: 'Langue',
    navAria: 'Sections',
    lema: 'Des personnages que j’adore, faits main au crochet.',
    bocadillos: ['coucou !', 'crocheté en 3 jours', 'je suis en chenille', 'fais-moi un câlin', 'tu m’adoptes ?'],

    navPatrones: 'Patrons',
    navTestings: 'Tests de patrons',
    navTrabajos: 'Mes créations',
    navIlustracion: 'Illustration',
    navSobre: 'À propos',
    navNovedades: 'Nouveautés',
    navEncargos: 'Commandes',
    correo: 'E-mail',

    patTitulo: 'Patrons',
    patTexto: 'Mes patrons de crochet, avec une page dédiée à chaque création.',
    irPatron: 'Voir le patron',
    volverPatrones: 'Retour aux patrons',
    niveles: ['Facile', 'Intermédiaire', 'Avancé'],
    dificultad: 'Difficulté',
    de: 'sur',

    testTitulo: 'Tests de patrons',
    testTexto: 'Mes tests de patrons pour d’autres créatrices, avant leur publication.',
    disenoDe: 'Création de',
    verPatron: 'Voir le patron',

    trabTitulo: 'Mes créations',
    trabTexto: 'Découvre ce que je crée et partage sur mes réseaux. J’adore les jeux vidéo et les animés, alors mes projets préférés sont les créations de fan : donner vie à mes personnages favoris au crochet.',

    ilusTitulo: 'Illustration',
    ilusTexto: 'En plus du crochet, j’adore dessiner. Voici quelques-unes de mes illustrations.',
    ampliar: 'Agrandir',
    cerrar: 'Fermer',
    anterior: 'Précédente',
    siguiente: 'Suivante',

    instagramTexto: 'Mon quotidien entre fils, nouvelles créations et petits détails.',
    tiktokTexto: 'De courtes vidéos de ce que je crochète, mes projets en cours et quelques tutos.',

    sobreTitulo: 'Moi, c’est Cathe',
    sobreNombre: 'Je m’appelle Catherine, mais tout le monde m’appelle Cathe. Le plus drôle, c’est que quand je me présente, personne ne sait vraiment comment le prononcer, haha. C’est de là que vient KT : les deux lettres prononcées à la suite sonnent comme mon surnom !',
    sobreTexto: [
      'J’ai commencé le crochet en août 2025 et je partage ici mes créations et mes découvertes. Même si j’adore crocheter, ma plus grande passion reste l’informatique : je suis ingénieure en informatique et c’est aussi mon métier.',
      'J’adore les jeux vidéo, surtout Zelda, Kingdom Hearts et Final Fantasy. Cela dit, pendant mon temps libre, je joue surtout à LoL, héhé. Et bien sûr, je suis fan de T1 ! Cette passion se retrouve aussi dans mes tatouages : j’en ai plusieurs, tous inspirés de jeux vidéo. ;)',
      'Ce que je préfère crocheter, ce sont des créations de fan à l’effigie des personnages que j’aime. Je débute encore dans la création de patrons, alors je réalise surtout des modèles simples pour lesquels je ne trouve pas de patron existant. Et s’il y a un personnage que je trouve particulièrement adorable, c’est Cinnamoroll !',
      'J’aime dessiner depuis toujours, même si je ne me sens pas encore tout à fait à l’aise avec le dessin numérique. Je compte bien continuer à essayer et partager ici mes progrès, mes essais et tout ce que j’apprends. :)',
      'Venti, mon chinchilla, m’accompagne dans ces aventures. Oui, son nom vient de Venti dans Genshin Impact ! Venti adore grimper sur moi et, pour une raison mystérieuse, mordiller ma laine. Mes projets ne manquent pas de supervision !',
    ],

    novTitulo: 'Nouveautés',

    explorar: 'Explorer',
    encargoTitulo: 'Envie d’une commande ?',
    encargoTexto:
      'Si un amigurumi te plaît ou si tu as une idée, écris-moi en message privé et on en parle.',
    dmInsta: 'DM sur Instagram',
    dmTiktok: 'Message sur TikTok',
    pie: 'Fait par Cathe · 2026',
  },
};
