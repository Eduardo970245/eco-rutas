import { useEffect, useState } from 'react';
import { Route } from '../types/route.types';
import { getNearbyRoutes } from '../services/routes.service';
import { NEARBY_ROUTES_RADIUS_KM } from '../lib/constants';
import { Coordinates } from '../types/route.types';

export function useNearbyRoutes(coords: Coordinates | null) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) return;

    setLoading(true);
    setError(null);

    getNearbyRoutes(coords.latitude, coords.longitude, NEARBY_ROUTES_RADIUS_KM)
      .then(setRoutes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [coords?.latitude, coords?.longitude]);

  return { routes, loading, error };
}
