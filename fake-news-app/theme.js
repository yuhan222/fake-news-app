// ============================================
// theme.js — 深色設計系統（數位偵探風格）
// ============================================

export const colors = {
  // 主色
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#60A5FA',
  primaryBg: 'rgba(59,130,246,0.12)',
  primaryBorder: 'rgba(59,130,246,0.25)',

  // 背景層次（深色）
  background: '#080E1A',
  surface: '#0F1829',
  surfaceElevated: '#151F33',
  surfaceHigh: '#1A2640',

  // 文字
  textPrimary: '#F0F6FF',
  textSecondary: '#94A3B8',
  textTertiary: '#3D5068',

  // 語意色
  success: '#10B981',
  successBg: 'rgba(16,185,129,0.12)',
  successBorder: 'rgba(16,185,129,0.28)',
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.12)',
  dangerBorder: 'rgba(239,68,68,0.28)',
  warning: '#F59E0B',
  warningBg: 'rgba(245,158,11,0.12)',
  warningBorder: 'rgba(245,158,11,0.28)',

  // 分隔線
  border: 'rgba(255,255,255,0.07)',
  borderMid: 'rgba(255,255,255,0.11)',

  // 夜色（詐騙者視角）
  dark: '#040810',
  darkSurface: '#080E1A',
  darkBorder: 'rgba(255,255,255,0.05)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  primary: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  success: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  danger: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
};
