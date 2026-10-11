import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import PuraFruitHeaderLogo from '@/components/PuraFruitHeaderLogo';
import { dataService } from '@/services/dataService';
import { ModuleItem, UserStats } from '@/types';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 640;

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [fetchedModules, fetchedStats] = await Promise.all([
        dataService.getModules(),
        dataService.getUserStats(),
      ]);
      setModules(fetchedModules);
      setUserStats(fetchedStats);
    } catch (e) {
      console.warn('Error loading welcome data:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const completedCount = modules.filter(m => m.status === 'completed').length;
  const overallPercent = modules.length
    ? Math.round((completedCount / modules.length) * 100)
    : (userStats?.overallHarvestProgressPercent ?? 35);

  const handleStart = () => {
    router.push('/learn');
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={[styles.headerContainer, !isDesktop && styles.headerMobile]}>
        <View style={styles.headerInner}>
          <View style={styles.headerLogoContainer}>
            <PuraFruitHeaderLogo size={isDesktop ? "md" : "sm"} lightBackground={true} />
            {width >= 420 && (
              <Text style={styles.headerSubtitle}>ACADEMIA AGRÍCOLA</Text>
            )}
          </View>
          <Pressable style={styles.headerButton} onPress={handleStart}>
            <Ionicons name="school-outline" size={18} color="#FFFFFF" />
            <Text style={styles.headerButtonText}>Aprender</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop ? styles.containerDesktop : styles.containerMobile,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <ImageBackground
          source={require('../../assets/images/uvapro/hero.jpg')}
          style={[styles.hero, isDesktop ? styles.heroDesktop : styles.heroMobile]}
          imageStyle={styles.heroImageRadius}
        >
          <View style={styles.heroOverlay} />

          <View style={styles.heroInner}>
            {/* Top Pills */}
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadgePrimary}>
                <View style={styles.heroBadgeDot} />
                <Text style={styles.heroBadgeText}>CAPACITACIÓN DE EXPORTACIÓN</Text>
              </View>

              <View style={styles.heroTopRightPills}>
                <View style={styles.glassPill}>
                  <Ionicons name="time-outline" size={14} color="#FFF" />
                  <Text style={styles.glassPillText}>Turno Mañana: Lote 14-B</Text>
                </View>
                {isDesktop && (
                  <View style={styles.glassPill}>
                    <Ionicons name="cloud-offline-outline" size={14} color="#FFF" />
                    <Text style={styles.glassPillText}>Offline Sincronizado</Text>
                  </View>
                )}
                {isDesktop && (
                  <View style={styles.glassPill}>
                    <Ionicons name="sunny-outline" size={14} color="#FFF" />
                    <Text style={styles.glassPillText}>Piura 31°C</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Center Texts */}
            <View style={styles.heroCenter}>
              <Text style={[styles.heroTitle, isMobile && { fontSize: 26, lineHeight: 32 }]}>Aprende a cosechar mejor</Text>
              <Text style={[styles.heroSubtitle, isMobile && { fontSize: 14, lineHeight: 20 }]}>
                Pequeños aprendizajes. Grandes cosechas para el mundo.
              </Text>
            </View>

            {/* Bottom Row */}
            <View style={styles.heroBottomRow}>
              <View style={styles.heroBottomLeft}>
                <View style={styles.heroBottomItem}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#FFF" />
                  <Text style={styles.heroBottomText}>Protocolo GlobalG.A.P.</Text>
                </View>
                <View style={styles.heroBottomItem}>
                  <Ionicons name="time-outline" size={16} color="#FFF" />
                  <Text style={styles.heroBottomText}>Módulos de 3 Minutos</Text>
                </View>
              </View>
              {isDesktop && (
                <Text style={styles.heroBottomRightText}>
                  Campaña Uva Red Globe & Autumn Crisp 2025
                </Text>
              )}
            </View>
          </View>
        </ImageBackground>

        {/* QUICK ACTION BAR */}
        <View style={[styles.quickBar, Shadows.sm]}>
          <View style={styles.quickBarLeft}>
            <View style={styles.quickBarIconBox}>
              <MaterialCommunityIcons name="monitor-dashboard" size={24} color={Colors.primary} />
            </View>
            <View>
              <View style={styles.quickBarTitleRow}>
                <Text style={styles.quickBarTitle}>Módulos rápidos de 3 min</Text>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>100% LIBRE</Text>
                </View>
              </View>
              <Text style={styles.quickBarDesc}>
                Prácticos, visuales, en video comprimido y sin consumo de datos móviles.
              </Text>
            </View>
          </View>

          <View style={[styles.quickBarRight, !isDesktop && styles.quickBarRightMobile]}>
            <View style={styles.progressBlock}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Inducción Básica</Text>
                <Text style={styles.progressPercent}>{overallPercent}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${overallPercent}%` }]} />
              </View>
            </View>
            <Pressable style={styles.primaryButton} onPress={handleStart}>
              <Text style={styles.primaryButtonText}>Comenzar a aprender</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </Pressable>
          </View>
        </View>

        {/* UNIVERSAL BANNER CON IDENTIFICACIÓN POR DNI */}
        <View style={styles.universalBanner}>
          <MaterialCommunityIcons name="shield-check-outline" size={18} color={Colors.primary} />
          <Text style={styles.universalBannerText}>
            <Text style={styles.universalBannerBold}>
              {userStats?.dni ? `Trabajador DNI ${userStats.dni} activo:` : 'Acceso por DNI:'}
            </Text>{' '}
            {userStats?.dni
              ? 'Tu progreso está sincronizado con la base de datos de Pura Fruit.'
              : 'Sin contraseñas difíciles. Ingresa tu DNI para no perder tu avance si sales del sistema.'}
          </Text>
        </View>

        {/* MAIN COLUMNS */}
        <View style={[styles.mainColumns, isMobile && styles.mainColumnsMobile]}>
          
          {/* LEFT COLUMN: MODULOS */}
          <View style={[styles.leftColumn, isMobile && styles.leftColumnMobile]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionSubtitleText}>SECUENCIA FORMATIVA OFICIAL</Text>
                <Text style={styles.sectionTitle}>Módulos Recomendados</Text>
              </View>
              <View style={styles.pillGreenLight}>
                <Text style={styles.pillGreenLightText}>! 3 DISPONIBLES • PRIORIDAD DE CAMPAÑA</Text>
              </View>
            </View>

            {/* Card 1: Completado */}
            <View style={[styles.moduleCard, isMobile && styles.moduleCardMobile]}>
              <View style={[styles.moduleCardImageContainer, isMobile && styles.moduleCardImageContainerMobile]}>
                <Image source={require('../../assets/images/uvapro/module3_shears.jpg')} style={styles.moduleCardImage} />
                <View style={styles.moduleCardDuration}>
                  <Ionicons name="time-outline" size={12} color="#FFF" />
                  <Text style={styles.moduleCardDurationText}>3 min</Text>
                </View>
                <View style={styles.checkCircleAbsolute}>
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                </View>
              </View>
              <View style={styles.moduleCardContent}>
                <View style={[styles.moduleCardTop, isMobile && { flexWrap: 'wrap', gap: 6 }]}>
                  <Text style={styles.stepText}>PASO 1 • COMPLETADO</Text>
                  <View style={styles.pointsBadgeCompleted}>
                    <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
                    <Text style={styles.pointsBadgeCompletedText}>100% • +100 pts ganados</Text>
                  </View>
                </View>
                <Text style={styles.moduleCardTitle}>Cosecha Fina: Técnicas de corte de racimo</Text>
                <Text style={styles.moduleCardDesc}>Aprende a cortar por el pedúnculo sin tocar las bayas. Evita fricción y quiebre de cera natural (pruina) para preservar calidad de exportación.</Text>
                
                <View style={[styles.moduleCardBottom, isMobile && { flexWrap: 'wrap', gap: 8, marginTop: 12 }]}>
                  <View style={styles.moduleCardBottomLeft}>
                    <Ionicons name="cloud-offline-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.moduleCardBottomText}>Disponible sin conexión</Text>
                  </View>
                  <Pressable style={styles.secondaryButton} onPress={() => router.push('/lesson/lesson-1-1' as any)}>
                    <Text style={styles.secondaryButtonText}>Repasar módulo</Text>
                    <Ionicons name="refresh" size={16} color={Colors.textSecondary} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Card 2: En curso */}
            <View style={[styles.moduleCard, styles.moduleCardActive, isMobile && styles.moduleCardMobile]}>
              <View style={[styles.moduleCardImageContainer, isMobile && styles.moduleCardImageContainerMobile]}>
                <Image source={require('../../assets/images/uvapro/lesson_video.jpg')} style={styles.moduleCardImage} />
                <View style={styles.moduleCardDuration}>
                  <Ionicons name="time-outline" size={12} color="#FFF" />
                  <Text style={styles.moduleCardDurationText}>3 min</Text>
                </View>
                <View style={styles.enCursoBadgeAbsolute}>
                  <Text style={styles.enCursoBadgeText}>EN CURSO</Text>
                </View>
              </View>
              <View style={styles.moduleCardContent}>
                <View style={[styles.moduleCardTop, isMobile && { flexWrap: 'wrap', gap: 6 }]}>
                  <View style={styles.stepBadgeActive}>
                    <Text style={styles.stepBadgeActiveText}>PASO 2 • SIGUIENTE LECCIÓN</Text>
                  </View>
                  <View style={styles.pointsBadgePending}>
                    <Ionicons name="star-outline" size={14} color={Colors.primary} />
                    <Text style={styles.pointsBadgePendingText}>+150 PTS AL COMPLETAR</Text>
                  </View>
                </View>
                <Text style={styles.moduleCardTitle}>Calidad: Selección y calibrado para exportación</Text>
                <Text style={styles.moduleCardDesc}>Medición de bayas Jumbo (≥22mm) y Extra Large. Detección inmediata de bayas blandas, rajadas o con restos florales antes del embalaje.</Text>
                
                <View style={[styles.moduleCardBottom, isMobile && { flexWrap: 'wrap', gap: 8, marginTop: 12 }]}>
                  <View style={styles.moduleCardBottomLeft}>
                    <Ionicons name="play-circle-outline" size={16} color={Colors.textPrimary} />
                    <Text style={[styles.moduleCardBottomText, { color: Colors.textPrimary }]}>Video práctico 2:50m</Text>
                  </View>
                  <Pressable style={styles.primaryButtonSmall} onPress={() => router.push('/lesson/lesson-2-2' as any)}>
                    <Text style={styles.primaryButtonTextSmall}>Continuar</Text>
                    <Ionicons name="play" size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Card 3: Recomendado */}
            <View style={[styles.moduleCard, isMobile && styles.moduleCardMobile]}>
              <View style={[styles.moduleCardImageContainer, isMobile && styles.moduleCardImageContainerMobile]}>
                <Image source={require('../../assets/images/uvapro/hero.jpg')} style={styles.moduleCardImage} />
                <View style={styles.moduleCardDuration}>
                  <Ionicons name="time-outline" size={12} color="#FFF" />
                  <Text style={styles.moduleCardDurationText}>3 min</Text>
                </View>
              </View>
              <View style={styles.moduleCardContent}>
                <View style={[styles.moduleCardTop, isMobile && { flexWrap: 'wrap', gap: 6 }]}>
                  <Text style={styles.stepText}>PASO 3 • RECOMENDADO</Text>
                  <View style={styles.pointsBadgeNeutral}>
                    <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.pointsBadgeNeutralText}>+150 PTS PENDIENTES</Text>
                  </View>
                </View>
                <Text style={styles.moduleCardTitle}>Sanidad: Cuidado fitosanitario básico en parrón</Text>
                <Text style={styles.moduleCardDesc}>Identificación visual de oídio, trips y ácaros. Qué hacer al detectar un foco y cómo marcar el sarmiento sin contaminar lotes vecinos.</Text>
                
                <View style={[styles.moduleCardBottom, isMobile && { flexWrap: 'wrap', gap: 8, marginTop: 12 }]}>
                  <View style={styles.moduleCardBottomLeft}>
                    <Ionicons name="download-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.moduleCardBottomText}>4.2 MB precargado</Text>
                  </View>
                  <Pressable style={styles.secondaryButton} onPress={() => router.push('/lesson/lesson-3-1' as any)}>
                    <Text style={styles.secondaryButtonText}>Iniciar lección</Text>
                    <Ionicons name="arrow-forward" size={16} color={Colors.textSecondary} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN: PUNTOS */}
          <View style={[styles.rightColumn, isMobile && styles.rightColumnMobile]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Puntos Acumulados</Text>
              <View style={styles.pillGreenLight}>
                <Text style={styles.pillGreenLightText}>SESIÓN ACTIVA</Text>
              </View>
            </View>

            {/* Points Widget Box */}
            <View style={styles.pointsWidget}>
              <View style={styles.pointsWidgetTop}>
                <View style={styles.pointsIconBox}>
                  <Ionicons name="trophy-outline" size={24} color="#FFF" />
                </View>
                <View style={styles.pointsWidgetTexts}>
                  <Text style={styles.pointsWidgetLabel}>PUNTOS DE ESTA SESIÓN</Text>
                  <View style={styles.pointsRow}>
                    <Text style={styles.pointsBig}>{userStats?.points ?? 100}</Text>
                    <Text style={styles.pointsSmall}> / 600 pts posibles</Text>
                  </View>
                </View>

                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>EN VIVO</Text>
                </View>
              </View>

              <View style={styles.pointsDivider} />

              <View style={styles.pointsWidgetBottom}>
                <Text style={styles.pointsNextGoal}>Próxima meta de sesión (Insignia Cosechador)</Text>
                <Text style={styles.pointsNextGoalPoints}>250 pts</Text>
              </View>

              <View style={styles.pointsMessage}>
                <Text style={styles.pointsMessageText}>
                  ¡Buen inicio! Completa la lección de selección y calibrado para sumar 150 puntos adicionales hoy.
                </Text>
              </View>
            </View>

            {/* Points List */}
            <View style={styles.pointsListCard}>
              <View style={styles.pointsListHeader}>
                <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
                  <MaterialCommunityIcons name="format-list-checks" size={18} color={Colors.textPrimary} />
                  <Text style={styles.pointsListTitle}>Puntos por Módulo</Text>
                </View>
                <Text style={styles.pointsListSubtitle}>PLAN LIBRE</Text>
              </View>

              <View style={styles.pointsListItem}>
                <View style={styles.pointsListIconBoxCompleted}>
                  <Ionicons name="checkmark" size={14} color={Colors.success} />
                </View>
                <View style={styles.pointsListItemTexts}>
                  <Text style={styles.pointsListItemTitle}>Paso 1: Corte de racimo</Text>
                  <Text style={styles.pointsListItemSub}>Completado con éxito</Text>
                </View>
                <Text style={[styles.pointsListItemScore, { color: Colors.success }]}>+100 pts</Text>
              </View>
              <View style={styles.listDivider} />

              <View style={styles.pointsListItem}>
                <View style={styles.pointsListIconBoxActive}>
                  <Ionicons name="play" size={12} color={Colors.primary} />
                </View>
                <View style={styles.pointsListItemTexts}>
                  <Text style={styles.pointsListItemTitle}>Paso 2: Selección y calibrado</Text>
                  <Text style={styles.pointsListItemSub}>En curso • Próxima recompensa</Text>
                </View>
                <Text style={[styles.pointsListItemScore, { color: Colors.textPrimary }]}>+150 pts</Text>
              </View>
              <View style={styles.listDivider} />

              <View style={styles.pointsListItem}>
                <View style={styles.pointsListIconBoxNeutral}>
                  <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                </View>
                <View style={styles.pointsListItemTexts}>
                  <Text style={styles.pointsListItemTitle}>Paso 3: Sanidad y plagas</Text>
                  <Text style={styles.pointsListItemSub}>Pendiente de inicio</Text>
                </View>
                <Text style={styles.pointsListItemScoreNeutral}>+150 pts</Text>
              </View>
              <View style={styles.listDivider} />

              <View style={styles.pointsListItem}>
                <View style={styles.pointsListIconBoxNeutral}>
                  <MaterialCommunityIcons name="clipboard-check-outline" size={14} color={Colors.textMuted} />
                </View>
                <View style={styles.pointsListItemTexts}>
                  <Text style={styles.pointsListItemTitle}>Evaluación rápida</Text>
                  <Text style={styles.pointsListItemSub}>Bonus de campo</Text>
                </View>
                <Text style={styles.pointsListItemScoreNeutral}>+200 pts</Text>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color={Colors.textMuted} />
                <Text style={styles.infoBoxText}>
                  No necesitas registrarte. Tus puntos se suman automáticamente en este dispositivo conforme avances en los módulos de capacitación.
                </Text>
              </View>
            </View>

          </View>
        </View>

        {/* BOTTOM COURSES */}
        <Text style={[styles.sectionSubtitleText, { marginTop: Spacing.xl, marginBottom: Spacing.sm }]}>CURSOS DE SOPORTE EN TERRENO</Text>
        <View style={[styles.supportCardsRow, isMobile && { flexDirection: 'column' }]}>
          <View style={styles.supportCard}>
            <View style={styles.supportIconBox}>
              <MaterialCommunityIcons name="water-outline" size={24} color={Colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.supportLabel}>INOCUIDAD</Text>
              <Text style={styles.supportTitle}>Higiene en el parrón</Text>
              <Text style={styles.supportDesc}>Lavado de manos, desinfección de navajas y protocolo de guantes limpios.</Text>
            </View>
          </View>

          <View style={styles.supportCard}>
            <View style={styles.supportIconBox}>
              <MaterialCommunityIcons name="content-cut" size={24} color={Colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.supportLabel}>ERGONOMÍA & SEGURIDAD</Text>
              <Text style={styles.supportTitle}>Manejo seguro de tijeras y jabas</Text>
              <Text style={styles.supportDesc}>Técnicas de levantamiento para evitar fatiga lumbar en jornadas de estiba.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Ionicons name="leaf" size={16} color={Colors.primary} />
          <Text style={styles.footerTextBold}>Pura Fruit Piura © 2025</Text>
          <Text style={styles.footerText}>• Red Operativa de Capacitación en Campo</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.footerText}>Modo PWA de Alto Rendimiento</Text>
          <View style={styles.footerWifiRow}>
            <Ionicons name="wifi" size={14} color={Colors.success} />
            <Text style={[styles.footerTextBold, { color: Colors.success, marginLeft: 4 }]}>Banda de Campo Baja</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    zIndex: 10,
  },
  headerMobile: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radius.md,
    gap: 6,
  },
  headerButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  containerDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  containerMobile: {
    width: '100%',
  },
  hero: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
  },
  heroDesktop: {
    height: 380,
  },
  heroMobile: {
    height: 450,
  },
  heroImageRadius: {
    borderRadius: Radius.xl,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(7, 36, 24, 0.65)', // Darker overlay for contrast
    borderRadius: Radius.xl,
  },
  heroInner: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  heroBadgePrimary: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    gap: 6,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8CE2A7',
  },
  heroBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTopRightPills: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  glassPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: 6,
  },
  glassPillText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  heroCenter: {
    maxWidth: 600,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '400',
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: Spacing.md,
  },
  heroBottomLeft: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  heroBottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBottomText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
  heroBottomRightText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  quickBar: {
    backgroundColor: '#FFF',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  quickBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 300,
    gap: Spacing.md,
  },
  quickBarIconBox: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  quickBarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  quickBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  freeBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  freeBadgeText: {
    color: Colors.successText,
    fontSize: 10,
    fontWeight: '800',
  },
  quickBarDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  quickBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  quickBarRightMobile: {
    width: '100%',
    justifyContent: 'space-between',
  },
  progressBlock: {
    width: 140,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  universalBanner: {
    backgroundColor: Colors.cardMuted,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: 8,
  },
  universalBannerText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  universalBannerBold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  mainColumns: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginTop: Spacing.xxl,
  },
  mainColumnsMobile: {
    flexDirection: 'column',
    gap: Spacing.xl,
  },
  leftColumn: {
    flex: 2,
    minWidth: 320,
  },
  leftColumnMobile: {
    flex: undefined,
    minWidth: 0,
    width: '100%',
  },
  rightColumn: {
    flex: 1,
    minWidth: 300,
  },
  rightColumnMobile: {
    flex: undefined,
    minWidth: 0,
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionSubtitleText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pillGreenLight: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  pillGreenLightText: {
    color: Colors.successText,
    fontSize: 10,
    fontWeight: '700',
  },
  moduleCard: {
    backgroundColor: '#FFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  moduleCardMobile: {
    flexDirection: 'column',
  },
  moduleCardActive: {
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  moduleCardImageContainer: {
    width: 140,
    position: 'relative',
  },
  moduleCardImageContainerMobile: {
    width: '100%',
    height: 165,
  },
  moduleCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moduleCardDuration: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    gap: 4,
  },
  moduleCardDurationText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  checkCircleAbsolute: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.successLight,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enCursoBadgeAbsolute: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  enCursoBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  moduleCardContent: {
    flex: 1,
    padding: Spacing.md,
  },
  moduleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  stepBadgeActive: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  stepBadgeActiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.successText,
  },
  pointsBadgeCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  pointsBadgeCompletedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.successText,
  },
  pointsBadgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  pointsBadgePendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  pointsBadgeNeutral: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.cardMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  pointsBadgeNeutralText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  moduleCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  moduleCardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  moduleCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  moduleCardBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moduleCardBottomText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  primaryButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  primaryButtonTextSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  pointsWidget: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  pointsWidgetTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  pointsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsWidgetTexts: {
    flex: 1,
  },
  pointsWidgetLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsBig: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
  },
  pointsSmall: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  liveBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  liveBadgeText: {
    color: '#065F46',
    fontSize: 10,
    fontWeight: '800',
  },
  pointsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: Spacing.md,
  },
  pointsWidgetBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pointsNextGoal: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    flex: 1,
  },
  pointsNextGoalPoints: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pointsMessage: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  pointsMessageText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    lineHeight: 16,
  },
  pointsListCard: {
    backgroundColor: '#FFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
  },
  pointsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  pointsListTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pointsListSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  pointsListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  pointsListIconBoxCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsListIconBoxActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsListIconBoxNeutral: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsListItemTexts: {
    flex: 1,
  },
  pointsListItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  pointsListItemSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  pointsListItemScore: {
    fontSize: 13,
    fontWeight: '700',
  },
  pointsListItemScoreNeutral: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  listDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 36,
  },
  infoBox: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  supportCardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  supportCard: {
    flex: 1,
    minWidth: 250,
    backgroundColor: '#FFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  supportIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 2,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  supportDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  footer: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.md,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  footerTextBold: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  footerWifiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
