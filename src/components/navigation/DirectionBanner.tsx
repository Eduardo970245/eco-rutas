import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Coordinates, POI } from '../../types/route.types';
import {
  getDistanceMeters,
  getBearing,
  getDirectionArrow,
  formatDistance,
} from '../../lib/geo.utils';
import { COLORS } from '../../lib/constants';

interface DirectionBannerProps {
  userCoords: Coordinates | null;
  heading: number;
  nextPOI: POI | null;
}

export function DirectionBanner({ userCoords, heading, nextPOI }: DirectionBannerProps) {
  const info = useMemo(() => {
    if (!userCoords || !nextPOI) {
      return { arrow: '→', label: 'Sigue la ruta', dist: null };
    }
    const dist = getDistanceMeters(
      userCoords.latitude, userCoords.longitude,
      nextPOI.latitude, nextPOI.longitude
    );
    const bearing = getBearing(
      userCoords.latitude, userCoords.longitude,
      nextPOI.latitude, nextPOI.longitude
    );
    return {
      arrow: getDirectionArrow(bearing, heading),
      label: nextPOI.name,
      dist: formatDistance(dist),
    };
  }, [userCoords?.latitude, userCoords?.longitude, heading, nextPOI?.id]);

  return (
    <View style={styles.banner}>
      <View style={styles.arrowBox}>
        <Text style={styles.arrow}>{info.arrow}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label} numberOfLines={1}>{info.label}</Text>
        {info.dist && (
          <Text style={styles.dist}>A {info.dist}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 16, left: 16, right: 16,
    backgroundColor: COLORS.dark,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  arrowBox: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: COLORS.moss,
    alignItems: 'center', justifyContent: 'center',
  },
  arrow: { fontSize: 24, color: '#fff' },
  info: { flex: 1 },
  label: { fontSize: 15, fontWeight: '500', color: COLORS.cream },
  dist:  { fontSize: 12, color: COLORS.sage, marginTop: 2 },
});
