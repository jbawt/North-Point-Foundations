/**
 * Residential floor-plan schematic (~40' × 28' proportions) for the Services blueprint panel.
 * Exterior = animated red stroke; no interior partition graphics.
 */
export const REPAIR_PLAN_VIEWBOX = '-28 -38 496 384';

/** Single closed loop — outer shell + porch notch (bottom center). */
export const REPAIR_PLAN_OUTLINE_D =
  'M 52 52 L 372 52 L 372 248 L 272 248 L 272 276 L 152 276 L 152 248 L 52 248 Z';

/** Perimeter survey nodes (blue rings like the reference). */
export const REPAIR_PLAN_MARKERS: { cx: number; cy: number }[] = [
  { cx: 212, cy: 52 },
  { cx: 372, cy: 52 },
  { cx: 372, cy: 248 },
  /** Porch center — above weeping-tile label; replaces (152,276) + (272,276). */
  { cx: 212, cy: 276 },
  { cx: 52, cy: 248 },
  { cx: 52, cy: 150 },
];

export const REPAIR_PLAN_ANNOTATIONS: {
  key: string;
  x: number;
  y: number;
  lines: readonly string[];
  textAnchor?: 'start' | 'middle' | 'end';
}[] = [
  {
    key: 'ext-wp',
    x: 212,
    y: 18,
    lines: ['EXT. WATERPROOFING', 'membrane + grade'],
    textAnchor: 'middle',
  },
  {
    key: 'window-well',
    /** Vertically aligned with left-wall marker (52, 150). */
    x: 104,
    y: 146,
    lines: ['WINDOW WELL', 'rebuild / seal'],
    textAnchor: 'middle',
  },
  {
    key: 'crack',
    /** Above top-right perimeter dot (372, 52). */
    x: 372,
    y: 26,
    lines: ['CRACK REPAIR', 'inject + monitor'],
    textAnchor: 'middle',
  },
  {
    key: 'weeping',
    x: 212,
    y: 296,
    lines: ['WEEPING TILE', 'perimeter drain'],
    textAnchor: 'middle',
  },
  {
    key: 'sump',
    /** Below the (372, 248) marker; left-aligned block shifted right. */
    x: 360,
    y: 268,
    lines: ['SUMP SYSTEM', 'basin + discharge'],
    textAnchor: 'start',
  },
  {
    key: 'excavation',
    /** Snug under bottom-left marker (52, 248). */
    x: 52,
    y: 266,
    lines: ['EXCAVATION', 'exterior access'],
    textAnchor: 'middle',
  },
];
