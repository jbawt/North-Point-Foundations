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
    'Exterior foundation waterproofing',
    'Crack repair',
    'Weeping tile installation',
    'Sump pump systems',
    'Window well repair',
    'Excavation work',
  ] as const,
  values: 'We focus on honest pricing and reliable service.',
  /** Hero supporting line (hero + meta) */
  heroSub: `Locally owned foundation repair and waterproofing in Central Alberta — serving Lacombe, Red Deer, Blackfalds, Ponoka, and surrounding areas. Exterior waterproofing, crack repair, weeping tile, sump systems, window wells, and excavation. Honest pricing and reliable service.`,
} as const;

export function serviceAreasSentence(): string {
  const [a, b, c, d, rest] = SITE.serviceAreas;
  return `${a}, ${b}, ${c}, ${d}, and ${rest}`;
}
