import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { POI } from '../../types/route.types';
import { COLORS, POI_CATEGORY_EMOJI } from '../../lib/constants';

interface POITimelineProps {
  pois: POI[];
  startLat: number;
  startLng: number;
}

export function POITimeline({ pois, startLat, startLng }: POITimelineProps) {
  return (
    <View style={styles.container}>
      {/* Punto de inicio */}
      <TimelineItem
        dot="Tú"
        isStart
        label="Punto de inicio"
        desc="Aquí comienza la ruta"
        isLast={pois.length === 0}
      />

      {pois.map((poi, i) => (
        <TimelineItem
          key={poi.id}
          dot={String(i + 1)}
          label={poi.name}
          desc={`${POI_CATEGORY_EMOJI[poi.category] ?? '📍'} ${poi.category}`}
          isLast={i === pois.length - 1}
        />
      ))}
    </View>
  );
}

interface TimelineItemProps {
  dot: string;
  isStart?: boolean;
  label: string;
  desc: string;
  isLast: boolean;
}

function TimelineItem({ dot, isStart, label, desc, isLast }: TimelineItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.left}>
        <View style={[styles.dot, isStart && styles.dotStart]}>
          <Text style={[styles.dotText, isStart && styles.dotTextStart]}>
            {dot}
          </Text>
        </View>
        {!isLast && <View style={styles.connector} />}
      </View>
      <View style={[styles.content, !isLast && { paddingBottom: 20 }]}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  item: { flexDirection: 'row', gap: 14 },
  left: { alignItems: 'center' },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(74,124,111,0.12)',
    borderWidth: 1.5,
    borderColor: COLORS.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotStart: { backgroundColor: COLORS.moss, borderColor: COLORS.moss },
  dotText: { fontSize: 11, fontWeight: '600', color: COLORS.moss },
  dotTextStart: { color: '#fff' },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(74,124,111,0.2)',
    minHeight: 16,
    marginTop: 2,
  },
  content: { flex: 1, paddingTop: 4 },
  label: { fontSize: 14, fontWeight: '500', color: COLORS.earth, marginBottom: 2 },
  desc: { fontSize: 12, color: COLORS.muted },
});
