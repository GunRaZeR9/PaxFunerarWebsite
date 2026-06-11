export interface ServiceCard {
  slug: string;
  icon: string;
  name: string;
  teaser: string;
  description: string;
  benefits: string[];
  ctaLabel?: string;
}

export const SERVICES: ServiceCard[] = [
  {
    slug: 'intocmirea-actelor',
    icon: 'assets/icons/acte.svg',
    name: 'Întocmirea Actelor',
    teaser: 'Ghidăm familia prin toate formalitățile administrative, rapid și cu grijă.',
    description:
      'Serviciul de întocmire a actelor oferit de Casa Funerară PAX constă în asistența și îndrumarea familiilor în procesul de obținere a actelor necesare în urma decesului. Ne ocupăm de toate demersurile birocratice astfel încât familia să se poată concentra pe momentele de reculegere și pe cei dragi.',
    benefits: [
      'Consiliere pas cu pas',
      'Obținere certificat de deces',
      'Asistență la Starea Civilă',
      'Documente pentru ajutor de deces',
    ],
  },
  {
    slug: 'transport-funerar',
    icon: 'assets/icons/transport.svg',
    name: 'Transport Funerar',
    teaser: 'Vehicule specializate și personal calificat pentru un transport demn.',
    description:
      'Oferim servicii de transport funerar de înaltă calitate, asigurând că defunctul este tratat cu demnitate și respect pe tot parcursul procesului. Dispunem de vehicule autorizate și personal specializat disponibil non-stop.',
    benefits: [
      'Vehicule autorizate',
      'Disponibilitate 24/7',
      'Transport local și național',
      'Personal specializat',
    ],
  },
  {
    slug: 'imbalsamare',
    icon: 'assets/icons/imbalsamare.svg',
    name: 'Îmbălsămare',
    teaser: 'Tratare și pregătire atentă a celui drag pentru ceremonial.',
    description:
      'Serviciul de îmbălsămare constă în tratarea și pregătirea trupului persoanei decedate pentru vizionare și înmormântare. Procedura este realizată de personal atestat, cu respect față de defunct și familia acestuia.',
    benefits: [
      'Personal atestat',
      'Proceduri respectuoase',
      'Aspect natural conservat',
      'Respectarea tradițiilor',
    ],
  },
  {
    slug: 'servicii-ceremoniale',
    icon: 'assets/icons/ceremonii.svg',
    name: 'Servicii Ceremoniale',
    teaser: 'Ceremonii complete, personalizate după tradițiile și dorințele familiei.',
    description:
      'Organizarea completă a ceremoniilor funerare tradiționale, incluzând vizitarea decedatului, slujba religioasă sau civilă și înhumarea. Ne adaptăm la tradițiile și dorințele fiecărei familii pentru un ultim omagiu demn.',
    benefits: [
      'Slujbă religioasă sau civilă',
      'Vizionare organizată',
      'Personalizare completă',
      'Coordonare cu cimitirul',
    ],
  },
  {
    slug: 'servicii-de-catering',
    icon: 'assets/icons/catering.svg',
    name: 'Servicii de Catering',
    teaser: 'Masă de comemorare organizată cu respect pentru momentul trăit.',
    description:
      'Casa Funerară PAX asigură servicii de catering pentru familia și invitații la ceremonie, cu o varietate de opțiuni adaptate numărului de persoane și preferințelor familiei.',
    benefits: [
      'Meniu personalizat',
      'Livrare la locația dorită',
      'Servire profesionistă',
      'Adaptabil la număr de persoane',
    ],
  },
  {
    slug: 'repatriere-decedati',
    icon: 'assets/icons/repatriere.svg',
    name: 'Repatriere Decedați',
    teaser: 'Aducem acasă pe cei dragi din orice colț al Europei.',
    description:
      'Asistență completă în transferul internațional al decedaților, inclusiv gestionarea formalităților legale, documentației consulare și logisticii de transport din și spre orice țară europeană.',
    benefits: [
      'Formalități consulare',
      'Transport internațional',
      'Coordonare cu autoritățile',
      'Disponibilitate 24/7',
    ],
  },
  {
    slug: 'capela',
    icon: 'assets/icons/capela.svg',
    name: 'Capelă',
    teaser: 'Spațiu de ceremonial demn și liniștit pentru ultimul omagiu.',
    description:
      'Capelă mortuară modernă, disponibilă pentru ceremonii de vizionare și adio, pregătită cu respect și atenție la detalii. Sistemul audio și ambientarea pot fi personalizate conform dorințelor familiei.',
    benefits: [
      'Ambientare personalizată',
      'Sistem audio',
      'Capacitate familiară',
      'Disponibilă non-stop',
    ],
  },
  {
    slug: 'pregatire-loc-de-veci',
    icon: 'assets/icons/loc-veci.svg',
    name: 'Pregătire Loc de Veci',
    teaser: 'Organizăm și pregătim locul de odihnă cu grijă și profesionalism.',
    description:
      'Serviciu complet de pregătire a locului de înhumare, inclusiv coordonarea cu administrația cimitirului, pregătirea mormântului și aranjamentele florale și funerare.',
    benefits: [
      'Coordonare cu cimitirul',
      'Pregătire completă',
      'Aranjamente florale',
      'Monument funerar',
    ],
  },
  {
    slug: 'incinerare',
    icon: 'assets/icons/incinerare.svg',
    name: 'Incinerare',
    teaser: 'Ceremonii de incinerare organizate cu demnitate și respect.',
    description:
      'Servicii complete de incinerare, inclusiv transportul, formalitățile necesare și organizarea ceremoniei de adio. Oferim consiliere cu privire la toate opțiunile disponibile privind cenușa.',
    benefits: [
      'Urnă la alegere',
      'Ceremonie personalizată',
      'Formalități incluse',
      'Consiliere despre opțiunile cu cenușa',
    ],
  },
  {
    slug: 'fotoceramica',
    icon: 'assets/icons/fotoceramica.svg',
    name: 'Fotoceramică',
    teaser: 'Portrete ceramice durabile — o amintire veșnică pe piatra funerară.',
    description:
      'Fotoceramica este o tehnologie ce permite imprimarea fotografiei defunctului pe o placă ceramică rezistentă la intemperii, destinată pietrei funerare. Disponibilă în 9 modele de formă și dimensiune.',
    benefits: [
      'Rezistentă la intemperii',
      '9+ modele disponibile',
      'Calitate înaltă a imaginii',
      'Livrare rapidă',
    ],
  },
];

export const SERVICE_MAP: Record<string, string> = Object.fromEntries(
  SERVICES.map(s => [s.slug, s.name]),
);
