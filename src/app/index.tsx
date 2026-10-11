import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import PuraFruitHeaderLogo from '@/components/PuraFruitHeaderLogo';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [highContrast, setHighContrast] = useState(false);
  const [audioNotesActive, setAudioNotesActive] = useState(false);

  const handleStart = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={[styles.screen, highContrast && styles.highContrastBg]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section con viñedo real */}
        <ImageBackground
          source={require('../../assets/images/uvapro/hero.jpg')}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          {/* Overlay degradado verde oscuro hacia el texto */}
          <View style={styles.heroGradientOverlay} />

          {/* Top Bar con Pills */}
          <View style={styles.topHeader}>
            <PuraFruitHeaderLogo size="lg" lightBackground={false} />

            <View style={styles.locationPill}>
              <View style={styles.locationDot} />
              <Text style={styles.locationText}>Piura, PE</Text>
            </View>
          </View>

          {/* Hero Content */}
          <View style={styles.heroTextContainer}>
            <View style={styles.categoryBadge}>
              <View style={styles.smallDot} />
              <Text style={styles.categoryBadgeText}>CAPACITACIÓN DE EXPORTACIÓN</Text>
            </View>

            <Text style={styles.heroTitle}>Aprende a cosechar{'\n'}mejor</Text>
            <Text style={styles.heroSubtitle}>
              Pequeños aprendizajes. Grandes cosechas.
            </Text>
          </View>
        </ImageBackground>

        {/* Contenido Inferior */}
        <View style={styles.contentBody}>
          {/* Card: Módulos rápidos de 3 min */}
          <View style={[styles.featureCard, Shadows.md]}>
            <View style={styles.featureIconContainer}>
              <MaterialCommunityIcons name="timer-sand" size={22} color={Colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Módulos rápidos de 3 min</Text>
              <Text style={styles.featureDesc}>
                Prácticos, visuales y sin datos móviles
              </Text>
            </View>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>100%</Text>
              <Text style={styles.freeBadgeText}>Libre</Text>
            </View>
          </View>

          {/* Botón Principal: Comenzar a aprender */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              Shadows.lg,
            ]}
            onPress={handleStart}
          >
            <Text style={styles.primaryButtonText}>Comenzar a aprender</Text>
            <Ionicons name="arrow-forward" size={22} color="#FFFFFF" style={styles.buttonArrow} />
          </Pressable>

          {/* Card: Acceso directo y universal */}
          <View style={styles.universalCard}>
            <View style={styles.universalHeader}>
              <MaterialCommunityIcons name="shield-check-outline" size={20} color={Colors.primary} />
              <Text style={styles.universalTitle}>Acceso directo y universal</Text>
            </View>
            <Text style={styles.universalDesc}>
              Sin registro ni contraseñas • Diseñado para el campo
            </Text>
          </View>

          {/* Grid de 2 Features Accesibles */}
          <View style={styles.featuresGrid}>
            {/* Card Alto Contraste */}
            <Pressable
              style={({ pressed }) => [
                styles.gridCard,
                highContrast && styles.gridCardActive,
                pressed && { opacity: 0.8 },
                Shadows.sm,
              ]}
              onPress={() => setHighContrast(!highContrast)}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: '#D7F5DE' }]}>
                <Ionicons name="sunny" size={20} color="#1D7A46" />
              </View>
              <Text style={styles.gridCardTitle}>Alto Contraste</Text>
              <Text style={styles.gridCardDesc}>Visible bajo sol radiante</Text>
            </Pressable>

            {/* Card Audionotas */}
            <Pressable
              style={({ pressed }) => [
                styles.gridCard,
                audioNotesActive && styles.gridCardActive,
                pressed && { opacity: 0.8 },
                Shadows.sm,
              ]}
              onPress={() => setAudioNotesActive(!audioNotesActive)}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: '#F3E8FF' }]}>
                <MaterialCommunityIcons name="volume-high" size={20} color="#7E22CE" />
              </View>
              <Text style={styles.gridCardTitle}>Audionotas</Text>
              <Text style={styles.gridCardDesc}>Escucha mientras trabajas</Text>
            </Pressable>
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
  highContrastBg: {
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xxxl,
  },
  heroBackground: {
    width: '100%',
    height: Math.min(SCREEN_HEIGHT * 0.52, 450),
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 54,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 36, 23, 0.45)',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandLogoWhitePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  heroLogoImage: {
    width: 115,
    height: 28,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentGold,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTextContainer: {
    gap: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(14, 58, 40, 0.85)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  smallDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#8CE2A7',
  },
  categoryBadgeText: {
    color: '#D8F3DC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  contentBody: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  featureCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceSage,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  freeBadge: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1B5E20',
    lineHeight: 13,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 18,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: 4,
  },
  primaryButtonPressed: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  buttonArrow: {
    marginLeft: 4,
  },
  universalCard: {
    backgroundColor: '#EDF4EE',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: 4,
    alignItems: 'center',
  },
  universalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  universalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  universalDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: 4,
  },
  gridCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 4,
  },
  gridCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cardHighlight,
  },
  gridIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  gridCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gridCardDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
});
