import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Coordinates } from '../../types/route.types';
import { COLORS } from '../../lib/constants';

export function UserMarker({ coords }: { coords: Coordinates }) {
  return (
    <Marker
      coordinate={coords}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={999}
    >
      <View style={styles.outer}>
        <View style={styles.inner} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(74,124,111,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(74,124,111,0.5)',
  },
  inner: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: COLORS.moss,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
