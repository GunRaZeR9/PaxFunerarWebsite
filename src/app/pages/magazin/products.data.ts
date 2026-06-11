export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  shortDesc: string;
  description: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'lumanare-mare',
    name: 'Lumânare Funerară Mare',
    price: 25,
    category: 'lumanari',
    shortDesc: 'Lumânare tradițională, 60 cm înălțime.',
    description:
      'Lumânare funerară tradițională din ceară naturală, înălțime 60 cm. Potrivită pentru ceremonii și priveghiuri. Ardere lentă și uniformă.',
    image: 'assets/images/placeholder.jpg',
  },
  {
    id: 'lumanare-mica',
    name: 'Lumânare Funerară Mică',
    price: 12,
    category: 'lumanari',
    shortDesc: 'Lumânare pentru masă comemorativă, set 10 buc.',
    description:
      'Set de 10 lumânări funerare mici din ceară naturală. Ideale pentru masa comemorativă sau pentru aprins la mormânt.',
    image: 'assets/images/placeholder.jpg',
  },
  {
    id: 'coroana-florala',
    name: 'Coroană Florală Clasică',
    price: 150,
    category: 'coroane',
    shortDesc: 'Coroană din flori naturale, diametru 60 cm.',
    description:
      'Coroană funerară clasică din flori naturale albe și verde, diametru 60 cm. Include panglică personalizabilă cu mesaj.',
    image: 'assets/images/placeholder.jpg',
  },
  {
    id: 'coroana-premium',
    name: 'Coroană Florală Premium',
    price: 250,
    category: 'coroane',
    shortDesc: 'Coroană mare din trandafiri și orhidee, diametru 80 cm.',
    description:
      'Coroană funerară premium din trandafiri albi și orhidee, diametru 80 cm. Compoziție elegantă, panglică brodată inclusă.',
    image: 'assets/images/placeholder.jpg',
  },
  {
    id: 'urna-ceramica',
    name: 'Urnă Ceramică Simplă',
    price: 200,
    category: 'urne',
    shortDesc: 'Urnă ceramică artizanală pentru cenușă.',
    description:
      'Urnă funerară din ceramică artizanală, capacitate standard. Finisaj mat, culoare neutru. Potrivită pentru înhumare sau păstrare.',
    image: 'assets/images/placeholder.jpg',
  },
  {
    id: 'urna-marmura',
    name: 'Urnă din Marmură',
    price: 450,
    category: 'urne',
    shortDesc: 'Urnă sculptată manual din marmură naturală.',
    description:
      'Urnă funerară din marmură naturală, sculptată manual. Aspect nobil și durabil. Disponibilă în alb și negru.',
    image: 'assets/images/placeholder.jpg',
  },
  {
    id: 'fotoceramica-oval',
    name: 'Fotoceramică Oval Simplu',
    price: 120,
    category: 'fotoceramica',
    shortDesc: 'Portret ceramic oval, rezistent la intemperii.',
    description:
      'Placă ceramică ovală cu portretul persoanei decedate, imprimată la înaltă calitate. Rezistentă la intemperii, UV și temperaturi extreme. Dimensiune: 13×18 cm.',
    image: 'assets/images/placeholder.jpg',
  },
  {
    id: 'fotoceramica-dreptunghi',
    name: 'Fotoceramică Dreptunghi',
    price: 130,
    category: 'fotoceramica',
    shortDesc: 'Portret ceramic dreptunghiular cu bordură.',
    description:
      'Placă ceramică dreptunghiulară cu bordură decorativă și portretul persoanei decedate. Rezistentă la intemperii. Dimensiune: 15×20 cm.',
    image: 'assets/images/placeholder.jpg',
  },
  {
    id: 'sicriu-stejar',
    name: 'Sicriu din Stejar',
    price: 1800,
    category: 'sicrie',
    shortDesc: 'Sicriu din lemn masiv de stejar, finisaj lustruit.',
    description:
      'Sicriu funerar din lemn masiv de stejar, finisaj lustruit, feronerie aurită. Interior tapițat cu satin alb. Disponibil în mai multe dimensiuni.',
    image: 'assets/images/placeholder.jpg',
  },
  {
    id: 'perna-funerara',
    name: 'Pernă Funerară',
    price: 35,
    category: 'accesorii',
    shortDesc: 'Pernă tapițată din satin pentru sicriu.',
    description:
      'Pernă funerară din satin alb, umplutură premium. Standard pentru orice tip de sicriu. Confortabilă și elegantă.',
    image: 'assets/images/placeholder.jpg',
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'Toate' },
  { id: 'lumanari', label: 'Lumânări' },
  { id: 'coroane', label: 'Coroane Florale' },
  { id: 'urne', label: 'Urne' },
  { id: 'fotoceramica', label: 'Fotoceramică' },
  { id: 'sicrie', label: 'Sicrie' },
  { id: 'accesorii', label: 'Accesorii' },
];
