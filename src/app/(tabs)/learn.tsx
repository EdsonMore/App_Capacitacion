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
  useWindowDimensions,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { notify } from '@/utils/notify';
import { Colors, Radius, Spacing } from '@/constants/theme';
import PuraFruitHeaderLogo from '@/components/PuraFruitHeaderLogo';
import { dataService } from '@/services/dataService';
import { ModuleItem, UserStats } from '@/types';

type FilterTab = 'Todos (5)' | 'Fundamentos de Uva' | 'Técnicas de Corte & Tijeras' | 'Calibrado & Selección' | 'Empaque & Inocuidad';

const MODULE_LESSON_MAP: Record<string, string> = {
  'mod-1': 'lesson-1-1',
  'mod-2': 'lesson-2-2',
  'mod-3': 'lesson-3-1',
  'mod-4': 'lesson-4-1',
  'mod-5': 'lesson-5-1',
};

const MODULE_IMAGE_MAP: Record<string, any> = {
  'mod-1': require('../../../assets/images/uvapro/hero.jpg'),
  'mod-2': require('../../../assets/images/uvapro/lesson_video.jpg'),
  'mod-3': require('../../../assets/images/uvapro/module3_shears.jpg'),
  'mod-4': require('../../../assets/images/uvapro/module2_caliper.jpg'),
  'mod-5': require('../../../assets/images/uvapro/hero.jpg'),
};

