import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../lib/constants';

interface ProgressBarProps {
  total: number;
  visited: number;
}

export function ProgressBar({ total, visited }: ProgressBarProps) {
  const pct = total > 0 ? (visited / total) * 100 : 0;
  const complete = visited === total && total > 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>
          {complete ? '¡Ruta completada! 🎉' : `${visited} de ${total} puntos visitados`}
        </Text>
        <Text style={styles.pct}>{Math.round(pct)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.dark,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74,124,111,0.2)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: { fontSize: 12, color: COLORS.sage },
  pct:   { fontSize: 12, color: COLORS.sage, fontWeight: '500' },
  track: {
    height: 4,
    backgroundColor: 'rgba(74,124,111,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.sage,
  },
});
