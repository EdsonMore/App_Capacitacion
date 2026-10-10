import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Pressable,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { CURRENT_LESSON } from '@/constants/mockData';
import { dataService } from '@/services/dataService';

export default function LessonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x');
  const [isMuted, setIsMuted] = useState(false);

  const toggleSpeed = () => {
    if (playbackSpeed === '1.0x') setPlaybackSpeed('1.25x');
    else if (playbackSpeed === '1.25x') setPlaybackSpeed('1.5x');
    else setPlaybackSpeed('1.0x');
  };

  const handleFinishLesson = async () => {
    await dataService.completeLesson(String(id || CURRENT_LESSON.id));
    router.push(`/quiz/${CURRENT_LESSON.quizId}` as any);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Fijo */}
      <View style={styles.topHeader}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.headerTitleBox}>
          <View style={styles.headerIconCircle}>
            <MaterialCommunityIcons name="fruit-grapes" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Sesión De Aprendizaje</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subheader: Módulo y Puntos */}
        <View style={styles.moduleMetaRow}>
          <View style={styles.moduleNumberPill}>
            <View style={styles.numberCircle}>
              <Text style={styles.numberCircleText}>{CURRENT_LESSON.lessonNumber}</Text>
            </View>
            <Text style={styles.moduleMetaText}>
              {CURRENT_LESSON.moduleTitle} • Lección {CURRENT_LESSON.lessonNumber} de {CURRENT_LESSON.totalLessons}
            </Text>
          </View>

          <View style={styles.pointsBadge}>
            <Ionicons name="flash" size={14} color="#D97706" />
            <Text style={styles.pointsBadgeText}>+{CURRENT_LESSON.pointsReward} pts</Text>
          </View>
        </View>

        {/* Reproductor de Video Realista en Viñedo */}
        <View style={[styles.videoPlayerContainer, Shadows.lg]}>
          <ImageBackground
            source={require('../../../assets/images/uvapro/lesson_video.jpg')}
            style={styles.videoBackground}
            resizeMode="cover"
          >
            {/* Tag Superior: Demostración en Campo */}
            <View style={styles.fieldDemoTag}>
              <View style={styles.redDot} />
              <Text style={styles.fieldDemoText}>DEMOSTRACIÓN EN CAMPO</Text>
            </View>

            {/* Botón Central de Play/Pause */}
            <Pressable
              style={({ pressed }) => [
                styles.centerPlayButton,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={34}
                color="#FFFFFF"
                style={!isPlaying ? { marginLeft: 4 } : undefined}
              />
            </Pressable>

            {/* Controles Inferiores de Reproducción */}
            <View style={styles.videoControlsOverlay}>
              {/* Barra de Tiempo Transcurrido */}
              <View style={styles.videoTimelineRow}>
                <View style={styles.videoProgressTrack}>
                  <View style={[styles.videoProgressFill, { width: isPlaying ? '85%' : '75%' }]} />
                </View>
                <Text style={styles.videoTimeCounter}>
                  {isPlaying ? '02:35' : CURRENT_LESSON.videoProgressText} / {CURRENT_LESSON.videoDurationText}
                </Text>
              </View>

              {/* Barra de Botones Multimedia */}
              <View style={styles.controlsButtonRow}>
                <Pressable
                  style={styles.controlIconBtn}
                  onPress={() => setIsPlaying(!isPlaying)}
                >
                  <MaterialIcons name="replay-10" size={22} color="#FFFFFF" />
                </Pressable>

                <Pressable style={styles.speedButton} onPress={toggleSpeed}>
                  <Text style={styles.speedButtonText}>{playbackSpeed}</Text>
                </Pressable>

                <View style={{ flex: 1 }} />

                <Pressable style={styles.controlIconBtn}>
                  <MaterialCommunityIcons name="subtitles-outline" size={20} color="#FFFFFF" />
                </Pressable>

                <Pressable
                  style={styles.controlIconBtn}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  <Ionicons
                    name={isMuted ? 'volume-mute' : 'volume-high'}
                    size={20}
                    color="#FFFFFF"
                  />
                </Pressable>

                <Pressable style={styles.controlIconBtn}>
                  <MaterialCommunityIcons name="fullscreen" size={24} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Tags de Duración y Técnica */}
        <View style={styles.tagsRow}>
          <View style={styles.durationPill}>
            <Ionicons name="time-outline" size={14} color="#1D7A46" />
            <Text style={styles.durationPillText}>3 min de video</Text>
          </View>
          <View style={styles.techniquePill}>
            <Text style={styles.techniquePillText}>{CURRENT_LESSON.tag}</Text>
          </View>
        </View>

        {/* Título y Explicación Técnica */}
        <Text style={styles.lessonTitle}>{CURRENT_LESSON.title}</Text>
        <Text style={styles.lessonSubtitle}>{CURRENT_LESSON.subtitle}</Text>

        {/* Card: PUNTOS CLAVE / Recuerda esto */}
        <View style={[styles.keyPointsCard, Shadows.md]}>
          <View style={styles.keyPointsHeader}>
            <View style={styles.bulbCircle}>
              <MaterialCommunityIcons name="lightbulb-on" size={18} color="#1D7A46" />
            </View>
            <Text style={styles.keyPointsTitle}>Recuerda esto</Text>
            <View style={styles.pointsTag}>
              <Text style={styles.pointsTagText}>PUNTOS CLAVE</Text>
            </View>
          </View>

          {/* Item 1 */}
          <View style={styles.keyPointItem}>
            <View style={styles.checkIconCircle}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
            <View style={styles.keyPointTextContainer}>
              <Text style={styles.keyPointHeading}>Pedúnculo leñoso</Text>
              <Text style={styles.keyPointBody}>
                Sujeta siempre desde el pedúnculo leñoso,{' '}
                <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>
                  nunca aprietes las bayas
                </Text>{' '}
                con los dedos.
              </Text>
            </View>
          </View>

          {/* Item 2 */}
          <View style={styles.keyPointItem}>
            <View style={styles.checkIconCircle}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
            <View style={styles.keyPointTextContainer}>
              <Text style={styles.keyPointHeading}>Protección de Pruina</Text>
              <Text style={styles.keyPointBody}>
                Conserva la pruina (el polvo blanquecino natural que protege la uva y certifica
                frescura).
              </Text>
            </View>
          </View>

          {/* Item 3 (Alerta Crítica) */}
          <View style={styles.criticalAlertItem}>
            <View style={styles.alertIconCircle}>
              <MaterialCommunityIcons name="alert" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.keyPointTextContainer}>
              <Text style={styles.criticalHeading}>Cuidado Crítico</Text>
              <Text style={styles.criticalBody}>
                Usa tijeras desinfectadas y afiladas para evitar desgarros en el sarmiento o el
                racimo.
              </Text>
            </View>
          </View>
        </View>

        {/* Banner: Test evaluatorio listo */}
        <Pressable
          style={({ pressed }) => [
            styles.quizBanner,
            pressed && { opacity: 0.9 },
            Shadows.sm,
          ]}
          onPress={handleFinishLesson}
        >
          <View style={styles.quizBannerIcon}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.quizBannerContent}>
            <Text style={styles.quizBannerTitle}>Test evaluatorio listo</Text>
            <Text style={styles.quizBannerSubtitle}>
              {CURRENT_LESSON.quizQuestionCount} preguntas rápidas sobre agarre
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
        </Pressable>
      </ScrollView>

      {/* Botón Inferior Fijo de Acción */}
      <View style={[styles.bottomBar, Shadows.lg]}>
        <Pressable
          style={({ pressed }) => [
            styles.finishLessonBtn,
            pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          ]}
          onPress={handleFinishLesson}
        >
          <Text style={styles.finishLessonText}>Terminé la lección → Ir al test de 2 min</Text>
          <MaterialCommunityIcons name="clipboard-check-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 48,
    paddingBottom: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: 4,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  moduleMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleNumberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberCircleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  moduleMetaText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  videoPlayerContainer: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    height: 220,
    backgroundColor: '#000',
  },
  videoBackground: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fieldDemoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    margin: Spacing.md,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  fieldDemoText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  centerPlayButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  videoControlsOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: 6,
  },
  videoTimelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  videoProgressFill: {
    height: '100%',
    backgroundColor: Colors.accentGold,
  },
  videoTimeCounter: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  controlsButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  controlIconBtn: {
    padding: 4,
  },
  speedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  speedButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#D7F5DE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  durationPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D7A46',
  },
  techniquePill: {
    backgroundColor: '#EDF1EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  techniquePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  lessonSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  keyPointsCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  keyPointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulbCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D7F5DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyPointsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
  },
  pointsTag: {
    backgroundColor: '#EDF1EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  pointsTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  keyPointItem: {
    backgroundColor: '#F8FAF7',
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  checkIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  keyPointTextContainer: {
    flex: 1,
    gap: 2,
  },
  keyPointHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  keyPointBody: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  criticalAlertItem: {
    backgroundColor: '#FEF2F2',
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  alertIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  criticalHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  criticalBody: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 16,
  },
  quizBanner: {
    backgroundColor: '#EDF4EE',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  quizBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: '#5B21B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizBannerContent: {
    flex: 1,
  },
  quizBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  quizBannerSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  finishLessonBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  finishLessonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
