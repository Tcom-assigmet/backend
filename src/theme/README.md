# Color Theme Configuration

This directory contains the centralized color theme configuration for the application.

## Files

- `colors.ts` - Main color definitions organized by category
- `index.ts` - Exports and utility functions
- `README.md` - This documentation file

## Usage

### Import colors directly

```typescript
import { colors, colorTokens } from '@/src/theme';

// Use specific color
const primaryColor = colors.primary[500];

// Use color token
const headerBackground = colorTokens.headerBg;
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

## Custom Colors Found in Codebase

The following hard-coded colors from the codebase have been mapped to theme colors:

- `#333446` → `colors.layout.header.background`
- `#EAEFEF` → `colors.layout.page.background`
- `#f8f9fa` → `colors.layout.sidebar.background`
- `#e1e5e9` → `colors.layout.sidebar.border`
- `#0d9488` → `colors.secondary[600]`
- `#ef4444` → `colors.semantic.error[500]`
- `#3b82f6` → `colors.semantic.info[500]`
- `#16a34a` → `colors.semantic.success[600]`

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
