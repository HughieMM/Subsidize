/**
 * Ocean/Sargasso-inspired color palette
 *
 * Deep blues with hints of teal and turquoise, reminiscent of the Sargasso Sea.
 * Warm accents for deals and highlights.
 */

export const colors = {
  // Primary - Deep ocean blues
  primary: {
    50: '#E6F3F7',
    100: '#CCE7EF',
    200: '#99CFE0',
    300: '#66B7D0',
    400: '#339FC1',
    500: '#0087B1', // Main brand color - deep ocean blue
    600: '#006C8E',
    700: '#00516B',
    800: '#003647',
    900: '#001B24',
  },

  // Secondary - Sargasso teal
  secondary: {
    50: '#E6F7F4',
    100: '#CCEFE9',
    200: '#99DFD3',
    300: '#66CFBD',
    400: '#33BFA7',
    500: '#00AF91', // Sargasso teal
    600: '#008C74',
    700: '#006957',
    800: '#00463A',
    900: '#00231D',
  },

  // Accent - Warm coral for deals
  accent: {
    50: '#FFF0EC',
    100: '#FFE1D9',
    200: '#FFC3B3',
    300: '#FFA58D',
    400: '#FF8767',
    500: '#FF6941', // Warm coral
    600: '#CC5434',
    700: '#993F27',
    800: '#662A1A',
    900: '#33150D',
  },

  // Neutral - Cool grays
  neutral: {
    50: '#F8FAFB',
    100: '#F1F5F7',
    200: '#E3EBEF',
    300: '#D5E1E7',
    400: '#C7D7DF',
    500: '#B9CDD7',
    600: '#94A4AC',
    700: '#6F7B81',
    800: '#4A5256',
    900: '#25292B',
  },

  // Semantic colors
  success: '#00C853', // Green for savings
  warning: '#FFB300', // Amber for alerts
  error: '#D32F2F', // Red for errors
  info: '#0288D1', // Info blue

  // UI colors
  background: '#FFFFFF',
  surface: '#F8FAFB',
  border: '#E3EBEF',

  // Text
  text: {
    primary: '#001B24',
    secondary: '#4A5256',
    tertiary: '#94A4AC',
    inverse: '#FFFFFF',
  },

  // Special
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export type ColorPalette = typeof colors;
