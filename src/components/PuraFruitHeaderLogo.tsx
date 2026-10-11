import React from 'react';
import { View, Image, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  lightBackground?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PuraFruitHeaderLogo({
  size = 'md',
  title,
  lightBackground = true,
  style,
}: Props) {
  const logoDimensions = {
    sm: { width: 130, height: 36 },
    md: { width: 160, height: 44 },
    lg: { width: 200, height: 56 },
    xl: { width: 250, height: 70 },
  }[size];

  const fontSize = {
    sm: 16,
    md: 18,
    lg: 22,
    xl: 26,
  }[size];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('@/assets/images/purafruit_logo_transparent.png')}
        style={[styles.logoImage, logoDimensions]}
        resizeMode="contain"
      />
      {title ? (
        <View style={styles.dividerCol}>
          <View style={[styles.verticalDivider, !lightBackground && styles.dividerLight]} />
          <Text style={[styles.titleText, { fontSize }, !lightBackground && styles.textLight]}>
            {title}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    // Sizing passed dynamically
  },
  dividerCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verticalDivider: {
    width: 1.5,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  dividerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  titleText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  textLight: {
    color: '#FFFFFF',
  },
});
