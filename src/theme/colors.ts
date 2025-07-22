/**
 * Centralized color theme configuration
 * This file contains all colors used throughout the application
 * Main color palette: #333446, #7F8CAA, #B8CFCE, #EAEFEF
 */

export const colors = {
  // Base colors
  base: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },

  // Primary brand colors - Based on #333446 (dark blue-gray)
  primary: {
    50: '#f8f9fa',
    100: '#e9ecef',
    200: '#dee2e6',
    300: '#ced4da',
    400: '#adb5bd',
    500: '#7F8CAA', // Medium blue-gray from palette
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#333446', // Main dark color from palette
  },

  // Secondary colors - Based on #B8CFCE (light blue-green)
  secondary: {
    50: '#f0f4f4',
    100: '#e6eeee',
    200: '#d4e2e1',
    300: '#B8CFCE', // Light blue-green from palette
    400: '#a5bfbd',
    500: '#92afad',
    600: '#7f9f9c',
    700: '#6c8f8b',
    800: '#597f7a',
    900: '#466f69',
  },

  // Semantic colors
  semantic: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a', // Success green used in calendar
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Error red used throughout
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Info blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },

  // Neutral colors - Based on palette colors with variations
  neutral: {
    50: '#EAEFEF', // Lightest color from palette
    100: '#e0e7e7',
    200: '#d6dfdf',
    300: '#ccd7d7',
    400: '#B8CFCE', // Light blue-green from palette
    500: '#a4bbba',
    600: '#90a7a6',
    700: '#7c9392',
    800: '#687f7e',
    900: '#333446', // Darkest color from palette
  },

  // Layout specific colors - Using main palette
  layout: {
    // Header colors
    header: {
      background: '#333446', // Dark color from palette
      text: '#EAEFEF', // Light color from palette
      textSecondary: '#B8CFCE', // Light blue-green from palette
      border: '#7F8CAA', // Medium color from palette
      searchBorder: '#B8CFCE',
      searchFocus: '#7F8CAA',
      notificationDot: '#ef4444', // Exception - keeping red for notifications
      avatar: '#7F8CAA', // Medium color from palette
    },

    // Sidebar colors
    sidebar: {
      background: '#EAEFEF', // Light color from palette
      border: '#B8CFCE', // Light blue-green from palette
      text: '#333446', // Dark color from palette
      textSecondary: '#7F8CAA', // Medium color from palette
      textMuted: '#7F8CAA',
      hover: '#B8CFCE',
      active: '#7F8CAA',
      activeText: '#333446',
      iconColor: '#7F8CAA',
    },

    // Page background
    page: {
      background: '#EAEFEF', // Main light color from palette
      backgroundAlt: '#B8CFCE', // Light blue-green from palette
      backgroundSecondary: '#7F8CAA', // Medium color from palette
    },
  },

  // Component specific colors - Using main palette
  components: {
    // Button colors
    button: {
      primary: {
        background: '#333446', // Dark color from palette
        backgroundHover: '#7F8CAA', // Medium color from palette
        text: '#EAEFEF', // Light color from palette
      },
      secondary: {
        background: '#7F8CAA', // Medium color from palette
        backgroundHover: '#333446', // Dark color from palette
        text: '#EAEFEF', // Light color from palette
      },
      error: {
        background: '#ef4444', // Exception - keeping red for errors
        backgroundHover: '#dc2626',
        text: '#ffffff',
      },
      outline: {
        background: 'transparent',
        backgroundHover: '#B8CFCE', // Light blue-green from palette
        border: '#7F8CAA', // Medium color from palette
        text: '#333446', // Dark color from palette
      },
      ghost: {
        background: 'transparent',
        backgroundHover: '#B8CFCE', // Light blue-green from palette
        text: '#333446', // Dark color from palette
      },
      disabled: {
        background: '#B8CFCE', // Light blue-green from palette
        text: '#7F8CAA', // Medium color from palette
      },
    },

    // Form colors
    form: {
      input: {
        background: '#ffffff',
        border: '#B8CFCE', // Light blue-green from palette
        borderFocus: '#7F8CAA', // Medium color from palette
        text: '#333446', // Dark color from palette
        placeholder: '#7F8CAA', // Medium color from palette
      },
      select: {
        background: '#ffffff',
        backgroundHover: '#EAEFEF', // Light color from palette
        backgroundFocus: '#B8CFCE', // Light blue-green from palette
        border: '#B8CFCE', // Light blue-green from palette
        text: '#333446', // Dark color from palette
      },
      label: {
        text: '#333446', // Dark color from palette
        required: '#ef4444', // Exception - keeping red for required fields
      },
    },

    // Card colors
    card: {
      background: '#ffffff',
      border: '#B8CFCE', // Light blue-green from palette
      shadow: 'rgba(51, 52, 70, 0.1)', // Using dark color with opacity
    },

    // Progress bar colors
    progress: {
      background: '#B8CFCE', // Light blue-green from palette
      fill: '#333446', // Dark color from palette
    },

    // Calendar colors
    calendar: {
      selected: '#333446', // Dark color from palette
      selectedHover: '#7F8CAA', // Medium color from palette
      selectedText: '#EAEFEF', // Light color from palette
      today: '#7F8CAA', // Medium color from palette
      todayBackground: '#B8CFCE', // Light blue-green from palette
      year: '#333446', // Dark color from palette
      yearBackground: '#B8CFCE', // Light blue-green from palette
    },
  },
} as const;

