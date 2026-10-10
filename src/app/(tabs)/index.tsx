import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { dataService } from '@/services/dataService';
import { UserStats } from '@/types';
import { SUPERVISOR_TIP } from '@/constants/mockData';

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const userStats = await dataService.getUserStats();
      setStats(userStats);
    } catch (e) {
      console.warn('Error loading home data:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleOpenLesson = (lessonId: string = 'lesson-2-2') => {
    router.push(`/lesson/${lessonId}` as any);
  };

  const handleOpenQuiz = (quizId: string = 'quiz-mod-2') => {
    router.push(`/quiz/${quizId}` as any);
  };

  const handleViewAllModules = () => {
    router.push('/(tabs)/learn' as any);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <MaterialCommunityIcons name="fruit-grapes" size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.logoSub}>UVAPRO</Text>
              <Text style={styles.logoTitle}>Inicio</Text>
            </View>
          </View>
        </View>

        {/* Saludo y Fundo */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingTitle}>¡Hola! 👋</Text>
            <Text style={styles.greetingSubtitle}>¿Listo para aprender algo nuevo?</Text>
          </View>

          <View style={styles.farmPill}>
            <View style={styles.farmDot} />
            <Text style={styles.farmText}>{stats?.currentFarmName || 'FUNDO LOS VALLES'}</Text>
          </View>
        </View>

        {/* Banner: Tu Próxima Lección */}
        <View style={[styles.nextLessonBanner, Shadows.lg]}>
          <View style={styles.bannerTopRow}>
            <View style={styles.nextLessonBadge}>
              <Text style={styles.nextLessonBadgeText}>TU PRÓXIMA LECCIÓN</Text>
            </View>

            <View style={styles.varietyContainer}>
              <Text style={styles.varietyText}>Variedad: Red Globe</Text>
              <Image
                source={require('../../../assets/images/uvapro/quiz_grape.jpg')}
                style={styles.grapeThumbnail}
              />
            </View>
          </View>

          <Text style={styles.lessonTitle}>Técnica de corte limpio en el pedúnculo</Text>

          <View style={styles.lessonMetaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#FFFFFF" />
              <Text style={styles.metaText}>3 min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color={Colors.accentGold} />
              <Text style={styles.metaText}>+20 pts</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && { opacity: 0.9 },
            ]}
            onPress={() => handleOpenLesson('lesson-2-2')}
          >
            <Ionicons name="play" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.continueButtonText}>Continuar aprendiendo</Text>
          </Pressable>
        </View>

        {/* Fila de Estadísticas (Racha, Puntos, Ruta) */}
        <View style={styles.statsRow}>
          {/* Card Racha */}
          <View style={[styles.statCard, Shadows.sm]}>
            <Text style={styles.statLabel}>Racha</Text>
            <Text style={styles.statNumber}>
              {stats?.streakDays || 4} <Text style={styles.statUnit}>días</Text>
            </Text>
            <Text style={styles.statStreakSub}>{stats?.streakText || '¡En racha!'}</Text>
          </View>

          {/* Card Puntos */}
          <View style={[styles.statCard, Shadows.sm]}>
            <View style={styles.statLabelRow}>
              <Text style={styles.statLabel}>Puntos</Text>
              <MaterialCommunityIcons name="star-circle" size={16} color="#7E22CE" />
            </View>
            <Text style={styles.statNumber}>
              {stats?.points || 340} <Text style={styles.statUnit}>pts</Text>
            </Text>
            <Text style={styles.statPointsSub}>{stats?.pointsDeltaText || '+45 hoy'}</Text>
          </View>

          {/* Card Ruta */}
          <View style={[styles.statCard, Shadows.sm]}>
            <View style={styles.statLabelRow}>
              <Text style={styles.statLabel}>Ruta</Text>
              <Ionicons name="checkmark-circle-outline" size={16} color="#1D7A46" />
            </View>
            <Text style={styles.statNumber}>{stats?.routeProgressPercent || 45}%</Text>
            <Text style={styles.statRouteSub}>{stats?.routeLessonsText || '9/20 lecc.'}</Text>
          </View>
        </View>

        {/* Progreso Global de Cosecha */}
        <View style={[styles.progressCard, Shadows.sm]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso global de cosecha</Text>
            <Text style={styles.progressPercentText}>
              {stats?.overallHarvestProgressPercent || 45}%
            </Text>
            <View style={styles.tractorCircle}>
              <MaterialCommunityIcons name="tractor" size={18} color="#1D7A46" />
            </View>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${stats?.overallHarvestProgressPercent || 45}%` },
              ]}
            />
          </View>
        </View>

        {/* Card: Test Rápido de Campo */}
        <Pressable
          style={({ pressed }) => [
            styles.quizCard,
            pressed && { opacity: 0.95 },
            Shadows.sm,
          ]}
          onPress={() => handleOpenQuiz('quiz-mod-2')}
        >
          <View style={styles.quizClockCircle}>
            <MaterialCommunityIcons name="timer-outline" size={24} color="#FFFFFF" />
          </View>

          <View style={styles.quizContent}>
            <View style={styles.quizTitleRow}>
              <Text style={styles.quizTitle}>Test rápido de cam...</Text>
              <View style={styles.quizBadge}>
                <Text style={styles.quizBadgeText}>2 MIN</Text>
              </View>
            </View>
            <Text style={styles.quizSubtitle} numberOfLines={1}>
              Comprueba tu destreza antes de e...
            </Text>
          </View>

          <View style={styles.quizBoltCircle}>
            <MaterialCommunityIcons name="flash" size={20} color="#FFFFFF" />
          </View>
        </Pressable>

        {/* Sección: Tu Ruta de Aprendizaje */}
        <View style={styles.learningRouteSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Tu ruta de aprendizaje</Text>
              <Text style={styles.sectionSubtitle}>Especialización en Cosecha y Calidad 2025</Text>
            </View>
            <Pressable onPress={handleViewAllModules}>
              <Text style={styles.viewAllText}>Ver todo &gt;</Text>
            </Pressable>
          </View>

          {/* Timeline de Módulos */}
          <View style={styles.timelineContainer}>
            {/* Módulo 1: Completado */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineMarkerContainer}>
                <View style={[styles.timelineNode, { backgroundColor: '#135832' }]}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
                <View style={styles.timelineLine} />
              </View>

              <View style={[styles.moduleCard, Shadows.sm]}>
                <View style={styles.moduleCardHeader}>
                  <Text style={styles.moduleCardNumber}>MÓDULO 1</Text>
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle-outline" size={14} color="#1D7A46" />
                    <Text style={styles.completedBadgeText}>Completado</Text>
                  </View>
                </View>

                <Text style={styles.moduleCardTitle}>Conoce la uva de mesa de exportación</Text>
                <Text style={styles.moduleCardDesc}>
                  Morfología, calibración requerida y parámetros de sanidad para Red Globe y Thompson.
                </Text>

                <View style={styles.moduleCardFooter}>
                  <Text style={styles.moduleCardStats}>✓ 4/4 lecciones aprobadas</Text>
                  <Pressable
                    style={styles.repassButton}
                    onPress={() => handleOpenLesson('lesson-1-1')}
                  >
                    <Text style={styles.repassText}>Repasar ↻</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Módulo 2: En Progreso */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineMarkerContainer}>
                <View style={[styles.timelineNode, { backgroundColor: Colors.accentGold }]}>
                  <Ionicons name="play" size={12} color="#0E3A28" />
                </View>
                <View style={styles.timelineLine} />
              </View>

              <View style={[styles.moduleCard, styles.moduleCardActive, Shadows.md]}>
                <View style={styles.moduleCardHeader}>
                  <Text style={styles.moduleCardNumber}>MÓDULO 2 •</Text>
                  <View style={styles.inProgressBadge}>
                    <Text style={styles.inProgressBadgeText}>En progreso</Text>
                  </View>
                </View>

                <Text style={styles.moduleCardTitle}>Identifica el punto correcto de cosecha</Text>
                <Text style={styles.moduleCardDesc}>
                  Determinación de coloración adecuada, medición de grados Brix y apariencia del raquis.
                </Text>

                <View style={styles.moduleProgressBarContainer}>
                  <View style={styles.moduleProgressBarHeader}>
                    <Text style={styles.moduleProgressText}>2 de 3 lecciones completadas</Text>
                    <Text style={styles.moduleProgressPercent}>66%</Text>
                  </View>
                  <View style={styles.moduleProgressBarTrack}>
                    <View style={[styles.moduleProgressBarFill, { width: '66%' }]} />
                  </View>
                </View>

                <View style={styles.moduleCardFooterActive}>
                  <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={15} color={Colors.textSecondary} />
                    <Text style={styles.timeText}>Siguiente: 3 min</Text>
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.resumeButton,
                      pressed && { opacity: 0.9 },
                    ]}
                    onPress={() => handleOpenLesson('lesson-2-2')}
                  >
                    <Text style={styles.resumeButtonText}>Reanudar</Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Módulo 3: Disponible */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineMarkerContainer}>
                <View style={[styles.timelineNode, { backgroundColor: '#C8D6CE' }]}>
                  <Ionicons name="lock-open-outline" size={12} color="#1B4D36" />
                </View>
                <View style={styles.timelineLine} />
              </View>

              <View style={[styles.moduleCard, Shadows.sm]}>
                <View style={styles.moduleCardHeader}>
                  <Text style={styles.moduleCardNumber}>MÓDULO 3</Text>
                  <View style={styles.availableBadge}>
                    <Ionicons name="lock-open-outline" size={12} color="#55685B" />
                    <Text style={styles.availableBadgeText}>Disponible</Text>
                  </View>
                </View>

                <Text style={styles.moduleCardTitle}>Técnica de corte y uso de tijeras curvas</Text>
                <Text style={styles.moduleCardDesc}>
                  Uso ergonómico de tijeras de punta roma, ángulo a 45 grados y protección de bayas periféricas.
                </Text>

                <View style={styles.moduleCardFooter}>
                  <Text style={styles.moduleCardStats}>📖 3 lecciones prácticas</Text>
                  <Text style={styles.pointsBadgeText}>⭐ +60 pts</Text>
                </View>
              </View>
            </View>

            {/* Módulo 4: Próximamente */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineMarkerContainer}>
                <View style={[styles.timelineNode, { backgroundColor: '#E2EBE4' }]}>
                  <Ionicons name="lock-closed" size={12} color="#84968A" />
                </View>
              </View>

              <View style={[styles.moduleCard, { opacity: 0.8 }, Shadows.sm]}>
                <View style={styles.moduleCardHeader}>
                  <Text style={styles.moduleCardNumber}>MÓDULO 4</Text>
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedBadgeText}>Próximamente</Text>
                  </View>
                </View>

                <Text style={styles.moduleCardTitle}>Manipulación cuidadosa del racimo y empaque primario</Text>
                <Text style={styles.moduleCardDesc}>
                  Sujeción por el pedúnculo sin tocar la pruina y disposición en bandeja de campo.
                </Text>

                <View style={styles.moduleCardFooter}>
                  <Text style={styles.unlockInfoText}>🔒 Se desbloquea con Módulo 3</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Card Consejo del Supervisor */}
        <View style={[styles.supervisorCard, Shadows.md]}>
          <Image
            source={SUPERVISOR_TIP.avatarUri}
            style={styles.supervisorAvatar}
          />
          <View style={styles.supervisorContent}>
            <View style={styles.supervisorHeader}>
              <Text style={styles.supervisorName}>{SUPERVISOR_TIP.name}</Text>
              <Text style={styles.supervisorRole}>{SUPERVISOR_TIP.role}</Text>
            </View>
            <Text style={styles.supervisorQuote}>{SUPERVISOR_TIP.quote}</Text>
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
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  farmPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF3EC',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#D4E7D9',
  },
  farmDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1D7A46',
  },
  farmText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D7A46',
    letterSpacing: 0.3,
  },
  nextLessonBanner: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextLessonBadge: {
    backgroundColor: Colors.accentGold,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  nextLessonBadgeText: {
    color: '#3A2800',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  varietyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  varietyText: {
    color: '#D8E8DC',
    fontSize: 12,
    fontWeight: '600',
  },
  grapeThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  lessonMetaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: Colors.accentGold,
    borderRadius: Radius.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: Colors.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  statUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statStreakSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  statPointsSub: {
    fontSize: 11,
    color: '#7E22CE',
    fontWeight: '600',
    marginTop: 2,
  },
  statRouteSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  progressCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  progressPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  tractorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2EBE4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accentAmberDark,
    borderRadius: 4,
  },
  quizCard: {
    backgroundColor: '#D7F5DE',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: '#BFE7C9',
  },
  quizClockCircle: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizContent: {
    flex: 1,
  },
  quizTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  quizBadge: {
    backgroundColor: '#0E3A28',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quizBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  quizSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  quizBoltCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learningRouteSection: {
    gap: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  timelineContainer: {
    gap: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timelineMarkerContainer: {
    alignItems: 'center',
    width: 24,
  },
  timelineNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E7DE',
    marginVertical: 4,
  },
  moduleCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
  },
  moduleCardActive: {
    borderColor: '#C6DEC9',
    backgroundColor: '#FBFCFA',
  },
  moduleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleCardNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D7A46',
  },
  inProgressBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  inProgressBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D7A46',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F3ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  availableBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#55685B',
  },
  lockedBadge: {
    backgroundColor: '#F0F3ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  lockedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#84968A',
  },
  moduleCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  moduleCardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  moduleCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  moduleCardFooterActive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  moduleCardStats: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  repassButton: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  repassText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  moduleProgressBarContainer: {
    backgroundColor: '#EAF3EC',
    borderRadius: Radius.md,
    padding: 8,
    gap: 4,
    marginVertical: 4,
  },
  moduleProgressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moduleProgressText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  moduleProgressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  moduleProgressBarTrack: {
    height: 5,
    backgroundColor: '#D1E3D5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  moduleProgressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  resumeButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  unlockInfoText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  supervisorCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  supervisorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#D4E7D9',
  },
  supervisorContent: {
    flex: 1,
  },
  supervisorHeader: {
    marginBottom: 4,
  },
  supervisorName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  supervisorRole: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  supervisorQuote: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