export default function LearnScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
  const cardResponsiveWidth = isDesktop
    ? 'calc(33.333% - 16px)'
    : isTablet
      ? 'calc(50% - 12px)'
      : '100%';
  
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos (5)');
  const [searchQuery, setSearchQuery] = useState('');
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const filters: FilterTab[] = [
    'Todos (5)',
    'Fundamentos de Uva',
    'Técnicas de Corte & Tijeras',
    'Calibrado & Selección',
    'Empaque & Inocuidad'
  ];

  const loadData = useCallback(async () => {
    try {
      const [fetchedModules, fetchedStats] = await Promise.all([
        dataService.getModules(),
        dataService.getUserStats(),
      ]);
      setModules(fetchedModules);
      setUserStats(fetchedStats);
    } catch (e) {
      console.warn('Error loading learn data:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleResetProgress = () => {
    const doResetClean = async () => {
      try {
        await dataService.resetProgress(false);
        await loadData();
        notify('Progreso Restablecido', 'Se ha reiniciado el avance a 0% para un nuevo cosechador.');
      } catch (e) {
        console.warn('Error resetting progress:', e);
      }
    };

    const doResetDemo = async () => {
      try {
        await dataService.resetProgress(true);
        await loadData();
        notify('Datos Demo Cargados', 'Se han restaurado los datos de demostración (340 pts).');
      } catch (e) {
        console.warn('Error resetting demo:', e);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        '¿Deseas restablecer el avance en este dispositivo?\n\n- Aceptar: Iniciar desde 0% (Nuevo cosechador)\n- Cancelar: Mantener progreso actual'
      );
      if (confirmed) {
        doResetClean();
      }
    } else {
      Alert.alert(
        'Gestión de Avance del Operario',
        'El progreso se guarda en la memoria de este dispositivo sin requerir registro ni internet. ¿Qué acción deseas realizar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cargar Demo (340 pts)', onPress: doResetDemo },
          { text: 'Iniciar desde 0% (Nuevo operario)', style: 'destructive', onPress: doResetClean },
        ]
      );
    }
  };

  const handlePressModule = (module: ModuleItem) => {
    if (module.status === 'locked') {
      notify(
        'Módulo Bloqueado',
        'Debes completar y aprobar la evaluación del módulo anterior para desbloquear este nivel.'
      );
      return;
    }
    const lessonId = MODULE_LESSON_MAP[module.id] || 'lesson-1-1';
    router.push(`/lesson/${lessonId}` as any);
  };

  const completedCount = modules.filter(m => m.status === 'completed').length;
  const totalCount = modules.length || 5;
  const certPercent = Math.round((completedCount / totalCount) * 100);
  const nextModule = modules.find(m => m.status === 'in_progress' || m.status === 'available');

  const filteredModules = modules.filter(m => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuery = m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      if (!matchQuery) return false;
    }

    if (activeFilter === 'Todos (5)') return true;
    if (activeFilter === 'Fundamentos de Uva') return m.category === 'fundamentals';
    if (activeFilter === 'Técnicas de Corte & Tijeras') return m.category === 'cutting';
    if (activeFilter === 'Calibrado & Selección') return m.id === 'mod-4' || m.category === 'packaging';
    if (activeFilter === 'Empaque & Inocuidad') return m.category === 'packaging';
    return true;
  });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* TOP NAVBAR (Dark Green) */}
      <View style={styles.topNavbar}>
        <View style={styles.navbarInner}>
          {/* Logo Left */}
          <View style={styles.navLogoSection}>
            <PuraFruitHeaderLogo size="sm" lightBackground={false} />
            <View style={styles.navLogoTexts}>
              <View style={{flexDirection:'row', alignItems:'center', gap: 6}}>
                <Text style={styles.navBrandText}>Pura Fruit</Text>
                <View style={styles.navBadgeUvapro}>
                  <Text style={styles.navBadgeUvaproText}>UvaPro</Text>
                </View>
              </View>
              <Text style={styles.navSubBrandText}>Academia Digital del Cosechador</Text>
            </View>
          </View>

          {/* Nav Links Center */}
          {isDesktop && (
            <View style={styles.navLinks}>
              <Pressable style={styles.navLink} onPress={() => router.push('/')}>
                <Text style={styles.navLinkText}>Inicio</Text>
              </Pressable>
              <View style={styles.navLinkActive}>
                <Ionicons name="book-outline" size={16} color="#FFF" />
                <Text style={styles.navLinkActiveText}>Aprender{'\n'}Módulos</Text>
              </View>
            </View>
          )}

          {/* Search Bar */}
          {isDesktop && (
            <View style={styles.navSearch}>
              <Ionicons name="search" size={16} color="rgba(255,255,255,0.5)" />
              <TextInput 
                style={styles.navSearchInput} 
                placeholder="Buscar lección (ej. Brix, Tijeras)..." 
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          {/* Profile & Points Right */}
          <View style={styles.navRight}>
            <View style={styles.navPointsPill}>
              <View style={styles.navPointsDot} />
              <View>
                <Text style={styles.navPointsText}>
                  <Text style={{fontWeight:'800'}}>{userStats?.points ?? 0}</Text> / 600
                </Text>
                <Text style={styles.navPointsSub}>Pts</Text>
              </View>
            </View>
            {isDesktop && (
              <View style={styles.navProfile}>
                <View style={{alignItems:'flex-end', marginRight: 8}}>
                  <Text style={styles.navProfileName}>Operario de Campo</Text>
                  <Text style={styles.navProfileStatus}>Offline Listo • Fundo 34</Text>
                </View>
                <Pressable
                  style={styles.navAvatar}
                  onPress={handleResetProgress}
                  accessibilityLabel="Restablecer progreso del operario"
                >
                  <Ionicons name="refresh" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainContainer, !isDesktop && { width: '100%', paddingHorizontal: 0 }]}>
          
          {/* HEADER CARD */}
          <View style={styles.headerCard}>
            <View style={styles.headerCardContent}>
              <View style={styles.headerCardLeft}>
                <View style={styles.officialRoutePill}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                  <Text style={styles.officialRouteText}>Ruta Oficial de Capacitación • Temporada 2024 - 2025</Text>
                </View>
                <Text style={styles.headerCardTitle}>Módulos de Cosecha de Uva de Mesa</Text>
                <Text style={styles.headerCardDesc}>
                  Micro-lecciones audiovisuales de 3 a 5 minutos diseñadas para campo. Domina calibrado, puntos de corte, grados Brix e inocuidad de exportación.
                </Text>
              </View>

              <View style={styles.headerCardRight}>
                <View style={styles.progressBox}>
                  <View style={styles.progressBoxHeader}>
                    <View style={{flexDirection:'row', alignItems:'center', gap: 6}}>
                      <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
                      <Text style={styles.progressBoxTitle}>PROGRESO DE CERTIFICACIÓN</Text>
                    </View>
                    <Text style={styles.progressBoxPercent}>{certPercent}%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${certPercent}%` }]} />
                  </View>
                  <View style={styles.progressBoxFooter}>
                    <Text style={styles.progressBoxText}>{completedCount} de {totalCount} módulos completados</Text>
                    <View style={styles.progressBoxNextPill}>
                      <Text style={styles.progressBoxNextText}>
                        {nextModule ? `Próxima: Módulo ${nextModule.number}` : '¡Ruta completada!'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* BOTÓN RESTABLECER PROGRESO */}
                <Pressable
                  style={styles.resetButtonRow}
                  onPress={handleResetProgress}
                >
                  <Ionicons name="reload-circle-outline" size={16} color="#D97706" />
                  <Text style={styles.resetButtonText}>Restablecer para nuevo operario (0%)</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* FILTERS */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
              {filters.map(f => (
                <Pressable 
                  key={f} 
                  style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
                  onPress={() => setActiveFilter(f)}
                >
                  <Text style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}>{f}</Text>
                </Pressable>
              ))}
            </ScrollView>
            {isDesktop && (
              <View style={styles.activeCampaignBox}>
                <Text style={styles.activeCampaignLabel}>Campaña activa:</Text>
                <View style={styles.activeCampaignPill}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.success} />
                  <Text style={styles.activeCampaignText}>Temporada 2024 - 2025</Text>
                </View>
              </View>
            )}
          </View>

          {/* GRID DE MÓDULOS DINÁMICO */}
          <View style={styles.gridContainer}>
            {filteredModules.map((item) => {
              const isCompleted = item.status === 'completed';
              const isInProgress = item.status === 'in_progress';
              const isLocked = item.status === 'locked';
              const imageSource = MODULE_IMAGE_MAP[item.id] || item.imageUri || require('../../../assets/images/uvapro/hero.jpg');

              return (
                <View
                  key={item.id}
                  style={[
                    styles.moduleCard,
                    { width: cardResponsiveWidth as any },
                    isInProgress && styles.moduleCardActive,
                    isLocked && { opacity: 0.78 },
                  ]}
                >
                  <View style={styles.moduleCardImageContainer}>
                    <Image source={imageSource} style={styles.moduleCardImage} />
                    
                    <View style={styles.moduleCardTopLeftBadge}>
                      <Text style={styles.moduleCardTopBadgeText}>Módulo {item.number}</Text>
                    </View>

                    {isCompleted && (
                      <View style={styles.moduleCardTopRightBadgeCompleted}>
                        <Ionicons name="checkmark" size={14} color="#FFF" />
                        <Text style={styles.moduleCardTopBadgeTextWhite}>Completado</Text>
                      </View>
                    )}

                    {isInProgress && (
                      <View style={styles.recommendedBadgeAbsolute}>
                        <Text style={styles.recommendedBadgeText}>EN PROGRESO</Text>
                      </View>
                    )}

                    {item.status === 'available' && (
                      <View style={styles.moduleCardTopRightBadgeAvailable}>
                        <Text style={styles.moduleCardTopBadgeTextWhite}>Disponible</Text>
                      </View>
                    )}

                    {isLocked && (
                      <View style={[styles.moduleCardTopRightBadgeAvailable, { backgroundColor: '#64748B' }]}>
                        <Ionicons name="lock-closed" size={11} color="#FFF" style={{ marginRight: 3 }} />
                        <Text style={styles.moduleCardTopBadgeTextWhite}>Bloqueado</Text>
                      </View>
                    )}

                    <View style={styles.moduleCardBottomRow}>
                      <View style={styles.moduleCardBottomPill}>
                        <Ionicons name="play" size={10} color="#FFF" />
                        <Text style={styles.moduleCardBottomText}>{item.lessonsText} • {item.durationText}</Text>
                      </View>
                      <View style={isCompleted ? styles.moduleCardBottomPillGreen : styles.moduleCardBottomPillDark}>
                        <Text style={styles.moduleCardBottomText}>
                          {isCompleted ? 'Aprobado 100%' : isInProgress ? `${item.progressPercent || 33}% avance` : '100% Offline'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.moduleCardBody}>
                    <View style={styles.moduleCardMetaRow}>
                      <Text style={isInProgress ? styles.moduleCardCategoryGreen : styles.moduleCardCategory}>
                        {item.category === 'fundamentals' ? 'Fundamentos' : item.category === 'cutting' ? 'Técnicas de Corte' : 'Empaque & Calidad'}
                      </Text>
                      {isCompleted ? (
                        <View style={styles.pointsPillGreen}>
                          <Text style={styles.pointsPillGreenText}>+100 Pts ganados</Text>
                        </View>
                      ) : isInProgress ? (
                        <View style={styles.pointsPillOutlineOrange}>
                          <Text style={styles.pointsPillOutlineOrangeText}>Gana +150 Pts</Text>
                        </View>
                      ) : (
                        <View style={styles.pointsPillOutline}>
                          <Text style={styles.pointsPillOutlineText}>+100 Pts</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.moduleCardTitle}>{item.title}</Text>
                    <Text style={styles.moduleCardDesc} numberOfLines={2}>
                      {item.description}
                    </Text>

                    {isInProgress && (
                      <View style={styles.activeProgressSection}>
                        <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 4}}>
                          <Text style={styles.activeProgressLabel}>Avance de lecciones</Text>
                          <Text style={styles.activeProgressPercent}>{item.progressPercent ?? 33}%</Text>
                        </View>
                        <View style={styles.activeProgressBarBg}>
                          <View style={[styles.activeProgressBarFill, { width: `${item.progressPercent ?? 33}%` }]} />
                        </View>
                      </View>
                    )}

                    <View style={[styles.moduleCardFooter, isInProgress && { borderTopWidth: 0, paddingTop: 0 }]}>
                      {isCompleted ? (
                        <>
                          <View style={{flexDirection:'row', alignItems:'center', gap: 6}}>
                            <Text style={styles.moduleCardFooterLabel}>Calificación:</Text>
                            <View style={styles.califBadge}>
                              <Text style={styles.califBadgeText}>100%</Text>
                            </View>
                          </View>
                          <Pressable style={{flexDirection:'row', alignItems:'center'}} onPress={() => handlePressModule(item)}>
                            <Text style={styles.repassText}>Repasar módulo</Text>
                            <Ionicons name="chevron-forward" size={14} color={Colors.textPrimary} />
                          </Pressable>
                        </>
                      ) : isInProgress ? (
                        <>
                          <Text style={styles.currentLessonText}>Lección activa pendiente</Text>
                          <Pressable style={styles.primaryButton} onPress={() => handlePressModule(item)}>
                            <Text style={styles.primaryButtonText}>Continuar lección</Text>
                            <Ionicons name="arrow-forward" size={14} color="#FFF" />
                          </Pressable>
                        </>
                      ) : isLocked ? (
                        <>
                          <Text style={styles.footerMutedText}>Bloqueado temporalmente</Text>
                          <View style={{flexDirection:'row', alignItems:'center', gap: 4}}>
                            <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
                            <Text style={styles.footerMutedText}>Completa el anterior</Text>
                          </View>
                        </>
                      ) : (
                        <>
                          <Text style={styles.footerMutedText}>Sin iniciar</Text>
                          <Pressable style={{flexDirection:'row', alignItems:'center', gap: 4}} onPress={() => handlePressModule(item)}>
                            <Text style={styles.startModuleText}>Iniciar módulo</Text>
                            <Ionicons name="arrow-forward" size={14} color={Colors.textPrimary} />
                          </Pressable>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Final Exam Card */}
            <View style={styles.finalExamCard}>
              <View style={styles.finalExamInner}>
                <View style={styles.finalExamTop}>
                  <View style={styles.finalExamBadge}>
                    <Text style={styles.finalExamBadgeText}>EVALUACIÓN FINAL</Text>
                  </View>
                  <Ionicons name="star" size={40} color="rgba(255,255,255,0.15)" />
                </View>
                <Text style={styles.finalExamTitle}>Examen Teórico Práctico de Campo</Text>
                <Text style={styles.finalExamDesc}>
                  Se desbloquea al completar los 5 módulos (100% de la ruta). Otorga certificado físico y carné de cosechador calificado Pura Fruit.
                </Text>
                
                <View style={{flex: 1}} />

                <View style={styles.finalExamReqRow}>
                  <Text style={styles.finalExamReqLabel}>Requisito previo</Text>
                  <Text style={styles.finalExamReqValue}>
                    {completedCount === 5 ? '¡Requisitos cumplidos!' : `${5 - completedCount} módulos restantes`}
                  </Text>
                </View>
                <Pressable
                  style={[
                    styles.finalExamLockedBtn,
                    completedCount === 5 && { backgroundColor: '#22C55E', borderColor: '#22C55E' },
                  ]}
                  onPress={() => {
                    if (completedCount === 5) {
                      notify(
                        '¡Ruta Culminada con Éxito!',
                        'Has aprobado los 5 módulos de cosecha de uva de mesa de exportación Pura Fruit.'
                      );
                    } else {
                      notify('Evaluación Bloqueada', `Debes culminar los ${5 - completedCount} módulos restantes para rendir el examen.`);
                    }
                  }}
                >
                  <Ionicons
                    name={completedCount === 5 ? 'trophy-outline' : 'lock-closed-outline'}
                    size={14}
                    color={completedCount === 5 ? '#FFF' : 'rgba(255,255,255,0.6)'}
                  />
                  <Text style={[styles.finalExamLockedBtnText, completedCount === 5 && { color: '#FFF', fontWeight: '800' }]}>
                    {completedCount === 5 ? 'Rendir Evaluación Final' : 'Bloqueado temporalmente'}
                  </Text>
                </Pressable>
              </View>
            </View>

          </View>

          {/* OFFLINE BANNER */}
          <View style={styles.offlineBanner}>
            <View style={styles.offlineIconBox}>
              <Ionicons name="cloud-upload-outline" size={24} color="#FFF" />
            </View>
            <View style={styles.offlineBannerTexts}>
              <Text style={styles.offlineBannerTitle}>Almacenamiento Local Autónomo (Sin Cuenta ni Login)</Text>
              <Text style={styles.offlineBannerDesc}>
                Tu avance, calificaciones y estrellas se guardan en este dispositivo ({Platform.OS === 'web' ? 'Navegador Web / Cache' : 'Memoria Segura del APK'}). Al terminar el turno, puedes reiniciar el dispositivo para el siguiente cosechador.
              </Text>
            </View>
            <Pressable style={styles.offlineBtn} onPress={handleResetProgress}>
              <Text style={styles.offlineBtnText}>Restablecer Progreso</Text>
            </Pressable>
          </View>

        </View>

        {/* BOTTOM FOOTER */}
        <View style={styles.footerLine} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text style={{fontWeight:'700', color: Colors.textPrimary}}>Pura Fruit • AgroField Learning System</Text> © 2024 • Ica & Piura, Perú
          </Text>
          <View style={styles.footerRightLinks}>
            <Text style={styles.footerLink}>Protocolo Fitosanitario</Text>
            <Text style={styles.footerLink}>Soporte Agrícola</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Sistema Operativo en Línea</Text>
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
    backgroundColor: '#F8F9FA',
  },
  topNavbar: {
    backgroundColor: Colors.primary,
    width: '100%',
    zIndex: 10,
  },
  navbarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
  },
  navLogoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  navLogoTexts: {
    justifyContent: 'center',
  },
  navBrandText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  navBadgeUvapro: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  navBadgeUvaproText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  navSubBrandText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  navLink: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  navLinkText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  navLinkActive: {
    backgroundColor: '#134B36',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.md,
    gap: 8,
  },
  navLinkActiveText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  navSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.md,
    width: 250,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navSearchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 12,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  navPointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#134B36',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    gap: 8,
  },
  navPointsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8CE2A7',
  },
  navPointsText: {
    color: '#FFF',
    fontSize: 12,
  },
  navPointsSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  navProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navProfileName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  navProfileStatus: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  navAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#164E36',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2A6348',
  },
  navAvatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xxxl,
    paddingTop: Spacing.xl,
  },
  mainContainer: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  headerCard: {
    backgroundColor: '#FFF',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  headerCardContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  headerCardLeft: {
    flex: 2,
    minWidth: 300,
  },
  officialRoutePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: Spacing.md,
  },
  officialRouteText: {
    color: Colors.successText,
    fontSize: 11,
    fontWeight: '700',
  },
  headerCardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  headerCardDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    maxWidth: 600,
  },
  headerCardRight: {
    flex: 1,
    minWidth: 250,
  },
  progressBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  progressBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBoxTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  progressBoxPercent: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressBoxFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBoxText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressBoxNextPill: {
    backgroundColor: '#EAF3EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  progressBoxNextText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  resetButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
    borderRadius: Radius.md,
  },
  resetButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C2410C',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  filtersScroll: {
    gap: Spacing.sm,
  },
  filterPill: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterPillActive: {
    backgroundColor: '#164E36',
    borderColor: '#164E36',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFF',
  },
  activeCampaignBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  activeCampaignLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  activeCampaignPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
  },
  activeCampaignText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  moduleCard: {
    backgroundColor: '#FFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  moduleCardActive: {
    borderColor: Colors.success,
    borderWidth: 2,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  moduleCardImageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  moduleCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moduleCardTopLeftBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  moduleCardTopBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  moduleCardTopRightBadgeCompleted: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    gap: 4,
  },
  moduleCardTopRightBadgeAvailable: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  moduleCardTopBadgeTextWhite: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  recommendedBadgeAbsolute: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: Radius.md,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  moduleCardBottomRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleCardBottomPill: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    gap: 4,
  },
  moduleCardBottomPillDark: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  moduleCardBottomPillGreen: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  moduleCardBottomText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  moduleCardBottomTextWhite: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  moduleCardBody: {
    padding: Spacing.lg,
    flex: 1,
    justifyContent: 'space-between',
  },
  moduleCardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleCardCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  moduleCardCategoryGreen: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '700',
  },
  pointsPillGreen: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  pointsPillGreenText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.successText,
  },
  pointsPillOutline: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  pointsPillOutlineText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pointsPillOutlineOrange: {
    borderWidth: 1,
    borderColor: '#FFEDD5',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  pointsPillOutlineOrangeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C2410C',
  },
  moduleCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  moduleCardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  moduleCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
    marginTop: 'auto',
  },
  moduleCardFooterLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  califBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  califBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.success,
  },
  repassText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginRight: 4,
  },
  footerMutedText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  startModuleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  activeProgressSection: {
    marginBottom: Spacing.lg,
  },
  activeProgressLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  activeProgressPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  activeProgressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  activeProgressBarFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  currentLessonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.md,
    gap: 6,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  finalExamCard: {
    width: (Platform.OS === 'web' ? 'calc(33.333% - 16px)' : '100%') as any,
    minWidth: 300,
    backgroundColor: '#164E36',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
  },
  finalExamInner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  finalExamTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  finalExamBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  finalExamBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  finalExamTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    lineHeight: 26,
  },
  finalExamDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginBottom: Spacing.xl,
  },
  finalExamReqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  finalExamReqLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  finalExamReqValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  finalExamLockedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    borderRadius: Radius.md,
    gap: 8,
  },
  finalExamLockedBtnText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
  },
  offlineBanner: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  offlineIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineBannerTexts: {
    flex: 1,
    minWidth: 250,
  },
  offlineBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  offlineBannerDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  offlineBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  offlineBtnText: {
    color: Colors.successText,
    fontSize: 13,
    fontWeight: '700',
  },
  footerLine: {
    height: 1,
    backgroundColor: Colors.borderLight,
    width: '100%',
    marginTop: Spacing.xxxl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.md,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footerRightLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  footerLink: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
});
