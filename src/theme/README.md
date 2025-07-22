# Color Theme Configuration

This directory contains the centralized color theme configuration for the application.

## Main Color Palette
The theme is built around these four core colors:
- **#333446** - Dark blue-gray (headers, primary buttons, text)
- **#7F8CAA** - Medium blue-gray (secondary elements, borders, icons)  
- **#B8CFCE** - Light blue-green (hover states, borders, backgrounds)
- **#EAEFEF** - Very light gray (page backgrounds, cards)

## Files

- `colors.ts` - Main color definitions organized by category
- `index.ts` - Exports and utility functions
- `README.md` - This documentation file

## Usage

### Import colors directly

```typescript
import { colors, colorTokens } from '@/src/theme';

// Use main palette colors directly
const darkColor = colorTokens.darkest; // #333446
const mediumColor = colorTokens.medium; // #7F8CAA
const lightColor = colorTokens.lightMedium; // #B8CFCE
const bgColor = colorTokens.lightest; // #EAEFEF

// Use specific color from scales
const primaryColor = colors.primary[500]; // #7F8CAA

// Use layout-specific colors
const headerBackground = colorTokens.headerBg; // #333446
```

### Using utility functions

```typescript
import { getColor, getColorToken } from '@/src/theme';

// Get nested color value
const sidebarBg = getColor('layout.sidebar.background');

// Get color token
const primaryColor = getColorToken('primary');
```

### Using in components

```typescript
import { colorTokens } from '@/src/theme';

// In styled components or inline styles
const buttonStyle = {
  backgroundColor: colorTokens.secondary,
  color: colorTokens.backgroundPrimary,
};

// In Tailwind classes with CSS variables
<div style={{ backgroundColor: colorTokens.headerBg }}>
  Header content
</div>
```

## Color Categories

### Layout Colors
- `layout.header.*` - Header specific colors
- `layout.sidebar.*` - Sidebar specific colors  
- `layout.page.*` - Page background colors

### Component Colors
- `components.button.*` - Button variant colors
- `components.form.*` - Form element colors
- `components.card.*` - Card colors
- `components.progress.*` - Progress bar colors
- `components.calendar.*` - Calendar colors

### Semantic Colors
- `semantic.success.*` - Success states
- `semantic.warning.*` - Warning states
- `semantic.error.*` - Error states
- `semantic.info.*` - Info states

### Base Colors
- `primary.*` - Primary brand colors (50-900 scale)
- `secondary.*` - Secondary brand colors (50-900 scale)
- `neutral.*` - Neutral grays (50-900 scale)

## Migration from Hard-coded Colors

Replace hard-coded hex values with theme colors:

```typescript
// Before
<div className="bg-[#333446]">

// After
import { colorTokens } from '@/src/theme';
<div style={{ backgroundColor: colorTokens.headerBg }}>

// Or create a CSS variable in globals.css
<div className="bg-header"> // where .bg-header uses the theme color
```

## Main Palette Usage

The four main colors are used throughout the application:

- **#333446** (darkest) → Headers, primary buttons, main text, selected states
- **#7F8CAA** (medium) → Secondary buttons, icons, placeholder text, borders
- **#B8CFCE** (lightMedium) → Hover states, card borders, form borders, inactive states  
- **#EAEFEF** (lightest) → Page backgrounds, sidebar background, card backgrounds

## Exceptions (Non-Palette Colors)

These colors are kept for semantic purposes:
- **Error/Warning colors** → Red (`#ef4444`) and yellow for critical feedback
- **Success colors** → Green for positive feedback  
- **White** → Card backgrounds and input backgrounds

## TypeScript Support

The theme includes full TypeScript support with:

- Type definitions for all color categories
- Autocomplete for color tokens
- Type safety for color paths

```typescript
import type { ColorToken, SemanticColor } from '@/src/theme';

const getButtonColor = (variant: 'primary' | 'secondary'): ColorToken => {
  return variant === 'primary' ? 'secondary' : 'info';
};
```
