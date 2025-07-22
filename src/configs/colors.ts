/**
 * Centralized Color Palette Configuration
 * 
 * This file defines the primary color palette for the application.
 * Use these colors consistently across all UI components and forms.
 */

export const colorPalette = {
  // Primary color palette
  primary: '#333446',      // Dark blue-gray
  secondary: '#7F8CAA',    // Medium blue-gray
  accent: '#B8CFCE',       // Light blue-green
  background: '#EAEFEF',   // Very light gray-blue

  // Derived colors for better UX
  primaryDark: '#2a2b3a',     // Darker version of primary
  primaryLight: '#4a4c66',    // Lighter version of primary
  secondaryDark: '#6b7890',   // Darker version of secondary
  secondaryLight: '#929fba',  // Lighter version of secondary
  accentDark: '#a3bfbe',      // Darker version of accent
  accentLight: '#d1e0df',     // Lighter version of accent

  // Utility colors
  white: '#ffffff',
  black: '#000000',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Tailwind CSS class mappings for the color palette
 */
export const tailwindColorClasses = {
  // Background classes
  bgPrimary: 'bg-primary',
  bgSecondary: 'bg-secondary',
  bgAccent: 'bg-accent',
  bgBackground: 'bg-background',
  
  // Text classes
  textPrimary: 'text-primary',
  textSecondary: 'text-secondary',
  textAccent: 'text-accent',
  
  // Border classes
  borderPrimary: 'border-primary',
  borderSecondary: 'border-secondary',
  borderAccent: 'border-accent',
  
  // Hover states
  hoverBgPrimary: 'hover:bg-primary',
  hoverBgSecondary: 'hover:bg-secondary',
  hoverBgAccent: 'hover:bg-accent',
} as const;

export type TailwindColorClass = keyof typeof tailwindColorClasses;
