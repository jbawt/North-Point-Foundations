/**
 * North Point Foundations — single source of truth for marketing / UI copy.
 */
export const SITE = {
  name: 'North Point Foundations',
  /** Primary CTA — dial link for “Get a quote” (replace with production number). */
  quotePhoneTel: 'tel:+15555550100',
  /** Sticky rail & footer — replace with your real profile URLs. */
  facebookUrl: 'https://www.facebook.com/',
  instagramUrl: 'https://www.instagram.com/',
  /** Home page testimonial carousel — set `true` when you have reviews to show. */
  showTestimonialsOnHome: false,
  /** Short line for header / meta */
  shortTagline: 'Foundation repair & waterproofing',
  region: 'Central Alberta',
  serviceAreas: ['Lacombe', 'Red Deer', 'Blackfalds', 'Ponoka', 'surrounding areas'] as const,
  /** Opening paragraph — use across hero, about, SEO */
  lead:
    'North Point Foundations is a locally owned foundation repair and waterproofing company based in Central Alberta, serving Lacombe, Red Deer, Blackfalds, Ponoka, and surrounding areas.',
  /** Extra body copy for the home page About section (shown below `lead`). */
  aboutHomeExtraParagraphs: [
    'Prairie seasons put real stress on foundations — freeze–thaw cycles, spring runoff, and clay-heavy soils are part of life here. We design and execute repairs with those conditions in mind, not generic one-size-fits-all fixes.',
    'From crack repair to weeping tile, sump systems, window wells, and full exterior digs, we explain what we found, what we recommend, and why — so you can decide with confidence.',
  ] as const,
  /** Extra supporting line in the home About section (beside values). */
  aboutHomeAsideDetail:
    'Licensed and insured — we would rather earn your trust with straight answers than rush a quote you cannot rely on.',
  services: [
    {
      name: 'Exterior foundation waterproofing',
      blurb: 'Seal the exterior and direct water away before it causes damage.',
      icon: 'waterproofing',
    },
    {
      name: 'Crack repair',
      blurb: 'Stabilize cracks to help protect against future water intrusion.',
      icon: 'crack-repair',
    },
    {
      name: 'Weeping tile installation',
      blurb: 'A drainage system that captures groundwater and routes it safely.',
      icon: 'weeping-tile',
    },
    {
      name: 'Sump pump systems',
      blurb: 'Reliable pumping to keep basements drier during heavy rain.',
      icon: 'sump-pump',
    },
    {
      name: 'Window well repair',
      blurb: 'Rebuild and waterproof window wells to help prevent leaks.',
      icon: 'window-well',
    },
    {
      name: 'Excavation work',
      blurb: 'Careful excavation and prep for repairs, drainage, and waterproofing.',
      icon: 'excavation',
    },
  ] as const,
  values: 'We focus on honest pricing and reliable service.',
  /** Hero supporting line (hero + meta) */
  heroSub: `Locally owned foundation repair and waterproofing in Central Alberta — serving Lacombe, Red Deer, Blackfalds, Ponoka, and surrounding areas. Exterior waterproofing, crack repair, weeping tile, sump systems, window wells, and excavation. Honest pricing and reliable service.`,
} as const;

/** Home testimonials carousel — placeholder-style quotes for local marketing. */
export const TESTIMONIALS = [
  {
    quote:
      'North Point walked us through every step of exterior waterproofing. The quote matched the final bill and the crew treated our yard with care.',
    author: 'Sarah M.',
    detail: 'Red Deer homeowner',
  },
  {
    quote:
      'We had weeping tile and a sump installed after spring seepage. Two seasons later the basement has stayed dry.',
    author: 'James T.',
    detail: 'Lacombe area',
  },
  {
    quote:
      'They gave an honest read on our foundation cracks — clear about what to fix now versus what we could watch. No pressure.',
    author: 'Rita K.',
    detail: 'Blackfalds',
  },
  {
    quote:
      'Window well rebuild and grading fixed a leak we’d fought for years. Communication was straightforward from start to finish.',
    author: 'Chris P.',
    detail: 'Ponoka region',
  },
] as const;

export type ServiceIconId =
  | 'waterproofing'
  | 'crack-repair'
  | 'weeping-tile'
  | 'sump-pump'
  | 'window-well'
  | 'excavation';

export type ServiceDetail = (typeof SITE.services)[number];

export function serviceAreasSentence(): string {
  const [a, b, c, d, rest] = SITE.serviceAreas;
  return `${a}, ${b}, ${c}, ${d}, and ${rest}`;
}
