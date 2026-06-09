import { Platform } from 'react-native';

// Legacy Neo-Brutalist theme (kept to prevent breaking other screens immediately)
export const colors = {
  background: '#FAF9F6', // Warm off-white/cream
  surface: '#FFFFFF',    // Pure white for card surfaces
  primary: '#FF5757',    // Neo brutalist Red (GoFood)
  secondary: '#39FF14',  // Neo brutalist Green (GoRide)
  accent: '#FFDE4D',     // Neo brutalist Yellow (Wallet & Ratings)
  border: '#000000',     // Thick black borders
  text: '#000000',       // High contrast text
};

export const neoBrutalism = {
  borderWidth: 3,
  borderColor: '#000000',
  borderRadius: 8,
  shadowColor: '#000000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 5, // Android shadows
};

export const typography = {
  header: {
    fontSize: 28,
    fontWeight: '900' as const,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Heavy' : 'sans-serif-medium',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  body: {
    fontSize: 14,
    color: '#000000',
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
};

// ==========================================
// NEW FURAP GLASSMORPHISM DESIGN SYSTEM
// ==========================================

export const furapColors = {
  background: '#FBF9F9',
  surface: '#FFFFFF',
  primary: '#1A1A1A',          // Elegant Dark
  onPrimary: '#FFFFFF',
  secondary: '#5D5F5F',        // Muted Grey
  onSecondary: '#FFFFFF',
  neutral: '#717171',          // Info/Metadata
  border: 'rgba(255, 255, 255, 0.7)',
  error: '#BA1A1A',
  accent: '#FFC72C', // Gold accent for ratings and highlight tags
  
  // Glass variants
  glassBg: 'rgba(255, 255, 255, 0.45)',
  glassBorder: 'rgba(255, 255, 255, 0.65)',
  glassInputBg: 'rgba(255, 255, 255, 0.5)',
  glassInputBorder: 'rgba(26, 26, 26, 0.15)',
};

export const furapTypography = {
  displayLg: {
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Bold' : 'sans-serif-condensed',
    fontSize: 36,
    fontWeight: '700' as const,
    color: furapColors.primary,
    letterSpacing: -0.8,
  },
  headlineMd: {
    fontFamily: Platform.OS === 'ios' ? 'Manrope-SemiBold' : 'sans-serif-medium',
    fontSize: 22,
    fontWeight: '600' as const,
    color: furapColors.primary,
    letterSpacing: -0.4,
  },
  bodyLg: {
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Regular' : 'sans-serif',
    fontSize: 18,
    fontWeight: '400' as const,
    color: furapColors.primary,
  },
  bodyMd: {
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Regular' : 'sans-serif',
    fontSize: 15,
    fontWeight: '400' as const,
    color: furapColors.secondary,
  },
  labelSm: {
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Bold' : 'sans-serif-medium',
    fontSize: 12,
    fontWeight: '600' as const,
    color: furapColors.neutral,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  buttonText: {
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Bold' : 'sans-serif-medium',
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
};

export const furapGlass = {
  card: {
    backgroundColor: furapColors.glassBg,
    borderColor: furapColors.glassBorder,
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1.05,
    shadowRadius: 40,
    elevation: 1,
  },
  input: {
    backgroundColor: furapColors.glassInputBg,
    borderColor: furapColors.glassInputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: furapColors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Manrope-Regular' : 'sans-serif',
  },
  buttonPrimary: {
    backgroundColor: furapColors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(26, 26, 26, 0.1)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};
