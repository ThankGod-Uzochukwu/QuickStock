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
  xl: 24,
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
} as const;

export const colors = {
  light: {
    background: '#F6F5F1',
    backgroundAlt: '#FFF9F1',
    surface: '#FFFDF8',
    surfaceElevated: '#FFFFFF',
    surfaceMuted: '#EEE7DA',
    border: '#E6DDCF',
    text: {
      primary: '#14120F',
      secondary: '#5F574D',
      tertiary: '#8D8478',
    },
    primary: '#E4572E',
    accent: '#0F8B8D',
    accentAlt: '#F3A712',
    accentSoft: '#FFF0E9',
    error: '#D64545',
    success: '#11875D',
    warning: '#D97706',
    info: '#2563EB',
  },
  dark: {
    background: '#07111B',
    backgroundAlt: '#0D1B2A',
    surface: '#102030',
    surfaceElevated: '#173044',
    surfaceMuted: '#1E384D',
    border: '#2A455A',
    text: {
      primary: '#F7F9FB',
      secondary: '#C4D3DF',
      tertiary: '#8FA5B8',
    },
    primary: '#FF7A59',
    accent: '#4DD0D6',
    accentAlt: '#FFD166',
    accentSoft: '#173443',
    error: '#FF6B6B',
    success: '#44D7A8',
    warning: '#FFB703',
    info: '#7AA2FF',
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;


export const touchTarget = {
  minSize: 44,
} as const;
