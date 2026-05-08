import { Fonts } from '@/constants/theme';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  families: {
    heading: Fonts.rounded,
    body: Fonts.sans,
    mono: Fonts.mono,
  },
} as const;

export const colors = {
  light: {
    background: '#F4F1EC',
    surface: '#FFFFFF',
    border: '#E3DDD4',
    text: {
      primary: '#1E1B18',
      secondary: '#5C5348',
      tertiary: '#8C8174',
    },
    primary: '#0F766E',
    accent: '#F59E0B',
    error: '#E11D48',
    success: '#16A34A',
    warning: '#F59E0B',
  },
  dark: {
    background: '#0C0F12',
    surface: '#161B20',
    border: '#2A323A',
    text: {
      primary: '#F8FAFC',
      secondary: '#CAD2DA',
      tertiary: '#98A2B3',
    },
    primary: '#2DD4BF',
    accent: '#FBBF24',
    error: '#FB7185',
    success: '#34D399',
    warning: '#FBBF24',
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;


export const touchTarget = {
  minSize: 44,
} as const;
