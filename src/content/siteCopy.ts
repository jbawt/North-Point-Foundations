/**
 * North Point Foundations — single source of truth for marketing / UI copy.
 */
export const SITE = {
  name: 'North Point Foundations',
  /** Short line for header / meta */
  shortTagline: 'Foundation repair & waterproofing',
  region: 'Central Alberta',
  serviceAreas: ['Lacombe', 'Red Deer', 'Blackfalds', 'Ponoka', 'surrounding areas'] as const,
  /** Opening paragraph — use across hero, about, SEO */
  lead:
    'North Point Foundations is a locally owned foundation repair and waterproofing company based in Central Alberta, serving Lacombe, Red Deer, Blackfalds, Ponoka, and surrounding areas.',
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
