export { colors } from './colors';
export type { ColorPalette } from './colors';

export { typography } from './typography';
export type { Typography } from './typography';

export { spacing, borderRadius } from './spacing';
export type { Spacing, BorderRadius } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
} as const;

export type Theme = typeof theme;

// Web-compatible exports
export { cssVariables, tailwindTheme } from './webExport';
