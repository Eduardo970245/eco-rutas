import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { RouteMap } from '@/components/map/RouteMap';
import { DirectionBanner } from '@/components/navigation/DirectionBanner';
import { ProgressBar } from '@/components/navigation/ProgressBar';
import { POIBottomSheet } from '@/components/sheets/POIBottomSheet';
import { useLocation } from '@/hooks/useLocation';
import { useGeofence } from '@/hooks/useGeofence';
import { useRouteProgress } from '@/hooks/useRouteProgress';
import { useRouteStore } from '@/store/routeStore';
import { POI } from '@/types/route.types';
import { COLORS } from '@/lib/constants';

export default function NavigationScreen() {
  const { activeRoute, visitedPOIs, activePOI, setActivePOI, markPOIVisited, isRouteComplete } =
    useRouteStore();
  const { coords, heading } = useLocation();
  const [manualPOI, setManualPOI] = useState<POI | null>(null);

  // Restaurar progreso previo si existe
  useRouteProgress(activeRoute?.id ?? null);

  // Geofencing automático
  useGeofence({
    userCoords: coords,
    pois: activeRoute?.pois ?? [],
    visitedPOIIds: visitedPOIs,
    onEnterPOI: (poi) => setActivePOI(poi),
  });

  const displayedPOI = activePOI ?? manualPOI;

  const handleDismiss = useCallback(() => {
    if (activePOI) markPOIVisited(activePOI.id);
    setActivePOI(null);
    setManualPOI(null);
  }, [activePOI]);

  const nextUnvisitedPOI =
    activeRoute?.pois.find((p) => !visitedPOIs.has(p.id)) ?? null;

  if (!activeRoute) {
    return (
      <View style={styles.noRoute}>
        <Text style={styles.noRouteText}>No hay ruta activa.</Text>
        <TouchableOpacity onPress={() => router.replace('/routes')}>
          <Text style={styles.noRouteLink}>Volver a rutas →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <RouteMap
        route={activeRoute}
        userCoords={coords}
        visitedPOIIds={visitedPOIs}
        activePOIId={displayedPOI?.id ?? null}
        onPOIPress={(poi) => setManualPOI(poi)}
      />

      {/* Botón pausar */}
      <SafeAreaView style={styles.pauseArea}>
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.pauseText}>✕ Pausar</Text>
        </TouchableOpacity>

        {isRouteComplete() && (
          <View style={styles.completeBadge}>
            <Text style={styles.completeText}>¡Ruta completada! 🎉</Text>
          </View>
        )}
      </SafeAreaView>

      {/* Dirección hacia el siguiente POI */}
      <DirectionBanner
        userCoords={coords}
        heading={heading}
        nextPOI={nextUnvisitedPOI}
      />

      {/* Barra de progreso inferior */}
      <ProgressBar
        total={activeRoute.pois.length}
        visited={visitedPOIs.size}
      />

      {/* Modal educativo del POI */}
      {displayedPOI && (
        <POIBottomSheet poi={displayedPOI} onDismiss={handleDismiss} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  noRoute: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.dark, gap: 12,
  },
  noRouteText: { color: COLORS.cream, fontSize: 16 },
  noRouteLink: { color: COLORS.sage, fontSize: 15 },
  pauseArea: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 50,
  },
  pauseBtn: {
    backgroundColor: 'rgba(26,47,39,0.85)',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pauseText: { color: COLORS.cream, fontSize: 13, fontWeight: '500' },
  completeBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  completeText: { color: COLORS.dark, fontSize: 13, fontWeight: '600' },
});
