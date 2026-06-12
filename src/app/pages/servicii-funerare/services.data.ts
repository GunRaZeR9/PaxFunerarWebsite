export interface ServiceCard {
  slug: string;
  icon: string;
  /** i18n key — pipe through translate */
  name: string;
  /** i18n key — pipe through translate */
  teaser: string;
  /** i18n key — pipe through translate */
  description: string;
  /** i18n keys — pipe through translate */
  benefits: string[];
  ctaLabel?: string;
}

/** Builds a key-based service entry: all texts live in assets/i18n/<lang>.json under servicesData.<slug> */
function svc(slug: string, icon: string, benefitCount = 4): ServiceCard {
  const base = `servicesData.${slug}`;
  return {
    slug,
    icon,
    name: `${base}.name`,
    teaser: `${base}.teaser`,
    description: `${base}.description`,
    benefits: Array.from({ length: benefitCount }, (_, i) => `${base}.b${i + 1}`),
  };
}

export const SERVICES: ServiceCard[] = [
  svc('intocmirea-actelor', 'assets/icons/acte.svg'),
  svc('transport-funerar', 'assets/icons/transport.svg'),
  svc('imbalsamare', 'assets/icons/imbalsamare.svg'),
  svc('servicii-ceremoniale', 'assets/icons/ceremonii.svg'),
  svc('servicii-de-catering', 'assets/icons/catering.svg'),
  svc('repatriere-decedati', 'assets/icons/repatriere.svg'),
  svc('capela', 'assets/icons/capela.svg'),
  svc('pregatire-loc-de-veci', 'assets/icons/loc-veci.svg'),
  svc('incinerare', 'assets/icons/incinerare.svg'),
  svc('fotoceramica', 'assets/icons/fotoceramica.svg'),
];

/** slug → name i18n key */
export const SERVICE_MAP: Record<string, string> = Object.fromEntries(
  SERVICES.map(s => [s.slug, s.name]),
);
