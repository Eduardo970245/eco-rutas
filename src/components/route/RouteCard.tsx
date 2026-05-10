import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Route } from '../../types/route.types';
import {
  COLORS,
  DIFFICULTY_LABEL,
  DIFFICULTY_COLOR,
} from '../../lib/constants';
import { getDistanceKm, formatDistance } from '../../lib/geo.utils';
import { Coordinates } from '../../types/route.types';

interface RouteCardProps {
  route: Route;
  userCoords: Coordinates | null;
  onPress: () => void;
}

export function RouteCard({ route, userCoords, onPress }: RouteCardProps) {
  const distToStart = userCoords
    ? getDistanceKm(
        userCoords.latitude, userCoords.longitude,
        route.start_lat, route.start_lng
      ) * 1000
    : null;

  const diffColor = DIFFICULTY_COLOR[route.difficulty] ?? COLORS.sage;
  const diffLabel = DIFFICULTY_LABEL[route.difficulty] ?? route.difficulty;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{route.name}</Text>
        <View style={[styles.diffBadge, { borderColor: diffColor }]}>
          <Text style={[styles.diffText, { color: diffColor }]}>{diffLabel}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.meta}>
        <Text style={styles.metaItem}>🚶 {route.distance_km} km</Text>
        <Text style={styles.metaItem}>⏱ ~{route.duration_minutes} min</Text>
        <Text style={styles.metaItem}>📍 {route.pois.length} puntos</Text>
        {distToStart !== null && (
          <Text style={styles.metaItem}>
            📏 {formatDistance(distToStart)} al inicio
          </Text>
        )}
      </View>

      {/* Descripción */}
      <Text style={styles.desc} numberOfLines={2}>
        {route.description}
      </Text>

      {/* Footer con dots de POIs */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {route.pois.map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
        <Text style={styles.cta}>Ver detalles →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(74,124,111,0.15)',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.earth,
    flex: 1,
    marginRight: 8,
  },
  diffBadge: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  diffText: { fontSize: 11, fontWeight: '500' },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  metaItem: { fontSize: 12, color: COLORS.muted },
  desc: { fontSize: 13, color: COLORS.muted, lineHeight: 19, marginBottom: 12 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74,124,111,0.1)',
  },
  dots: { flexDirection: 'row', gap: 4 },
  dot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: COLORS.sage,
  },
  cta: { fontSize: 13, fontWeight: '500', color: COLORS.moss },
});
