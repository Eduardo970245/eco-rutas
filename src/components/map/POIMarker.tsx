import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { POI } from '../../types/route.types';
import { COLORS, POI_CATEGORY_EMOJI } from '../../lib/constants';

interface POIMarkerProps {
  poi: POI;
  visited: boolean;
  active: boolean;
  onPress: () => void;
}

export function POIMarker({ poi, visited, active, onPress }: POIMarkerProps) {
  const emoji = POI_CATEGORY_EMOJI[poi.category] ?? '📍';

  return (
    <Marker
      coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
      onPress={onPress}
      tracksViewChanges={false}
      zIndex={active ? 100 : 10}
    >
      <View style={styles.wrapper}>
        <View
          style={[
            styles.bubble,
            visited && styles.bubbleVisited,
            active && styles.bubbleActive,
          ]}
        >
          <Text style={styles.emoji}>{visited ? '✓' : emoji}</Text>
        </View>
        <View
          style={[
            styles.pin,
            visited && styles.pinVisited,
            active && styles.pinActive,
          ]}
        />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  bubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.moss,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  bubbleVisited: { backgroundColor: '#999', opacity: 0.75 },
  bubbleActive: {
    backgroundColor: COLORS.gold,
    transform: [{ scale: 1.15 }],
  },
  emoji: { fontSize: 17 },
  pin: {
    width: 3,
    height: 8,
    backgroundColor: COLORS.moss,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  pinVisited: { backgroundColor: '#999' },
  pinActive:  { backgroundColor: COLORS.gold },
});
