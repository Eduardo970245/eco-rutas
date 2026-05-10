import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProgress } from '../types/route.types';

const KEY = (routeId: string) => `eco_rutas_progress_${routeId}`;

export async function saveProgress(progress: RouteProgress): Promise<void> {
  await AsyncStorage.setItem(KEY(progress.route_id), JSON.stringify(progress));
}

export async function loadProgress(routeId: string): Promise<RouteProgress | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY(routeId));
    return raw ? (JSON.parse(raw) as RouteProgress) : null;
  } catch {
    return null;
  }
}

export async function clearProgress(routeId: string): Promise<void> {
  await AsyncStorage.removeItem(KEY(routeId));
}
