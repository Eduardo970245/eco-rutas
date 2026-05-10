import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useRouteStore } from '@/store/routeStore';
import { POITimeline } from '@/components/route/POITimeline';
import { COLORS, DIFFICULTY_LABEL, DIFFICULTY_COLOR } from '@/lib/constants';

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeRoute, setActiveRoute } = useRouteStore();

  if (!activeRoute) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.moss} />
      </View>
    );
  }

  const diffColor = DIFFICULTY_COLOR[activeRoute.difficulty] ?? COLORS.sage;
  const diffLabel = DIFFICULTY_LABEL[activeRoute.difficulty] ?? activeRoute.difficulty;

  const handleStart = () => {
    router.push(`/navigation/${activeRoute.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header oscuro */}
      <View style={styles.hero}>
        <SafeAreaView>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.heroSub}>Ruta · Lerma, Estado de México</Text>
          <Text style={styles.heroTitle}>{activeRoute.name}</Text>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="📏" value={`${activeRoute.distance_km}`} label="kilómetros" />
          <StatCard icon="⏱" value={`~${activeRoute.duration_minutes}`} label="minutos" />
          <StatCard icon="📍" value={`${activeRoute.pois.length}`} label="puntos" />
        </View>

        {/* Dificultad */}
        <View style={[styles.diffRow, { borderColor: diffColor }]}>
          <Text style={[styles.diffText, { color: diffColor }]}>
            Dificultad: {diffLabel}
          </Text>
        </View>

        {/* Descripción */}
        <Text style={styles.desc}>{activeRoute.description}</Text>

        {/* Itinerario */}
        <Text style={styles.sectionLabel}>Itinerario de la ruta</Text>
        <POITimeline
          pois={activeRoute.pois}
          startLat={activeRoute.start_lat}
          startLng={activeRoute.start_lng}
        />
      </ScrollView>

      {/* Botón iniciar */}
      <SafeAreaView style={styles.footer}>
        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>Iniciar ruta →</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { backgroundColor: COLORS.dark, padding: 16 },
  backBtn: { marginBottom: 12 },
  backText: { color: COLORS.sage, fontSize: 15 },
  heroSub: { color: COLORS.sage, fontSize: 13, fontWeight: '300', marginBottom: 4 },
  heroTitle: {
    fontSize: 30, fontWeight: '700',
    color: COLORS.cream, lineHeight: 36,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: '#fff',
    borderRadius: 12, padding: 12,
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(74,124,111,0.15)',
  },
  statIcon:  { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '600', color: COLORS.earth },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  diffRow: {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
    alignSelf: 'flex-start', marginBottom: 14,
  },
  diffText: { fontSize: 13, fontWeight: '500' },
  desc: {
    fontSize: 14, color: COLORS.muted,
    lineHeight: 22, marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '500',
    letterSpacing: 0.5, textTransform: 'uppercase',
    color: COLORS.muted, marginBottom: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.cream,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74,124,111,0.15)',
  },
  startBtn: {
    backgroundColor: COLORS.earth,
    borderRadius: 14, padding: 16,
    alignItems: 'center',
  },
  startBtnText: { color: COLORS.cream, fontSize: 16, fontWeight: '600' },
});
