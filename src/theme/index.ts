// Centralized Theme Configuration
export const THEME = {
  colors: {
    // Primary colors
    primary: "#0f766e", // teal-700
    primaryLight: "#f0fdfa", // teal-50
    primaryDark: "#134e4a", // teal-800
    
    // Secondary colors
    secondary: "#7F8CAA", // blue-gray
    secondaryLight: "#f8fafc", // slate-50
    
    // Accent colors
    accent: "#B8CFCE", // teal-200
    accentLight: "#ccfbf1", // teal-100
    
    // Status colors
    success: "#059669", // green-600
    successLight: "#dcfce7", // green-50
    warning: "#d97706", // amber-600
    warningLight: "#fef3c7", // amber-50
    error: "#dc2626", // red-600
    errorLight: "#fef2f2", // red-50
    info: "#0078d4", // blue-600
    infoLight: "#dbeafe", // blue-50
    
    // Background colors
    background: "#ffffff",
    backgroundGray: "#f8f9fa",
    backgroundLight: "#EAEFEF",
    backgroundDark: "#333446",
    
    // Text colors
    text: "#1f2937", // gray-800
    textMuted: "#6b7280", // gray-500
    textLight: "#9ca3af", // gray-400
    textDark: "#111827", // gray-900
    textWhite: "#ffffff",
    
    // Border colors
    border: "#e5e7eb", // gray-200
    borderLight: "#f3f4f6", // gray-100
    borderMuted: "#e1e5e9",
    
    // Layout specific colors
    sidebar: {
      background: "#f8f9fa",
      border: "#e1e5e9",
      textActive: "#0078d4",
      textMuted: "#605e5c",
      textHover: "#323130",
      backgroundActive: "#deecf9",
      backgroundHover: "#f3f2f1",
    },
    
    header: {
      background: "#333446",
      text: "#ffffff",
      textMuted: "#9ca3af",
    },
    
    // Chart colors (for dashboard)
    chart: {
      primary: "#475569", // slate-600
      secondary: "#64748b", // slate-500
      tertiary: "#94a3b8", // slate-400
      quaternary: "#cbd5e1", // slate-300
      background: "#f1f5f9", // slate-100
    },
    
    // Component specific colors
    card: {
      background: "#ffffff",
      border: "#e5e7eb",
      shadow: "rgba(0, 0, 0, 0.1)",
    },
    
    button: {
      primary: "#0f766e",
      primaryHover: "#134e4a",
      secondary: "#6b7280",
      secondaryHover: "#4b5563",
    },
    
    form: {
      background: "#ffffff",
      border: "#d1d5db",
      borderFocus: "#0f766e",
      placeholder: "#9ca3af",
    },
  },
  
  spacing: {
    xs: "0.25rem",  // 4px
    sm: "0.5rem",   // 8px
    md: "0.75rem",  // 12px
    lg: "1rem",     // 16px
    xl: "1.5rem",   // 24px
    "2xl": "2rem",  // 32px
    "3xl": "3rem",  // 48px
    "4xl": "4rem",  // 64px
  },
  
  borderRadius: {
    none: "0",
    sm: "0.125rem",   // 2px
    md: "0.375rem",   // 6px
    lg: "0.5rem",     // 8px
    xl: "0.75rem",    // 12px
    "2xl": "1rem",    // 16px
    full: "9999px",
  },
  
  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    popover: 1100,
    tooltip: 1200,
    toast: 1300,
  },
} as const;

