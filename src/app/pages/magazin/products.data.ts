export interface Product {
  id: string;
  /** i18n key — pipe through translate */
  name: string;
  price: number;
  category: string;
  /** i18n key — pipe through translate */
  shortDesc: string;
  /** i18n key — pipe through translate */
  description: string;
  image: string;
}

/** Builds a key-based product entry: all texts live in assets/i18n/<lang>.json under shop.products.<id> */
function prod(id: string, category: string, price: number): Product {
  const base = `shop.products.${id}`;
  return {
    id,
    name: `${base}.name`,
    price,
    category,
    shortDesc: `${base}.shortDesc`,
    description: `${base}.description`,
    image: 'assets/images/placeholder.jpg',
  };
}

// Floral-only shop — orders also taken by phone at 0741 115 864
export const PRODUCTS: Product[] = [
  prod('coroana-clasica', 'coroane', 150),
  prod('coroana-trandafiri', 'coroane', 250),
  prod('coroana-garoafe', 'coroane', 180),
  prod('coroana-mixta', 'coroane', 200),
  prod('jerba-clasica', 'jerbe', 120),
  prod('jerba-premium', 'jerbe', 180),
  prod('cruce-florala', 'aranjamente', 160),
  prod('aranjament-capac', 'aranjamente', 170),
  prod('cos-flori', 'aranjamente', 130),
  prod('buchet-comemorativ', 'buchete', 80),
];

export const CATEGORIES = [
  { id: 'all', labelKey: 'shop.cat.all' },
  { id: 'coroane', labelKey: 'shop.cat.coroane' },
  { id: 'jerbe', labelKey: 'shop.cat.jerbe' },
  { id: 'aranjamente', labelKey: 'shop.cat.aranjamente' },
  { id: 'buchete', labelKey: 'shop.cat.buchete' },
];
