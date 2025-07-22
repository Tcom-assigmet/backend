/**
 * Centralized color theme configuration
 * This file contains all colors used throughout the application
 */

export const colors = {
  // Base colors (from global CSS)
  base: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },

  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Primary blue
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Secondary colors (teal - heavily used in the app)
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488', // Main teal color used in buttons
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
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

  // Neutral colors (grays)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Layout specific colors
  layout: {
    // Header colors
    header: {
      background: '#333446', // Dark header background
      text: '#ffffff',
      textSecondary: '#f3f4f6',
      border: '#e5e7eb',
      searchBorder: '#e5e7eb',
      searchFocus: '#14b8a6',
      notificationDot: '#ef4444',
      avatar: '#0d9488',
    },

    // Sidebar colors
    sidebar: {
      background: '#f8f9fa', // Light sidebar background
      border: '#e1e5e9',
      text: '#323130',
      textSecondary: '#605e5c',
      textMuted: '#605e5c',
      hover: '#f3f2f1',
      active: '#deecf9',
      activeText: '#0078d4',
      iconColor: '#605e5c',
    },

    // Page background
    page: {
      background: '#EAEFEF', // Main page background
      backgroundAlt: '#f9fafb',
      backgroundSecondary: '#f3f4f6',
    },
  },

  // Component specific colors
  components: {
    // Button colors
    button: {
      primary: {
        background: '#0d9488',
        backgroundHover: '#0f766e',
        text: '#ffffff',
      },
      secondary: {
        background: '#3b82f6',
        backgroundHover: '#2563eb',
        text: '#ffffff',
      },
      error: {
        background: '#ef4444',
        backgroundHover: '#dc2626',
        text: '#ffffff',
      },
      outline: {
        background: 'transparent',
        backgroundHover: '#f9fafb',
        border: '#d1d5db',
        text: '#374151',
      },
      ghost: {
        background: 'transparent',
        backgroundHover: '#f3f4f6',
        text: '#374151',
      },
      disabled: {
        background: '#d1d5db',
        text: '#9ca3af',
      },
    },

    // Form colors
    form: {
      input: {
        background: '#ffffff',
        border: '#d1d5db',
        borderFocus: '#3b82f6',
        text: '#111827',
        placeholder: '#9ca3af',
      },
      select: {
        background: '#ffffff',
        backgroundHover: '#f9fafb',
        backgroundFocus: '#eff6ff',
        border: '#d1d5db',
        text: '#111827',
      },
      label: {
        text: '#374151',
        required: '#ef4444',
      },
    },

    // Card colors
    card: {
      background: '#ffffff',
      border: '#e5e7eb',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },

    // Progress bar colors
    progress: {
      background: '#e5e7eb',
      fill: '#0d9488',
    },

    // Calendar colors
    calendar: {
      selected: '#16a34a',
      selectedHover: '#15803d',
      selectedText: '#ffffff',
      today: '#15803d',
      todayBackground: '#dcfce7',
      year: '#16a34a',
      yearBackground: '#bbf7d0',
    },
  },
} as const;

// Color tokens for easy access
export const colorTokens = {
  // Primary colors
  primary: colors.primary[500],
  primaryHover: colors.primary[600],
  primaryLight: colors.primary[100],
  primaryDark: colors.primary[700],

  // Secondary colors
  secondary: colors.secondary[600],
  secondaryHover: colors.secondary[700],
  secondaryLight: colors.secondary[100],
  secondaryDark: colors.secondary[800],

  // Semantic colors
  success: colors.semantic.success[600],
  successLight: colors.semantic.success[100],
  warning: colors.semantic.warning[500],
  warningLight: colors.semantic.warning[100],
  error: colors.semantic.error[500],
  errorLight: colors.semantic.error[100],
  info: colors.semantic.info[500],
  infoLight: colors.semantic.info[100],

  // Layout colors
  headerBg: colors.layout.header.background,
  sidebarBg: colors.layout.sidebar.background,
  pageBg: colors.layout.page.background,

  // Text colors
  textPrimary: colors.neutral[900],
  textSecondary: colors.neutral[600],
  textMuted: colors.neutral[500],
  textLight: colors.neutral[400],

  // Background colors
  backgroundPrimary: colors.base.white,
  backgroundSecondary: colors.neutral[50],
  backgroundTertiary: colors.neutral[100],

  // Border colors
  borderPrimary: colors.neutral[200],
  borderSecondary: colors.neutral[300],
  borderLight: colors.neutral[100],
} as const;

export type ColorToken = keyof typeof colorTokens;
export type SemanticColor = keyof typeof colors.semantic;
export type LayoutColor = keyof typeof colors.layout;
export type ComponentColor = keyof typeof colors.components;
