import { useEffect } from 'react';
import { useRouteStore } from '../store/routeStore';
import { loadProgress } from '../services/progress.service';

/** Carga el progreso guardado al iniciar una ruta */
export function useRouteProgress(routeId: string | null) {
  const { setActiveRoute, activeRoute } = useRouteStore();

  useEffect(() => {
    if (!routeId || !activeRoute) return;

    loadProgress(routeId).then((saved) => {
      if (saved && saved.visited_poi_ids.length > 0) {
        setActiveRoute(activeRoute, saved.visited_poi_ids);
      }
    });
  }, [routeId]);
}
