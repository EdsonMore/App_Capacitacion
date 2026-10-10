export const Colors = {
  primary: '#0E3A28', // Dark Forest Green for main buttons and headers
  primaryDark: '#072418',
  primaryMedium: '#1B4D36',
  primaryLight: '#2A6348',
  accentGold: '#F3B748', // Amber/gold for streaks and active next-lesson buttons
  accentAmberDark: '#D4962A',
  
  // Status and tag colors
  success: '#1D7A46',
  successLight: '#E8F5E9',
  successBorder: '#B7E1C1',
  successText: '#135832',

  warning: '#D97706',
  warningLight: '#FEF3C7',
  warningText: '#92400E',

  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  dangerText: '#991B1B',

  purpleLight: '#F3E8FF',
  purpleText: '#7E22CE',

  // Surfaces & Backgrounds
  background: '#F7F8F5', // Soft agricultural off-white
  card: '#FFFFFF',
  cardMuted: '#F0F3ED',
  cardHighlight: '#EAF3EC',
  surfaceSage: '#E2EBE4',

  // Text colors
  textPrimary: '#102016',
  textSecondary: '#55685B',
  textMuted: '#84968A',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E3E8E1',
  borderLight: '#EDF1EB',
  borderFocus: '#0E3A28',
};

export const Typography = {
  titleHero: {
    fontSize: 26,
    fontWeight: '800' as const,
    lineHeight: 32,
    color: Colors.textPrimary,
  },
  titleSection: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
    color: Colors.textPrimary,
  },
  titleCard: {
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  bodyLarge: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  bodyMedium: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: Colors.textMuted,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700' as const,
    lineHeight: 14,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
