/**
 * Schematic "Repair Plan Example" floor outline derived from the reference plan.
 * Padded viewBox so enlarged labels stay inside the SVG (no clipping at edges).
 */
export const REPAIR_PLAN_VIEWBOX = '-14 -22 452 342';

/** Single closed perimeter for one continuous pathLength draw. */
export const REPAIR_PLAN_OUTLINE_D =
  'M 42 235 L 42 78 L 58 60 L 98 48 L 128 48 L 128 70 L 192 70 L 192 48 L 272 48 L 272 40 L 318 40 L 318 88 L 300 88 L 300 178 L 318 178 L 318 238 L 205 238 L 205 252 L 168 252 L 168 238 L 108 238 L 108 272 L 52 272 L 52 238 L 42 235 Z';

/** Light grey repair / emphasis zones (filled), same as reference intent. */
export const REPAIR_PLAN_SHADES: { d: string; key: string }[] = [
  { key: 'top-inset', d: 'M 128 48 L 192 48 L 192 70 L 128 70 Z' },
  { key: 'bottom-left', d: 'M 52 238 L 108 238 L 108 272 L 52 272 Z' },
  { key: 'bottom-right', d: 'M 300 218 L 318 218 L 318 238 L 300 238 Z' },
];

/** Survey nodes (blue) — key corners only. */
export const REPAIR_PLAN_MARKERS: { cx: number; cy: number }[] = [
  { cx: 160, cy: 70 },
  { cx: 295, cy: 40 },
  { cx: 300, cy: 130 },
  { cx: 187, cy: 252 },
  { cx: 80, cy: 272 },
  { cx: 318, cy: 228 },
];

/** Callouts aligned to plan regions → service scope (blueprint-style labels). */
export const REPAIR_PLAN_ANNOTATIONS: {
  key: string;
  x: number;
  y: number;
  lines: readonly string[];
  textAnchor?: 'start' | 'middle' | 'end';
}[] = [
  {
    key: 'ext-wp',
    x: 295,
    y: 18,
    lines: ['EXT. WATERPROOFING', 'membrane + grade'],
    textAnchor: 'middle',
  },
  {
    key: 'window-well',
    x: 160,
    y: 84,
    lines: ['WINDOW WELL', 'rebuild / seal'],
    textAnchor: 'middle',
  },
  {
    key: 'crack',
    x: 308,
    y: 118,
    lines: ['CRACK REPAIR', 'inject + monitor'],
    textAnchor: 'start',
  },
  {
    key: 'weeping',
    x: 187,
    y: 266,
    lines: ['WEEPING TILE', 'perimeter drain'],
    textAnchor: 'middle',
  },
  {
    key: 'sump',
    x: 326,
    y: 222,
    lines: ['SUMP SYSTEM', 'basin + discharge'],
    textAnchor: 'start',
  },
  {
    key: 'excavation',
    x: 80,
    y: 286,
    lines: ['EXCAVATION', 'exterior access'],
    textAnchor: 'middle',
  },
];
