import { create } from 'zustand';
import { Route, POI } from '../types/route.types';
import { saveProgress } from '../services/progress.service';

interface RouteStore {
  activeRoute: Route | null;
  visitedPOIs: Set<string>;
  activePOI: POI | null;

  setActiveRoute: (route: Route, previouslyVisited?: string[]) => void;
  markPOIVisited: (poiId: string) => void;
  setActivePOI: (poi: POI | null) => void;
  clearRoute: () => void;
  isRouteComplete: () => boolean;
}

export const useRouteStore = create<RouteStore>((set, get) => ({
  activeRoute: null,
  visitedPOIs: new Set(),
  activePOI: null,

  setActiveRoute: (route, previouslyVisited = []) =>
    set({
      activeRoute: route,
      visitedPOIs: new Set(previouslyVisited),
      activePOI: null,
    }),

  markPOIVisited: (poiId) => {
    const { activeRoute, visitedPOIs } = get();
    const updated = new Set([...visitedPOIs, poiId]);
    set({ visitedPOIs: updated });

    // Persistir progreso
    if (activeRoute) {
      const ids = Array.from(updated);
      const completed = ids.length >= activeRoute.pois.length;
      saveProgress({
        route_id: activeRoute.id,
        visited_poi_ids: ids,
        started_at: new Date().toISOString(),
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      });
    }
  },

  setActivePOI: (poi) => set({ activePOI: poi }),

  clearRoute: () =>
    set({ activeRoute: null, visitedPOIs: new Set(), activePOI: null }),

  isRouteComplete: () => {
    const { activeRoute, visitedPOIs } = get();
    if (!activeRoute) return false;
    return visitedPOIs.size >= activeRoute.pois.length;
  },
}));
