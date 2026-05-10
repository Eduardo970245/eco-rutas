import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/lib/constants';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🌍 Eco-Rutas · Lerma</Text>
          </View>

          {/* Título */}
          <Text style={styles.title}>{'Camina.\nAprende.\nCuida.'}</Text>

          {/* Subtítulo */}
          <Text style={styles.subtitle}>
            Descubre rutas sustentables cerca de ti y conoce la historia viva
            de los ecosistemas que habitamos.
          </Text>

          {/* CTA */}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push('/routes')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Explorar rutas cercanas →</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>Sin cuentas · Sin registro · Solo camina</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  badge: {
    backgroundColor: 'rgba(196,163,90,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(196,163,90,0.4)',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginBottom: 28,
  },
  badgeText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 46,
    fontWeight: '700',
    color: COLORS.cream,
    textAlign: 'center',
    lineHeight: 52,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.sage,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
    maxWidth: 300,
    marginBottom: 40,
  },
  btn: {
    backgroundColor: COLORS.moss,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
  },
});
