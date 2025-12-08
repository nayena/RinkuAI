/**
 * Rinku AI Color Palette
 * Soft, calming colors designed for accessibility
 */
export const colors = {
  // Backgrounds
  background: '#E8E4F3',      // Soft lavender
  card: '#FFFFFF',            // White cards
  cardAlt: '#F5F3FA',         // Slightly tinted card
  photoBackground: '#A8B4C4', // Muted blue-gray for photos

  // Accent colors
  primary: '#7C6FA0',         // Purple accent
  primaryLight: '#9D8FC4',    // Lighter purple
  accent: '#D4A853',          // Warm gold/yellow
  accentLight: '#E8D4A0',     // Light yellow for buttons

  // Text colors
  textPrimary: '#2D2A3E',     // Dark purple-gray
  textSecondary: '#6B6880',   // Muted text
  textMuted: '#9994A8',       // Very muted
  textOnAccent: '#4A4035',    // Text on yellow buttons

  // UI elements
  border: '#D8D4E8',          // Soft border
  shadow: 'rgba(124, 111, 160, 0.15)', // Purple-tinted shadow
  
  // Status
  success: '#6BAF8D',
  error: '#C97B7B',
  listening: '#7C6FA0',
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

