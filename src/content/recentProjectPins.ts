/** Mock “recent project” pins for the proof-of-service map (lng, lat per GeoJSON). */
export type RecentProjectPin = {
  id: number;
  city: string;
  type: string;
  coords: [number, number];
};

export const RECENT_PROJECT_PINS: RecentProjectPin[] = [
  { id: 1, city: 'Lacombe', type: 'Waterproofing', coords: [-113.7322, 52.4683] },
  { id: 2, city: 'Red Deer', type: 'Crack repair', coords: [-113.8111, 52.2681] },
  { id: 3, city: 'Blackfalds', type: 'Weeping tile', coords: [-113.8854, 52.2308] },
  { id: 4, city: 'Ponoka', type: 'Sump pump system', coords: [-113.581, 52.6767] },
  { id: 5, city: 'Sylvan Lake', type: 'Exterior waterproofing', coords: [-114.094, 52.3236] },
  { id: 6, city: 'Lacombe County', type: 'Window well repair', coords: [-113.85, 52.52] },
  { id: 7, city: 'Red Deer County', type: 'Crack repair', coords: [-113.65, 52.2] },
];

/** Display-only aggregate for the “data” counter overlay. */
export const PROJECTS_LOGGED_DISPLAY = 147;