// Color tokens for easy access - Using main palette
export const colorTokens = {
  // Main palette colors
  darkest: '#333446', // Primary dark color
  medium: '#7F8CAA', // Medium blue-gray  
  lightMedium: '#B8CFCE', // Light blue-green
  lightest: '#EAEFEF', // Lightest color

  // Primary colors based on palette
  primary: colors.primary[500], // #7F8CAA
  primaryHover: colors.primary[900], // #333446
  primaryLight: colors.neutral[50], // #EAEFEF
  primaryDark: colors.primary[900], // #333446

  // Secondary colors based on palette
  secondary: colors.secondary[300], // #B8CFCE
  secondaryHover: colors.secondary[700], // darker variation
  secondaryLight: colors.neutral[50], // #EAEFEF
  secondaryDark: colors.secondary[900],

  // Semantic colors (exceptions kept for warnings/errors)
  success: colors.semantic.success[600],
  successLight: colors.semantic.success[100],
  warning: colors.semantic.warning[500],
  warningLight: colors.semantic.warning[100],
  error: colors.semantic.error[500],
  errorLight: colors.semantic.error[100],
  info: colors.semantic.info[500],
  infoLight: colors.semantic.info[100],

  // Layout colors using main palette
  headerBg: '#333446', // Dark from palette
  sidebarBg: '#EAEFEF', // Light from palette
  pageBg: '#EAEFEF', // Light from palette

  // Text colors using main palette
  textPrimary: '#333446', // Dark from palette
  textSecondary: '#7F8CAA', // Medium from palette
  textMuted: '#7F8CAA', // Medium from palette
  textLight: '#B8CFCE', // Light blue-green from palette

  // Background colors using main palette
  backgroundPrimary: colors.base.white,
  backgroundSecondary: '#EAEFEF', // Light from palette
  backgroundTertiary: '#B8CFCE', // Light blue-green from palette

  // Border colors using main palette
  borderPrimary: '#B8CFCE', // Light blue-green from palette
  borderSecondary: '#7F8CAA', // Medium from palette
  borderLight: '#EAEFEF', // Light from palette
} as const;

export type ColorToken = keyof typeof colorTokens;
export type SemanticColor = keyof typeof colors.semantic;
export type LayoutColor = keyof typeof colors.layout;
export type ComponentColor = keyof typeof colors.components;
