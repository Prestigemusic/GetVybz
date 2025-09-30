// src/theme.ts
// Central design tokens for GetVybz (React Native / Expo + TypeScript)
// Save this file as src/theme.ts and import tokens where needed.
//
// Examples:
// import theme, { themes, colors, gradients } from '../theme';
// <View style={{ backgroundColor: colors.background }} />

// -----------------------------
// // COLORS
// -----------------------------
export type ColorPalette = {
  // core
  background: string;
  surface: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  muted: string;
  // brand gradients / accents
  primaryStart: string;
  primaryEnd: string;
  accentStart: string;
  accentEnd: string;
  neonPink: string;
  partyYellow: string;
  // semantic
  success: string;
  danger: string;
  info: string;
  overlay: string;
};

const darkColors: ColorPalette = {
  // core
  background: '#0E0E12', // primary app background
  surface: '#14121A', // card surfaces slightly above background
  card: '#1E1E2F', // used in current screens
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  muted: '#303045',

  // brand gradients / accents (approved)
  primaryStart: '#6A0DFF',
  primaryEnd: '#B400FF',
  accentStart: '#00F5FF',
  accentEnd: '#00FFA3',
  neonPink: '#FF007F',
  partyYellow: '#FFD60A',

  // semantic
  success: '#28C76F',
  danger: '#FF4D4D',
  info: '#00A0FF',
  overlay: 'rgba(0,0,0,0.5)',
};

const lightColors: ColorPalette = {
  background: '#FFFFFF',
  surface: '#FAFBFF',
  card: '#FFFFFF',
  textPrimary: '#0E0E12',
  textSecondary: '#6B7280',
  muted: '#E6E7EE',
  primaryStart: '#6A0DFF',
  primaryEnd: '#B400FF',
  accentStart: '#00F5FF',
  accentEnd: '#00FFA3',
  neonPink: '#FF007F',
  partyYellow: '#FFD60A',
  success: '#28C76F',
  danger: '#E11D48',
  info: '#0066FF',
  overlay: 'rgba(0,0,0,0.04)',
};

const purpleColors: ColorPalette = {
  background: '#2A0D5E', // deep purple vibe
  surface: '#3B0E8A',
  card: '#40107F',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1C6FF',
  muted: '#4A2A7A',
  primaryStart: '#6A0DFF',
  primaryEnd: '#B400FF',
  accentStart: '#00F5FF',
  accentEnd: '#00FFA3',
  neonPink: '#FF2E83',
  partyYellow: '#FFD60A',
  success: '#22C55E',
  danger: '#FF375F',
  info: '#60A5FA',
  overlay: 'rgba(0,0,0,0.35)',
};

// -----------------------------
// // GRADIENTS
// -----------------------------
// Arrays ready to plug into react-native-linear-gradient or other libs
export const gradients = {
  primary: [darkColors.primaryStart, darkColors.primaryEnd],
  accent: [darkColors.accentStart, darkColors.accentEnd],
  neonPink: [darkColors.neonPink, '#FF4DA6'],
  reward: [darkColors.primaryStart, darkColors.neonPink],
  party: [darkColors.partyYellow, darkColors.accentStart],
  // orientation: use start={{x:0,y:0}} end={{x:1,y:1}}
};

// -----------------------------
// // TYPOGRAPHY
// -----------------------------
export const typography = {
  // NOTE: Install fonts (Poppins & Inter) or adjust names to your available fonts.
  fontBrand: 'Poppins-ExtraBold',
  fontHeading: 'Poppins-Bold',
  fontSemi: 'Poppins-SemiBold',
  fontBody: 'Inter-Regular',
  fontMono: 'Menlo',
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// -----------------------------
// // SPACING / RADII / SHADOWS
// -----------------------------
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 20,
  pill: 9999,
};

export const shadows = {
  light: {
    // iOS shadow + Android elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 9,
  },
  neonGlow: (hex = '#6A0DFF') => ({
    shadowColor: hex,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  }),
};

// -----------------------------
// // THEME OBJECTS & HELPERS
// -----------------------------
export type ThemeName = 'dark' | 'light' | 'purple';

export const themes: Record<ThemeName, {
  colors: ColorPalette;
  gradients: typeof gradients;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
}> = {
  dark: {
    colors: darkColors,
    gradients,
    typography,
    spacing,
    radii,
    shadows,
  },
  light: {
    colors: lightColors,
    gradients,
    typography,
    spacing,
    radii,
    shadows,
  },
  purple: {
    colors: purpleColors,
    gradients,
    typography,
    spacing,
    radii,
    shadows,
  },
};

// Default export (dark theme)
const defaultTheme = themes.dark;
export default defaultTheme;

// Helper: pick theme by name
export function getTheme(name: ThemeName = 'dark') {
  return themes[name];
}

// -----------------------------
// // UTILITIES
// -----------------------------
/**
 * Convert hex to rgba string: hexToRgba('#rrggbb', 0.5)
 */
export function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Contrast helper: returns either black or white for readable text
 */
export function readableTextColor(hex: string) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? '#0E0E12' : '#FFFFFF';
}

// -----------------------------
// // QUICK USAGE SNIPPETS (paste into component files)
// -----------------------------
/*

// Example 1 — simple color usage in a component:
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import theme, { getTheme } from '../theme';
const { colors, typography } = getTheme('dark');

export default function Example() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fontHeading, fontSize: typography.sizes.xl }}>
        Hello GetVybz
      </Text>
      <TouchableOpacity style={{
        marginTop: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.primaryStart // fallback when not using gradient
      }}>
        <Text style={{ color: colors.textPrimary }}>CTA</Text>
      </TouchableOpacity>
    </View>
  );
}

// Example 2 — Gradient button using react-native-linear-gradient:
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../theme';

<LinearGradient
  colors={gradients.primary}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ borderRadius: 12, padding: 12, alignItems: 'center' }}
>
  <Text style={{ color: '#fff', fontWeight: '700' }}>Book Now</Text>
</LinearGradient>

// NOTE: to use LinearGradient, install:
// expo install react-native-linear-gradient
// or yarn add react-native-linear-gradient

*/

