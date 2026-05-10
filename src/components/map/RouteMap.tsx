import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {
  Polyline,
  Marker,
  Circle,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { Route, POI, Coordinates } from '../../types/route.types';
import { POIMarker } from './POIMarker';
import { UserMarker } from './UserMarker';
import { extractPolylineCoords } from '../../lib/geo.utils';
import { COLORS } from '../../lib/constants';

interface RouteMapProps {
  route: Route;
  userCoords: Coordinates | null;
  visitedPOIIds: Set<string>;
  activePOIId: string | null;
  showStartLine?: boolean;   // línea punteada desde usuario al inicio
  onPOIPress: (poi: POI) => void;
}

export function RouteMap({
  route,
  userCoords,
  visitedPOIIds,
  activePOIId,
  showStartLine = false,
  onPOIPress,
}: RouteMapProps) {
  const mapRef = useRef<MapView>(null);
  const routeCoords = extractPolylineCoords(route.geojson);

  // Centrar mapa en el usuario cuando llega la primera posición
  useEffect(() => {
    if (userCoords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        },
        800
      );
    }
  }, [!!userCoords]); // solo cuando pasa de null a tener valor

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_GOOGLE}
      mapType="terrain"
      showsCompass={true}
      showsScale={true}
      showsMyLocationButton={false}
      initialRegion={{
        latitude: route.start_lat,
        longitude: route.start_lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {/* Trazado principal de la ruta */}
      <Polyline
        coordinates={routeCoords}
        strokeColor={COLORS.moss}
        strokeWidth={4}
      />

      {/* Línea punteada usuario → punto de inicio (antes de iniciar) */}
      {showStartLine && userCoords && (
        <Polyline
          coordinates={[
            userCoords,
            { latitude: route.start_lat, longitude: route.start_lng },
          ]}
          strokeColor={COLORS.gold}
          strokeWidth={2}
          lineDashPattern={[8, 6]}
        />
      )}

      {/* Marcador punto de inicio */}
      <Marker
        coordinate={{ latitude: route.start_lat, longitude: route.start_lng }}
        title="Punto de inicio"
        pinColor={COLORS.gold}
        zIndex={50}
      />

      {/* POIs con su radio visual */}
      {route.pois.map((poi) => (
        <React.Fragment key={poi.id}>
          <POIMarker
            poi={poi}
            visited={visitedPOIIds.has(poi.id)}
            active={activePOIId === poi.id}
            onPress={() => onPOIPress(poi)}
          />
          <Circle
            center={{ latitude: poi.latitude, longitude: poi.longitude }}
            radius={poi.trigger_radius_m}
            fillColor="rgba(74,124,111,0.07)"
            strokeColor="rgba(74,124,111,0.25)"
            strokeWidth={1}
          />
        </React.Fragment>
      ))}

      {/* Posición del usuario */}
      {userCoords && <UserMarker coords={userCoords} />}
    </MapView>
  );
}
