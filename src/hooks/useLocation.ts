import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../store/locationStore';
import {
  LOCATION_UPDATE_INTERVAL_MS,
  LOCATION_DISTANCE_INTERVAL_M,
} from '../lib/constants';

export function useLocation() {
  const { coords, heading, accuracy, setLocation } = useLocationStore();
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    async function start() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      // Posición inicial rápida
      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(
        { latitude: initial.coords.latitude, longitude: initial.coords.longitude },
        initial.coords.heading ?? 0,
        initial.coords.accuracy ?? 0
      );

      // Watch continuo
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: LOCATION_UPDATE_INTERVAL_MS,
          distanceInterval: LOCATION_DISTANCE_INTERVAL_M,
        },
        (loc) => {
          setLocation(
            { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
            loc.coords.heading ?? 0,
            loc.coords.accuracy ?? 0
          );
        }
      );
    }

    start();

    return () => {
      watchRef.current?.remove();
      startedRef.current = false;
    };
  }, []);

  return { coords, heading, accuracy };
}
