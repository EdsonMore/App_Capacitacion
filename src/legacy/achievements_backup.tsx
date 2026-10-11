import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Pressable,
  Platform,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { dataService } from '@/services/dataService';
import { UserStats } from '@/types';
import PuraFruitHeaderLogo from '@/components/PuraFruitHeaderLogo';

export default function AchievementsScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await dataService.getUserStats();
      setStats(data);
    } catch (e) {
      console.warn('Error loading achievements stats:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const handleShareCertificate = async () => {
    try {
      await Share.share({
        message:
          '¡He completado con éxito el Módulo 2 de Pura Fruit Company! Certificado en Manejo de Racimos y Tijeras de Raleo en Fundo San Lorenzo - Piura. Score: 120/120 pts (100% precisión).',
        title: 'Certificado PuraFruit - Piura',
      });
    } catch {
      Alert.alert('Compartir Certificado', 'Certificado copiado al portapapeles listo para enviar a tu supervisor.');
    }
  };

  const handleNextModule = () => {
    router.push('/(tabs)/learn' as any);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Superior PuraFruit Company */}
        <View style={styles.topHeader}>
          <PuraFruitHeaderLogo size="md" title="Mis Logros" />
        </View>

        {/* Tag Superior y Mensaje de Éxito */}
        <View style={styles.successBannerContainer}>
          <View style={styles.successPillTag}>
            <Text style={styles.successPillText}>MÓDULO FINALIZADO CON ÉXITO</Text>
          </View>
          <Text style={styles.successHeading}>¡Excelente trabajo!</Text>
          <Text style={styles.successSubtitle}>
            Has demostrado maestría técnica en las normas de cosecha de Piura.
          </Text>
          <View style={styles.deviceRow}>
            <Ionicons name="hardware-chip-outline" size={14} color="#64748B" />
            <Text style={styles.deviceText}>Progreso guardado en este dispositivo</Text>
          </View>
        </View>

        {/* Tarjeta de Insignia de Certificación */}
        <View style={[styles.certCard, Shadows.md]}>
          {/* Badge Gráfico Circular */}
          <View style={styles.badgeGraphicWrapper}>
            <View style={styles.outerBadgeCircle}>
              <MaterialCommunityIcons name="fruit-grapes" size={32} color="#1D7A46" />
              {/* Estrellita Dorada en la Esquina */}
              <View style={styles.starBadgeCircle}>
                <Ionicons name="star" size={11} color="#FFFFFF" />
              </View>
            </View>
            {/* Tag Inferior del Nivel Overlapping */}
            <View style={styles.levelOverlayTag}>
              <Ionicons name="checkmark" size={12} color="#15803D" style={{ marginRight: 2 }} />
              <Text style={styles.levelOverlayText}>NIVEL 1</Text>
            </View>
          </View>

          <Text style={styles.certRoleTitle}>Cosechador Certificado</Text>
          <Text style={styles.certSpecialtyText}>
            Especialidad: Manejo de Racimos y Tijeras de Raleo
          </Text>

          <View style={styles.badgeUnlockedTag}>
            <MaterialCommunityIcons name="trophy-variant" size={14} color="#64748B" />
            <Text style={styles.badgeUnlockedText}>Insignia desbloqueada hoy</Text>
          </View>
        </View>

        {/* Sección: Resultados de la Evaluación */}
        <View style={styles.resultsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Resultados de la Evaluación</Text>
            <Text style={styles.locationTag}>Fundo San Lorenzo • Piura</Text>
          </View>

          {/* Caja de Puntuación Total */}
          <View style={[styles.totalScoreCard, Shadows.sm]}>
            <View style={styles.starPurpleIconBox}>
              <Ionicons name="star" size={22} color="#7E22CE" />
            </View>

            <View style={styles.scoreTextBox}>
              <Text style={styles.scoreLabelText}>PUNTUACIÓN TOTAL</Text>
              <View style={styles.scoreNumberRow}>
                <Text style={styles.scoreMainNum}>120</Text>
                <Text style={styles.scoreSubNum}> / 120 pts</Text>
              </View>
            </View>

            <View style={styles.starsTripleRow}>
              <Ionicons name="star" size={18} color="#EAB308" />
              <Ionicons name="star" size={18} color="#EAB308" />
              <Ionicons name="star" size={18} color="#EAB308" />
            </View>
          </View>

          {/* Grid de 2 Métricas */}
          <View style={styles.metricsGridRow}>
            {/* Tarjeta 1: Precisión Técnica */}
            <View style={[styles.metricSquareCard, Shadows.sm]}>
              <View style={styles.metricTopRow}>
                <View style={[styles.metricIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <MaterialCommunityIcons name="target" size={20} color="#16A34A" />
                </View>
                <View style={styles.metricPillTagGreen}>
                  <Text style={styles.metricPillTextGreen}>5 de 5</Text>
                </View>
              </View>
              <Text style={styles.metricBigValue}>100%</Text>
              <Text style={styles.metricSubLabel}>Precisión técnica</Text>
            </View>

            {/* Tarjeta 2: Tiempo Invertido */}
            <View style={[styles.metricSquareCard, Shadows.sm]}>
              <View style={styles.metricTopRow}>
                <View style={[styles.metricIconBox, { backgroundColor: '#F1F5F9' }]}>
                  <Ionicons name="time-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.metricPillTagGray}>
                  <Text style={styles.metricPillTextGray}>Óptimo</Text>
                </View>
              </View>
              <Text style={styles.metricBigValue}>6 min</Text>
              <Text style={styles.metricSubLabel}>Tiempo invertido</Text>
            </View>
          </View>

          {/* Card de Nivel 3 y Barra de Progreso */}
          <View style={[styles.levelProgressCard, Shadows.sm]}>
            <View style={styles.levelProgressHeader}>
              <View style={styles.levelTitleRow}>
                <FontAwesome5 name="trophy" size={14} color="#D97706" style={{ marginRight: 8 }} />
                <Text style={styles.levelCardTitle}>Nivel 3: Cosechador Profesional</Text>
              </View>
              <Text style={styles.levelPointsText}>
                {stats?.points ? `${stats.points} / 1000 pts` : '780 / 1000 pts'}
              </Text>
            </View>

            {/* Barra de Progreso */}
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '78%' }]} />
            </View>

            <View style={styles.levelProgressFooter}>
              <Text style={styles.levelFooterLeft}>Faltan 220 pts para ascenso a Inspector</Text>
              <Text style={styles.levelFooterRight}>+120 pts hoy</Text>
            </View>
          </View>
        </View>

        {/* Banner de Campo (Fase Activa de Campo) */}
        <ImageBackground
          source={require('@/assets/images/uvapro/hero.jpg')}
          style={styles.fieldBannerBg}
          imageStyle={{ borderRadius: Radius.xl }}
        >
          <View style={styles.fieldBannerOverlay}>
            <View style={styles.fieldTagBadge}>
              <Text style={styles.fieldTagText}>FASE ACTIVA DE CAMPO</Text>
            </View>
            <Text style={styles.fieldBannerText}>
              La excelencia de exportación se logra racimo a racimo.
            </Text>
          </View>
        </ImageBackground>

        {/* Botones de Acción */}
        <View style={styles.actionButtonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
            ]}
            onPress={handleNextModule}
          >
            <Text style={styles.primaryBtnText}>Seguir aprendiendo (Próximo módulo)</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleShareCertificate}
          >
            <Ionicons name="share-outline" size={18} color="#0F172A" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryBtnText}>Compartir certificado con supervisor</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 50,
    paddingBottom: 40,
    gap: Spacing.lg,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  successBannerContainer: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  successPillTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  successPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  successHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  deviceText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  certCard: {
    backgroundColor: '#F4FBF7',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: 8,
  },
  badgeGraphicWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  outerBadgeCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  starBadgeCircle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EAB308',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  levelOverlayTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: -12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  levelOverlayText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  certRoleTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  certSpecialtyText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  badgeUnlockedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  badgeUnlockedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  resultsSection: {
    gap: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  locationTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  totalScoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
  },
  starPurpleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreTextBox: {
    flex: 1,
  },
  scoreLabelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  scoreNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreMainNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  scoreSubNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  starsTripleRow: {
    flexDirection: 'row',
    gap: 4,
  },
  metricsGridRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metricSquareCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 4,
  },
  metricTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricPillTagGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  metricPillTextGreen: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  metricPillTagGray: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  metricPillTextGray: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  metricBigValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  metricSubLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  levelProgressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 10,
  },
  levelProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  levelPointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#CA8A04',
    borderRadius: 4,
  },
  levelProgressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelFooterLeft: {
    fontSize: 11,
    color: '#64748B',
  },
  levelFooterRight: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  fieldBannerBg: {
    height: 110,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fieldBannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  fieldTagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  fieldTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FCD34D',
    letterSpacing: 0.5,
  },
  fieldBannerText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionButtonsContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: Radius.full,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
});
