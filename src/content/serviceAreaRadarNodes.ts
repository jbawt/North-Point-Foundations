/** Map nodes for the service-area radar UI (per-node stats are optional / unused in the map UI). */

export type ServiceRadarOperationalStats = {
  projectsYtd: number;
  avgRadiusKm: number;
  responseHrs: number;
  status: 'ACTIVE' | 'STANDBY';
};

export type ServiceRadarNode = {
  id: string;
  name: string;
  coords: [number, number];
  stats: ServiceRadarOperationalStats;
  /** Slightly slower / softer ping for catch-all node */
  pulseScale?: number;
};

export const SERVICE_RADAR_NODES: ServiceRadarNode[] = [
  {
    id: 'lacombe',
    name: 'Lacombe',
    coords: [-113.7322, 52.4683],
    stats: { projectsYtd: 28, avgRadiusKm: 42, responseHrs: 6, status: 'ACTIVE' },
  },
  {
    id: 'red-deer',
    name: 'Red Deer',
    coords: [-113.8111, 52.2681],
    stats: { projectsYtd: 61, avgRadiusKm: 35, responseHrs: 5, status: 'ACTIVE' },
  },
  {
    id: 'blackfalds',
    name: 'Blackfalds',
    coords: [-113.8854, 52.2308],
    stats: { projectsYtd: 19, avgRadiusKm: 28, responseHrs: 7, status: 'ACTIVE' },
  },
  {
    id: 'sylvan-lake',
    name: 'Sylvan Lake',
    coords: [-114.094, 52.3236],
    stats: { projectsYtd: 22, avgRadiusKm: 48, responseHrs: 8, status: 'ACTIVE' },
  },
  {
    id: 'innisfail',
    name: 'Innisfail',
    coords: [-113.944, 52.028],
    stats: { projectsYtd: 14, avgRadiusKm: 52, responseHrs: 9, status: 'STANDBY' },
  },
  {
    id: 'ponoka',
    name: 'Ponoka',
    coords: [-113.581, 52.6767],
    stats: { projectsYtd: 16, avgRadiusKm: 44, responseHrs: 8, status: 'ACTIVE' },
  },
  {
    id: 'surrounding',
    name: 'Surrounding areas',
    coords: [-113.72, 52.52],
    stats: { projectsYtd: 31, avgRadiusKm: 68, responseHrs: 12, status: 'ACTIVE' },
    pulseScale: 0.85,
  },
];

export const SERVICE_RADAR_MAP_VIEW = {
  longitude: -113.8111,
  latitude: 52.33,
  zoom: 8.85,
} as const;

/** Whole-world framing before flying to the service region (Mapbox Web Mercator). */
export const SERVICE_RADAR_GLOBE_INTRO_VIEW = {
  longitude: 0,
  latitude: 20,
  zoom: 0,
  pitch: 0,
  bearing: 0,
} as const;

/** SW / NE corners for fitting every radar node (with margin for rings). */
export function getServiceRadarBounds(): [[number, number], [number, number]] {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const { coords } of SERVICE_RADAR_NODES) {
    const [lng, lat] = coords;
    west = Math.min(west, lng);
    east = Math.max(east, lng);
    south = Math.min(south, lat);
    north = Math.max(north, lat);
  }
  const latSpan = north - south;
  const lngSpan = east - west;
  const southExtra = Math.max(0.12, latSpan * 0.14);
  const northExtra = Math.max(0.06, latSpan * 0.09);
  const lngExtra = Math.max(0.07, lngSpan * 0.11);
  return [
    [west - lngExtra, south - southExtra],
    [east + lngExtra, north + northExtra],
  ];
}