// Pre-defined component styles using the theme
export const COMPONENT_STYLES = {
  card: {
    base: {
      backgroundColor: THEME.colors.card.background,
      borderColor: THEME.colors.card.border,
      borderRadius: THEME.borderRadius.lg,
      boxShadow: THEME.shadows.sm,
    },
    header: {
      backgroundColor: THEME.colors.primaryLight,
      borderBottomColor: THEME.colors.accent,
      padding: THEME.spacing.lg,
    },
    body: {
      padding: THEME.spacing.lg,
    },
  },
  
  button: {
    primary: {
      backgroundColor: THEME.colors.button.primary,
      color: THEME.colors.textWhite,
      borderRadius: THEME.borderRadius.md,
      padding: `${THEME.spacing.sm} ${THEME.spacing.lg}`,
      fontSize: THEME.fontSize.sm,
      fontWeight: THEME.fontWeight.medium,
      hover: {
        backgroundColor: THEME.colors.button.primaryHover,
      },
    },
    secondary: {
      backgroundColor: THEME.colors.button.secondary,
      color: THEME.colors.textWhite,
      borderRadius: THEME.borderRadius.md,
      padding: `${THEME.spacing.sm} ${THEME.spacing.lg}`,
      fontSize: THEME.fontSize.sm,
      fontWeight: THEME.fontWeight.medium,
      hover: {
        backgroundColor: THEME.colors.button.secondaryHover,
      },
    },
  },
  
  form: {
    input: {
      backgroundColor: THEME.colors.form.background,
      borderColor: THEME.colors.form.border,
      borderRadius: THEME.borderRadius.md,
      padding: THEME.spacing.sm,
      fontSize: THEME.fontSize.sm,
      focus: {
        borderColor: THEME.colors.form.borderFocus,
        outline: `2px solid ${THEME.colors.primaryLight}`,
      },
    },
    label: {
      fontSize: THEME.fontSize.sm,
      fontWeight: THEME.fontWeight.medium,
      color: THEME.colors.text,
      marginBottom: THEME.spacing.xs,
    },
  },
  
  sidebar: {
    container: {
      backgroundColor: THEME.colors.sidebar.background,
      borderColor: THEME.colors.sidebar.border,
      width: "16rem", // 256px
    },
    item: {
      base: {
        padding: `${THEME.spacing.sm} ${THEME.spacing.md}`,
        borderRadius: THEME.borderRadius.md,
        fontSize: THEME.fontSize.sm,
        color: THEME.colors.sidebar.textMuted,
        cursor: "pointer",
        transition: "all 0.2s",
      },
      active: {
        backgroundColor: THEME.colors.sidebar.backgroundActive,
        color: THEME.colors.sidebar.textActive,
      },
      hover: {
        backgroundColor: THEME.colors.sidebar.backgroundHover,
        color: THEME.colors.sidebar.textHover,
      },
    },
  },
  
  header: {
    container: {
      backgroundColor: THEME.colors.header.background,
      borderBottomColor: THEME.colors.border,
      height: "4rem", // 64px
      padding: `0 ${THEME.spacing.xl}`,
    },
    title: {
      fontSize: THEME.fontSize.xl,
      fontWeight: THEME.fontWeight.bold,
      color: THEME.colors.header.text,
    },
  },
  
  table: {
    cell: {
      padding: THEME.spacing.md,
      fontSize: THEME.fontSize.sm,
      borderBottomColor: THEME.colors.borderLight,
    },
    header: {
      backgroundColor: THEME.colors.backgroundGray,
      fontWeight: THEME.fontWeight.semibold,
      color: THEME.colors.text,
    },
  },
} as const;

// Utility functions for theme usage
export const getThemeColor = (colorPath: string): string => {
  const keys = colorPath.split('.');
  let value: any = THEME.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return typeof value === 'string' ? value : '#000000';
};

export const getComponentStyle = (component: string, variant?: string) => {
  const componentStyles = (COMPONENT_STYLES as any)[component];
  if (!componentStyles) return {};
  
  if (variant) {
    if (componentStyles[variant]) {
      return componentStyles[variant];
    }
    // Return empty object if variant doesn't exist
    return {};
  }
  
  return componentStyles.base || componentStyles;
};

// CSS-in-JS helper for creating style objects
export const createStyles = (styles: Record<string, any>) => styles;

// Type definitions for theme
export type ThemeColors = typeof THEME.colors;
export type ThemeSpacing = typeof THEME.spacing;
export type ThemeBorderRadius = typeof THEME.borderRadius;
export type ThemeFontSize = typeof THEME.fontSize;
export type ComponentStylesType = typeof COMPONENT_STYLES;