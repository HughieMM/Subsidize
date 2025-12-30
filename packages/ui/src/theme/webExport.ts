/**
 * Web-compatible theme export
 * Converts theme tokens to CSS custom properties and Tailwind-compatible format
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';

// Flatten color palette for CSS variables
export const cssVariables = {
  // Primary colors
  '--color-primary-50': colors.primary[50],
  '--color-primary-100': colors.primary[100],
  '--color-primary-200': colors.primary[200],
  '--color-primary-300': colors.primary[300],
  '--color-primary-400': colors.primary[400],
  '--color-primary-500': colors.primary[500],
  '--color-primary-600': colors.primary[600],
  '--color-primary-700': colors.primary[700],
  '--color-primary-800': colors.primary[800],
  '--color-primary-900': colors.primary[900],

  // Secondary colors
  '--color-secondary-50': colors.secondary[50],
  '--color-secondary-100': colors.secondary[100],
  '--color-secondary-200': colors.secondary[200],
  '--color-secondary-300': colors.secondary[300],
  '--color-secondary-400': colors.secondary[400],
  '--color-secondary-500': colors.secondary[500],
  '--color-secondary-600': colors.secondary[600],
  '--color-secondary-700': colors.secondary[700],
  '--color-secondary-800': colors.secondary[800],
  '--color-secondary-900': colors.secondary[900],

  // Accent colors
  '--color-accent-50': colors.accent[50],
  '--color-accent-100': colors.accent[100],
  '--color-accent-200': colors.accent[200],
  '--color-accent-300': colors.accent[300],
  '--color-accent-400': colors.accent[400],
  '--color-accent-500': colors.accent[500],
  '--color-accent-600': colors.accent[600],
  '--color-accent-700': colors.accent[700],
  '--color-accent-800': colors.accent[800],
  '--color-accent-900': colors.accent[900],

  // Semantic
  '--color-success': colors.success,
  '--color-warning': colors.warning,
  '--color-error': colors.error,
  '--color-info': colors.info,

  // Backgrounds
  '--color-background': colors.background,
  '--color-surface': colors.surface,
  '--color-border': colors.border,
};

// Tailwind-compatible theme object
export const tailwindTheme = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    neutral: colors.neutral,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: colors.background,
    surface: colors.surface,
    border: colors.border,
    text: colors.text,
  },
  spacing,
  borderRadius,
  fontSize: {
    xs: `${typography.fontSize.xs}px`,
    sm: `${typography.fontSize.sm}px`,
    base: `${typography.fontSize.base}px`,
    lg: `${typography.fontSize.lg}px`,
    xl: `${typography.fontSize.xl}px`,
    '2xl': `${typography.fontSize['2xl']}px`,
    '3xl': `${typography.fontSize['3xl']}px`,
    '4xl': `${typography.fontSize['4xl']}px`,
  },
};

// Export for direct use
export { colors, typography, spacing, borderRadius };
