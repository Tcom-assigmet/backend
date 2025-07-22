# Color Palette Implementation Guide

This document outlines the implementation of the centralized color palette for the EQS application.

## Color Palette

The application now uses a consistent color palette defined in a single location:

### Primary Colors
- **Primary (#333446)**: Dark blue-gray - Used for headers, primary buttons, and key UI elements
- **Secondary (#7F8CAA)**: Medium blue-gray - Used for secondary buttons and less prominent elements  
- **Accent (#B8CFCE)**: Light blue-green - Used for highlights, success states, and accent elements
- **Background (#EAEFEF)**: Very light gray-blue - Used as the main background color

## Implementation

### 1. Centralized Configuration
The color palette is defined in `src/configs/colors.ts` which provides:
- Color constants with hex values
- Utility functions for color manipulation
- TypeScript types for color usage
- Tailwind CSS class mappings

### 2. CSS Custom Properties
Colors are implemented as CSS custom properties in `src/app/globals.css`:
- Uses OKLCH color format for better color accuracy
- Supports both light and dark modes
- Integrated with Tailwind CSS v4

### 3. Tailwind CSS Integration
Colors are available as Tailwind CSS classes:
- bg-primary - Primary background
- text-foreground - Main text color
- border-border - Standard border color
- bg-card - Card background
- And many more semantic color tokens

## Benefits

1. **Consistency**: All UI elements now use the same color palette
2. **Maintainability**: Colors are defined in one place
3. **Theme Support**: Easy to switch between light and dark modes
4. **Accessibility**: Better color contrast and consistency
5. **Brand Alignment**: Colors reflect the application's visual identity

