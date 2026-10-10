import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { dataService } from '@/services/dataService';
import { UserStats } from '@/types';

export default function AchievementsScreen() {
  const [stats, setStats] = useState<UserStats | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await dataService.getUserStats();
      setStats(data);
    } catch (e) {
      console.warn('Error loading achievements:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <MaterialCommunityIcons name="fruit-grapes" size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.logoSub}>UVAPRO</Text>
              <Text style={styles.logoTitle}>Mis logros</Text>
            </View>
          </View>
        </View>

        {/* Hero Card de Reconocimiento */}
        <View style={[styles.heroCard, Shadows.lg]}>
          <View style={styles.medalCircle}>
            <MaterialCommunityIcons name="medal" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.heroRank}>Cosechador de Exportación</Text>
          <Text style={styles.heroPoints}>{stats?.points || 340} pts acumulados</Text>
          <Text style={styles.heroSub}>
            Cumplimiento activo de estándares GlobalG.A.P. en campo
          </Text>
        </View>

        {/* Resumen de Métricas */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, Shadows.sm]}>
            <MaterialCommunityIcons name="fire" size={24} color="#D97706" />
            <Text style={styles.metricValue}>{stats?.streakDays || 4} días</Text>
            <Text style={styles.metricLabel}>Racha actual</Text>
          </View>

          <View style={[styles.metricCard, Shadows.sm]}>
            <Ionicons name="ribbon-outline" size={24} color="#7E22CE" />
            <Text style={styles.metricValue}>{stats?.routeLessonsText || '9/20'}</Text>
            <Text style={styles.metricLabel}>Lecciones aprobadas</Text>
          </View>

          <View style={[styles.metricCard, Shadows.sm]}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#1D7A46" />
            <Text style={styles.metricValue}>100%</Text>
            <Text style={styles.metricLabel}>Precisión técnica</Text>
          </View>
        </View>

        {/* Insignias y Reconocimientos */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Insignias de Campo</Text>

          {/* Insignia 1: Guardián de la Pruina */}
          <View style={[styles.badgeCard, Shadows.sm]}>
            <View style={[styles.badgeIconBox, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="shield-star" size={26} color="#1B5E20" />
            </View>
            <View style={styles.badgeInfo}>
              <View style={styles.badgeTitleRow}>
                <Text style={styles.badgeTitle}>Guardián de la Pruina</Text>
                <View style={styles.unlockedTag}>
                  <Text style={styles.unlockedTagText}>OBTENIDA</Text>
                </View>
              </View>
              <Text style={styles.badgeDesc}>
                Manipulación experta por pedúnculo sin contacto directo con las bayas.
              </Text>
            </View>
          </View>

          {/* Insignia 2: Corte de Precisión a 45° */}
          <View style={[styles.badgeCard, Shadows.sm]}>
            <View style={[styles.badgeIconBox, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="content-cut" size={26} color="#D97706" />
            </View>
            <View style={styles.badgeInfo}>
              <View style={styles.badgeTitleRow}>
                <Text style={styles.badgeTitle}>Corte Limpio a 45°</Text>
                <View style={styles.unlockedTag}>
                  <Text style={styles.unlockedTagText}>OBTENIDA</Text>
                </View>
              </View>
              <Text style={styles.badgeDesc}>
                Uso ergonómico de tijeras de punta curva evitando daño periférico.
              </Text>
            </View>
          </View>

          {/* Insignia 3: Calibración Maestra */}
          <View style={[styles.badgeCard, Shadows.sm]}>
            <View style={[styles.badgeIconBox, { backgroundColor: '#F3E8FF' }]}>
              <MaterialCommunityIcons name="ruler-square" size={26} color="#7E22CE" />
            </View>
            <View style={styles.badgeInfo}>
              <View style={styles.badgeTitleRow}>
                <Text style={styles.badgeTitle}>Ojo Calibrador Red Globe</Text>
                <View style={styles.progressTag}>
                  <Text style={styles.progressTagText}>EN CAMINO</Text>
                </View>
              </View>
              <Text style={styles.badgeDesc}>
                Medición visual y calibrada de diámetro y grados Brix ideales para cosecha.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 50,
    paddingBottom: 40,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSub: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 6,
  },
  medalCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroRank: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroPoints: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.accentGold,
  },
  heroSub: {
    fontSize: 12,
    color: '#D8E8DC',
    textAlign: 'center',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  badgesSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  badgeCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  badgeIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInfo: {
    flex: 1,
    gap: 3,
  },
  badgeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  unlockedTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  unlockedTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1B5E20',
  },
  progressTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  progressTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  badgeDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
