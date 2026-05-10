import { useEffect, useRef } from 'react';
import { Coordinates, POI } from '../types/route.types';
import { getDistanceMeters } from '../lib/geo.utils';

interface UseGeofenceProps {
  userCoords: Coordinates | null;
  pois: POI[];
  visitedPOIIds: Set<string>;
  onEnterPOI: (poi: POI) => void;
}

export function useGeofence({
  userCoords,
  pois,
  visitedPOIIds,
  onEnterPOI,
}: UseGeofenceProps) {
  const triggeredRef = useRef<Set<string>>(new Set());

  // Detectar entrada a un POI
  useEffect(() => {
    if (!userCoords) return;

    for (const poi of pois) {
      if (visitedPOIIds.has(poi.id)) continue;
      if (triggeredRef.current.has(poi.id)) continue;

      const dist = getDistanceMeters(
        userCoords.latitude, userCoords.longitude,
        poi.latitude, poi.longitude
      );

      if (dist <= poi.trigger_radius_m) {
        triggeredRef.current.add(poi.id);
        onEnterPOI(poi);
        break; // solo un POI a la vez
      }
    }
  }, [userCoords?.latitude, userCoords?.longitude]);

  // Detectar salida del radio (permite re-trigger si el usuario vuelve)
  useEffect(() => {
    if (!userCoords) return;

    for (const poiId of Array.from(triggeredRef.current)) {
      const poi = pois.find((p) => p.id === poiId);
      if (!poi) continue;

      const dist = getDistanceMeters(
        userCoords.latitude, userCoords.longitude,
        poi.latitude, poi.longitude
      );

      if (dist > poi.trigger_radius_m * 1.5) {
        triggeredRef.current.delete(poiId);
      }
    }
  }, [userCoords?.latitude, userCoords?.longitude]);
}
