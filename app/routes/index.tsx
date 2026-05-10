import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, SafeAreaView,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { router } from 'expo-router';
import { useLocation } from '@/hooks/useLocation';
import { useNearbyRoutes } from '@/hooks/useNearbyRoutes';
import { useRouteStore } from '@/store/routeStore';
import { RouteCard } from '@/components/route/RouteCard';
import { COLORS } from '@/lib/constants';
import { Route } from '@/types/route.types';

export default function RoutesScreen() {
  const { coords, heading } = useLocation();
  const { routes, loading, error } = useNearbyRoutes(coords);
  const { setActiveRoute } = useRouteStore();

  const handleSelectRoute = (route: Route) => {
    setActiveRoute(route);
    router.push(`/routes/${route.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Mini mapa en la parte superior */}
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          mapType="terrain"
          showsUserLocation={false}
          initialRegion={{
            latitude: coords?.latitude ?? 19.2847,
            longitude: coords?.longitude ?? -99.5120,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          region={
            coords
              ? {
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
              : undefined
          }
        />
        {!coords && (
          <View style={styles.mapOverlay}>
            <ActivityIndicator color={COLORS.sage} />
            <Text style={styles.mapOverlayText}>Obteniendo ubicación...</Text>
          </View>
        )}
      </View>

      {/* Top bar */}
      <SafeAreaView style={styles.topBar}>
        <Text style={styles.topBarTitle}>Rutas cercanas</Text>
        <View style={[styles.gpsIndicator, coords ? styles.gpsOn : styles.gpsOff]} />
      </SafeAreaView>

      {/* Lista de rutas */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>
          {loading
            ? 'Buscando rutas...'
            : `${routes.length} ruta${routes.length !== 1 ? 's' : ''} disponible${routes.length !== 1 ? 's' : ''} cerca de ti`}
        </Text>

        {loading && (
          <ActivityIndicator color={COLORS.moss} style={{ marginTop: 20 }} />
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              No se pudieron cargar las rutas. Verifica tu conexión.
            </Text>
          </View>
        )}

        {!loading && !error && routes.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              No hay rutas disponibles en tu zona aún.{'\n'}¡Próximamente!
            </Text>
          </View>
        )}

        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            userCoords={coords}
            onPress={() => handleSelectRoute(route)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  mapContainer: { height: 200, backgroundColor: COLORS.surface },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,47,39,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapOverlayText: { color: COLORS.sage, fontSize: 13 },
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: COLORS.dark,
    zIndex: 10,
  },
  topBarTitle: { fontSize: 20, fontWeight: '700', color: COLORS.cream },
  gpsIndicator: {
    width: 10, height: 10, borderRadius: 5,
  },
  gpsOn:  { backgroundColor: '#5CDB95' },
  gpsOff: { backgroundColor: '#888' },
  list: { flex: 1, marginTop: 200 },
  listContent: { padding: 16, paddingBottom: 32 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginBottom: 14,
  },
  errorBox: {
    backgroundColor: 'rgba(224,122,95,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(224,122,95,0.3)',
  },
  errorText: { fontSize: 14, color: '#E07A5F', textAlign: 'center' },
  emptyBox: {
    padding: 32, alignItems: 'center',
  },
  emptyText: {
    fontSize: 15, color: COLORS.muted,
    textAlign: 'center', lineHeight: 22,
  },
});
