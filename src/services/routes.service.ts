import { supabase } from '../lib/supabase';
import { Route } from '../types/route.types';
import { getDistanceKm } from '../lib/geo.utils';

/** Obtiene rutas cercanas a la posición del usuario */
export async function getNearbyRoutes(
  userLat: number,
  userLng: number,
  radiusKm: number = 10
): Promise<Route[]> {
  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      pois (*)
    `)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const routes = (data ?? []) as Route[];

  // Filtrar por distancia al punto de inicio
  return routes
    .filter((route) =>
      getDistanceKm(userLat, userLng, route.start_lat, route.start_lng) <= radiusKm
    )
    .map((route) => ({
      ...route,
      pois: (route.pois ?? []).sort((a, b) => a.order_index - b.order_index),
    }));
}

/** Obtiene una ruta por ID con sus POIs ordenados */
export async function getRouteById(id: string): Promise<Route | null> {
  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      pois (*)
    `)
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error) return null;

  return {
    ...data,
    pois: (data.pois ?? []).sort(
      (a: any, b: any) => a.order_index - b.order_index
    ),
  } as Route;
}
