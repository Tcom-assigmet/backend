export const THEME = {
  colors: {
    primary: "#0f766e", // teal-700
    primaryLight: "#f0fdfa", // teal-50
    secondary: "#7F8CAA", // blue-gray
    accent: "#B8CFCE", // teal-200
    success: "#059669", // green-600
    background: "#ffffff",
    text: "#1f2937", // gray-800
    textMuted: "#6b7280", // gray-500
    border: "#e5e7eb", // gray-200
    borderLight: "#f3f4f6", // gray-100
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
  },
  typography: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },
} as const

export const STYLES = {
  card: {
    borderColor: THEME.colors.accent,
    backgroundColor: THEME.colors.background,
    borderRadius: "12px",
    overflow: "hidden" as const,
  },
  cardHeader: {
    backgroundColor: THEME.colors.primaryLight,
    borderBottomColor: THEME.colors.accent,
  },
  tableCell: {
    fontSize: THEME.typography.sm,
    padding: THEME.spacing.lg,
  },
} as const


