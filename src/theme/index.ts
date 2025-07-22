/**
 * Theme configuration exports
 */

export { colors, colorTokens } from './colors';
export type { ColorToken, SemanticColor, LayoutColor, ComponentColor } from './colors';
import { colors, colorTokens } from './colors';
import type { ColorToken } from './colors';

// Helper function to get color values
export const getColor = (colorPath: string): string => {
  const pathArray = colorPath.split('.');
  let current: any = colors;
  
  for (const key of pathArray) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`Color path "${colorPath}" not found`);
      return '#000000'; // fallback color
    }
  }
  
  return current;
};

// Helper function to get color token
export const getColorToken = (token: ColorToken): string => {
  return colorTokens[token];
};
