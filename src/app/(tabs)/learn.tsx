import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { LESSONS_BY_MODULE_ID } from '@/constants/mockData';
import { dataService } from '@/services/dataService';
import { ModuleItem, UserStats } from '@/types';
import PuraFruitHeaderLogo from '@/components/PuraFruitHeaderLogo';

type CategoryFilter = 'all' | 'fundamentals' | 'cutting' | 'packaging';

export default function LearnScreen() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  const loadModules = useCallback(async () => {
    try {
      const [list, userStats] = await Promise.all([
        dataService.getModules(),
        dataService.getUserStats(),
      ]);
      setModules(list);
      setStats(userStats);
    } catch (e) {
      console.warn('Error loading modules:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadModules();
    }, [loadModules])
  );

  const filteredModules = modules.filter((m) => {
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  const handleOpenLesson = (moduleId: string) => {
    const lesson = LESSONS_BY_MODULE_ID[moduleId];
    router.push(`/lesson/${lesson.id}` as any);
  };

  const progressPercent = stats?.routeProgressPercent ?? 45;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <PuraFruitHeaderLogo size="md" title="Aprender" />
        </View>

        {/* Card Progreso Global */}
        <View style={[styles.globalProgressCard, Shadows.sm]}>
          <View style={styles.globalProgressRow}>
            <View style={styles.progressCircleContainer}>
              <MaterialCommunityIcons name="trophy-award" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.progressTextCol}>
              <Text style={styles.globalProgressLabel}>PROGRESO GLOBAL</Text>
              <Text style={styles.globalProgressTitle}>Ruta de Certificación</Text>
            </View>
            <View style={styles.globalProgressStats}>
              <Text style={styles.globalProgressPercent}>{progressPercent}%</Text>
              <Text style={styles.globalProgressModules}>
                {stats?.routeLessonsText ?? '9/20 lecc.'}
              </Text>
            </View>
          </View>

          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Sección Header & Categorías */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Módulos de Cosecha</Text>
            <View style={styles.seasonPill}>
              <Text style={styles.seasonPillText}>Temporada 2024</Text>
            </View>
          </View>

          {/* Filtros */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            <Pressable
              style={[
                styles.filterPill,
                selectedCategory === 'all' && styles.filterPillActive,
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === 'all' && styles.filterTextActive,
                ]}
              >
                Todos (5)
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterPill,
                selectedCategory === 'fundamentals' && styles.filterPillActive,
              ]}
              onPress={() => setSelectedCategory('fundamentals')}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === 'fundamentals' && styles.filterTextActive,
                ]}
              >
                Fundamentos
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterPill,
                selectedCategory === 'cutting' && styles.filterPillActive,
              ]}
              onPress={() => setSelectedCategory('cutting')}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === 'cutting' && styles.filterTextActive,
                ]}
              >
                Técnicas de corte
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterPill,
                selectedCategory === 'packaging' && styles.filterPillActive,
              ]}
              onPress={() => setSelectedCategory('packaging')}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === 'packaging' && styles.filterTextActive,
                ]}
              >
                Empaque
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Lista de Módulos */}
        <View style={styles.modulesList}>
          {filteredModules.map((item) => (
            <View key={item.id} style={[styles.moduleItemCard, Shadows.md]}>
              {/* Cover Image con Badges y Metadata */}
              <View style={styles.cardImageContainer}>
                <Image
                  source={item.imageUri}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />

                {/* Badge Superior Derecho según Estado */}
                <View style={styles.statusBadgeTopRight}>
                  {item.status === 'completed' && (
                    <View style={styles.completedStatusBadge}>
                      <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" />
                      <Text style={styles.statusBadgeText}>Completado</Text>
                    </View>
                  )}
                  {item.status === 'in_progress' && (
                    <View style={styles.inProgressStatusBadge}>
                      <Ionicons name="play-circle" size={13} color="#3A2800" />
                      <Text style={[styles.statusBadgeText, { color: '#3A2800' }]}>
                        En progreso
                      </Text>
                    </View>
                  )}
                  {item.status === 'available' && (
                    <View style={styles.availableStatusBadge}>
                      <Ionicons name="lock-open-outline" size={13} color="#FFFFFF" />
                      <Text style={styles.statusBadgeText}>Disponible</Text>
                    </View>
                  )}
                </View>

                {/* Metadata en la base de la imagen */}
                <View style={styles.imageBottomMeta}>
                  <Text style={styles.imageMetaModuleText}>Módulo {item.number}</Text>
                  <View style={styles.imageMetaDivider} />
                  <Ionicons name="time-outline" size={13} color="#FFFFFF" />
                  <Text style={styles.imageMetaText}>
                    {item.lessonsText} • {item.durationText}
                  </Text>
                </View>
              </View>

              {/* Contenido de la Tarjeta */}
              <View style={styles.cardBody}>
                {item.highlightTag && (
                  <View style={styles.tagRow}>
                    <View style={styles.keyTagPill}>
                      <Text style={styles.keyTagText}>{item.highlightTag}</Text>
                    </View>
                    <Text style={styles.recommendedText}>Recomendado hoy</Text>
                  </View>
                )}

                <Text style={styles.moduleItemTitle}>{item.title}</Text>
                <Text style={styles.moduleItemDescription}>{item.description}</Text>

                {/* Barra de progreso si está en progreso */}
                {item.status === 'in_progress' && (
                  <View style={styles.inProgressProgressBox}>
                    <View style={styles.inProgressHeaderRow}>
                      <Text style={styles.inProgressLabel}>{item.progressText}</Text>
                      <Text style={styles.inProgressPercent}>{item.progressPercent}%</Text>
                    </View>
                    <View style={styles.moduleProgressBarTrack}>
                      <View
                        style={[
                          styles.moduleProgressBarFill,
                          { width: `${item.progressPercent ?? 0}%` },
                        ]}
                      />
                    </View>
                  </View>
                )}

                {/* Footer según Estado */}
                {item.status === 'completed' && (
                  <View style={styles.completedFooterPill}>
                    <Text style={styles.completedScoreText}>Calificación: 100%</Text>
                    <Pressable
                      style={styles.repassLink}
                      onPress={() => handleOpenLesson(item.id)}
                    >
                      <Text style={styles.repassLinkText}>Repasar &gt;</Text>
                    </Pressable>
                  </View>
                )}

                {item.status === 'in_progress' && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButtonPrimary,
                      pressed && { opacity: 0.9 },
                    ]}
                    onPress={() => handleOpenLesson(item.id)}
                  >
                    <Text style={styles.actionButtonText}>Continuar lección</Text>
                    <Ionicons name="play" size={14} color="#FFFFFF" />
                  </Pressable>
                )}

                {item.status === 'available' && item.number === 3 && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButtonPrimary,
                      pressed && { opacity: 0.9 },
                    ]}
                    onPress={() => handleOpenLesson(item.id)}
                  >
                    <Ionicons name="play-circle-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Empezar módulo</Text>
                  </Pressable>
                )}

                {item.status === 'available' && item.number > 3 && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButtonSecondary,
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => handleOpenLesson(item.id)}
                  >
                    <Text style={styles.actionButtonSecondaryText}>Ver contenido</Text>
                    <Ionicons name="arrow-forward" size={15} color={Colors.textPrimary} />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Card Inferior: Certificación GlobalGAP & SENASA */}
        <View style={styles.standardsCard}>
          <View style={styles.standardsIconCircle}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#1D7A46" />
          </View>
          <View style={styles.standardsContent}>
            <Text style={styles.standardsTitle}>
              Contenido técnico avalado para estándares de exportación agrícola
            </Text>
            <Text style={styles.standardsSubtitle}>
              Certificación SENASA & GlobalG.A.P.
            </Text>
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
  globalProgressCard: {
    backgroundColor: '#EAF3EC',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: '#D4E7D9',
  },
  globalProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressCircleContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextCol: {
    flex: 1,
  },
  globalProgressLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  globalProgressTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  globalProgressStats: {
    alignItems: 'flex-end',
  },
  globalProgressPercent: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  globalProgressModules: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#D1E3D5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  sectionHeader: {
    gap: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  seasonPill: {
    backgroundColor: '#EDF1EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  seasonPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filtersScroll: {
    gap: Spacing.sm,
  },
  filterPill: {
    backgroundColor: '#EDF1EB',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modulesList: {
    gap: Spacing.lg,
  },
  moduleItemCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardImageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  cardImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: 140,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  statusBadgeTopRight: {
    alignSelf: 'flex-end',
  },
  completedStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1B5E20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  inProgressStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentGold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  availableStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  imageBottomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imageMetaModuleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  imageMetaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  imageMetaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  keyTagPill: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  keyTagText: {
    color: '#7E22CE',
    fontSize: 11,
    fontWeight: '800',
  },
  recommendedText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  moduleItemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  moduleItemDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  inProgressProgressBox: {
    backgroundColor: '#EDF4EE',
    borderRadius: Radius.sm,
    padding: 8,
    gap: 4,
    marginTop: 2,
  },
  inProgressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inProgressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  inProgressPercent: {
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
    backgroundColor: Colors.accentAmberDark,
    borderRadius: 3,
  },
  completedFooterPill: {
    backgroundColor: '#F4F7F2',
    borderRadius: Radius.md,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  completedScoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  repassLink: {
    paddingVertical: 2,
  },
  repassLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  actionButtonSecondary: {
    backgroundColor: '#EDF1EB',
    borderRadius: Radius.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  actionButtonSecondaryText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  standardsCard: {
    backgroundColor: '#EDF4EE',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  standardsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D7F5DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  standardsContent: {
    flex: 1,
  },
  standardsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 16,
  },
  standardsSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
