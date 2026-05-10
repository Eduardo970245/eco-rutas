// ─── Coordenadas ─────────────────────────────────────────────
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// ─── Punto de interés ─────────────────────────────────────────
export type POICategory = 'agua' | 'fauna' | 'flora' | 'historia' | 'general';

export interface POI {
  id: string;
  route_id: string;
  name: string;
  description: string;
  fun_fact: string | null;
  category: POICategory;
  latitude: number;
  longitude: number;
  trigger_radius_m: number;
  order_index: number;
  active: boolean;
}

// ─── Ruta ─────────────────────────────────────────────────────
export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface Route {
  id: string;
  name: string;
  description: string;
  distance_km: number;
  duration_minutes: number;
  difficulty: Difficulty;
  geojson: GeoJSON.FeatureCollection;
  start_lat: number;
  start_lng: number;
  active: boolean;
  created_at: string;
  pois: POI[];
}

// ─── Progreso ─────────────────────────────────────────────────
export interface RouteProgress {
  route_id: string;
  visited_poi_ids: string[];
  started_at: string;
  completed: boolean;
  completed_at: string | null;
}
