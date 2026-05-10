// GPS
export const GEOFENCE_RADIUS_METERS = 50;
export const NEARBY_ROUTES_RADIUS_KM = 10;
export const LOCATION_UPDATE_INTERVAL_MS = 3000;
export const LOCATION_DISTANCE_INTERVAL_M = 5;

// Colores de la app
export const COLORS = {
  earth:   '#2D4A3E',
  moss:    '#4A7C6F',
  sage:    '#7EB5A6',
  cream:   '#F5F0E8',
  gold:    '#C4A35A',
  dark:    '#1A2F27',
  muted:   '#6B8F85',
  surface: '#EBF2EF',
} as const;

// Categorías de POI
export const POI_CATEGORY_EMOJI: Record<string, string> = {
  agua:     '💧',
  fauna:    '🐦',
  flora:    '🌿',
  historia: '🏛️',
  general:  '📍',
};

export const POI_CATEGORY_LABEL: Record<string, string> = {
  agua:     'Recurso hídrico',
  fauna:    'Biodiversidad',
  flora:    'Vegetación',
  historia: 'Contexto histórico',
  general:  'Punto de interés',
};

// Dificultad
export const DIFFICULTY_LABEL: Record<string, string> = {
  easy:     'Fácil',
  moderate: 'Moderada',
  hard:     'Difícil',
};

export const DIFFICULTY_COLOR: Record<string, string> = {
  easy:     '#5CDB95',
  moderate: '#F6C90E',
  hard:     '#E07A5F',
};
