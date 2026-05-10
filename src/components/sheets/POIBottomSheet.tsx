import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { POI } from '../../types/route.types';
import { COLORS, POI_CATEGORY_EMOJI, POI_CATEGORY_LABEL } from '../../lib/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface POIBottomSheetProps {
  poi: POI;
  onDismiss: () => void;
}

export function POIBottomSheet({ poi, onDismiss }: POIBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);

  const handleDismiss = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(onDismiss);
  };

  const emoji = POI_CATEGORY_EMOJI[poi.category] ?? '📍';
  const catLabel = POI_CATEGORY_LABEL[poi.category] ?? 'Punto de interés';

  return (
    <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
      <View style={styles.handle} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Categoría */}
        <View style={styles.tag}>
          <Text style={styles.tagEmoji}>{emoji}</Text>
          <Text style={styles.tagText}>{catLabel}</Text>
        </View>

        {/* Título */}
        <Text style={styles.title}>{poi.name}</Text>

        {/* Descripción */}
        <Text style={styles.description}>{poi.description}</Text>

        {/* Dato curioso */}
        {poi.fun_fact && (
          <View style={styles.factBox}>
            <Text style={styles.factLabel}>¿Sabías que?</Text>
            <Text style={styles.factText}>{poi.fun_fact}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.btn}
          onPress={handleDismiss}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Continuar la ruta →</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.78,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(45,74,62,0.2)',
    alignSelf: 'center', marginTop: 12,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 36 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(74,124,111,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 100, marginBottom: 12,
  },
  tagEmoji: { fontSize: 14 },
  tagText: {
    fontSize: 11, fontWeight: '500',
    color: COLORS.moss, letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24, fontWeight: '700',
    color: COLORS.earth, marginBottom: 12, lineHeight: 30,
  },
  description: {
    fontSize: 15, color: COLORS.muted,
    lineHeight: 24, marginBottom: 16,
  },
  factBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.moss,
    padding: 14, marginBottom: 24,
  },
  factLabel: {
    fontSize: 10, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.8,
    color: COLORS.moss, marginBottom: 6,
  },
  factText: { fontSize: 13, color: COLORS.earth, lineHeight: 20 },
  btn: {
    backgroundColor: COLORS.earth,
    borderRadius: 14, padding: 16,
    alignItems: 'center',
  },
  btnText: { color: COLORS.cream, fontSize: 15, fontWeight: '600' },
});
