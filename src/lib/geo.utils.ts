const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Distancia en kilómetros entre dos coordenadas (Haversine) */
export function getDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Distancia en metros entre dos coordenadas */
export function getDistanceMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  return getDistanceKm(lat1, lng1, lat2, lng2) * 1000;
}

/** Ángulo en grados desde un punto hacia otro (0 = Norte) */
export function getBearing(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Flecha de dirección relativa al heading del usuario */
export function getDirectionArrow(bearing: number, heading: number): string {
  const diff = ((bearing - heading) + 360) % 360;
  if (diff < 22.5 || diff >= 337.5)  return '↑';
  if (diff < 67.5)                    return '↗';
  if (diff < 112.5)                   return '→';
  if (diff < 157.5)                   return '↘';
  if (diff < 202.5)                   return '↓';
  if (diff < 247.5)                   return '↙';
  if (diff < 292.5)                   return '←';
  return '↖';
}

/** Extrae coordenadas de un GeoJSON LineString para react-native-maps */
export function extractPolylineCoords(
  geojson: GeoJSON.FeatureCollection
): { latitude: number; longitude: number }[] {
  const feature = geojson.features.find(
    (f) => f.geometry.type === 'LineString'
  );
  if (!feature || feature.geometry.type !== 'LineString') return [];
  return feature.geometry.coordinates.map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));
}

/** Formatea distancia en metros o kilómetros */
export function formatDistance(meters: number): string {
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(1)} km`;
}
