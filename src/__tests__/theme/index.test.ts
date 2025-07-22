import { 
  THEME, 
  COMPONENT_STYLES, 
  getThemeColor, 
  getComponentStyle,
  createStyles 
} from '@/theme';

describe('Theme', () => {
  describe('THEME object', () => {
    it('should have all required color properties', () => {
      expect(THEME.colors.primary).toBe('#0f766e');
      expect(THEME.colors.primaryLight).toBe('#f0fdfa');
      expect(THEME.colors.secondary).toBe('#7F8CAA');
      expect(THEME.colors.success).toBe('#059669');
      expect(THEME.colors.background).toBe('#ffffff');
      expect(THEME.colors.text).toBe('#1f2937');
    });

    it('should have nested color objects', () => {
      expect(THEME.colors.sidebar).toBeDefined();
      expect(THEME.colors.sidebar.background).toBe('#f8f9fa');
      expect(THEME.colors.sidebar.textActive).toBe('#0078d4');
      
      expect(THEME.colors.header).toBeDefined();
      expect(THEME.colors.header.background).toBe('#333446');
      expect(THEME.colors.header.text).toBe('#ffffff');
    });

    it('should have spacing values', () => {
      expect(THEME.spacing.xs).toBe('0.25rem');
      expect(THEME.spacing.sm).toBe('0.5rem');
      expect(THEME.spacing.lg).toBe('1rem');
      expect(THEME.spacing.xl).toBe('1.5rem');
    });

    it('should have font sizes', () => {
      expect(THEME.fontSize.xs).toBe('0.75rem');
      expect(THEME.fontSize.sm).toBe('0.875rem');
      expect(THEME.fontSize.base).toBe('1rem');
      expect(THEME.fontSize.xl).toBe('1.25rem');
    });

    it('should have border radius values', () => {
      expect(THEME.borderRadius.none).toBe('0');
      expect(THEME.borderRadius.md).toBe('0.375rem');
      expect(THEME.borderRadius.lg).toBe('0.5rem');
      expect(THEME.borderRadius.full).toBe('9999px');
    });

    it('should have shadow definitions', () => {
      expect(THEME.shadows.sm).toBeDefined();
      expect(THEME.shadows.md).toBeDefined();
      expect(THEME.shadows.lg).toBeDefined();
      expect(typeof THEME.shadows.sm).toBe('string');
    });

    it('should have z-index values', () => {
      expect(THEME.zIndex.dropdown).toBe(1000);
      expect(THEME.zIndex.modal).toBe(1050);
      expect(THEME.zIndex.tooltip).toBe(1200);
    });
  });

  describe('COMPONENT_STYLES', () => {
    it('should have card styles', () => {
      expect(COMPONENT_STYLES.card.base).toBeDefined();
      expect(COMPONENT_STYLES.card.base.backgroundColor).toBe(THEME.colors.card.background);
      expect(COMPONENT_STYLES.card.base.borderColor).toBe(THEME.colors.card.border);
    });

    it('should have button styles', () => {
      expect(COMPONENT_STYLES.button.primary).toBeDefined();
      expect(COMPONENT_STYLES.button.primary.backgroundColor).toBe(THEME.colors.button.primary);
      expect(COMPONENT_STYLES.button.secondary).toBeDefined();
    });

    it('should have form styles', () => {
      expect(COMPONENT_STYLES.form.input).toBeDefined();
      expect(COMPONENT_STYLES.form.label).toBeDefined();
      expect(COMPONENT_STYLES.form.input.backgroundColor).toBe(THEME.colors.form.background);
    });

    it('should have sidebar styles', () => {
      expect(COMPONENT_STYLES.sidebar.container).toBeDefined();
      expect(COMPONENT_STYLES.sidebar.item.base).toBeDefined();
      expect(COMPONENT_STYLES.sidebar.item.active).toBeDefined();
      expect(COMPONENT_STYLES.sidebar.item.hover).toBeDefined();
    });
  });

  describe('getThemeColor', () => {
    it('should return correct color for simple path', () => {
      expect(getThemeColor('primary')).toBe('#0f766e');
      expect(getThemeColor('secondary')).toBe('#7F8CAA');
      expect(getThemeColor('background')).toBe('#ffffff');
    });

    it('should return correct color for nested path', () => {
      expect(getThemeColor('sidebar.background')).toBe('#f8f9fa');
      expect(getThemeColor('sidebar.textActive')).toBe('#0078d4');
      expect(getThemeColor('header.background')).toBe('#333446');
      expect(getThemeColor('card.background')).toBe('#ffffff');
    });

    it('should return default color for invalid path', () => {
      expect(getThemeColor('nonexistent')).toBe('#000000');
      expect(getThemeColor('sidebar.nonexistent')).toBe('#000000');
      expect(getThemeColor('deeply.nested.nonexistent.path')).toBe('#000000');
    });

    it('should handle empty string', () => {
      expect(getThemeColor('')).toBe('#000000');
    });

    it('should handle paths with extra dots', () => {
      expect(getThemeColor('sidebar..background')).toBe('#000000');
      expect(getThemeColor('.primary')).toBe('#000000');
    });
  });

  describe('getComponentStyle', () => {
    it('should return base style when no variant specified', () => {
      const cardStyle = getComponentStyle('card');
      expect(cardStyle).toEqual(COMPONENT_STYLES.card.base);
    });

    it('should return specific variant style when variant specified', () => {
      const primaryButtonStyle = getComponentStyle('button', 'primary');
      expect(primaryButtonStyle).toEqual(COMPONENT_STYLES.button.primary);

      const secondaryButtonStyle = getComponentStyle('button', 'secondary');
      expect(secondaryButtonStyle).toEqual(COMPONENT_STYLES.button.secondary);
    });

    it('should return empty object for nonexistent component', () => {
      const nonexistentStyle = getComponentStyle('nonexistent');
      expect(nonexistentStyle).toEqual({});
    });

    it('should return empty object for nonexistent variant', () => {
      const nonexistentVariant = getComponentStyle('button', 'nonexistent');
      expect(nonexistentVariant).toEqual({});
    });

    it('should handle form component styles', () => {
      const formInputStyle = getComponentStyle('form', 'input');
      expect(formInputStyle).toEqual(COMPONENT_STYLES.form.input);

      const formLabelStyle = getComponentStyle('form', 'label');
      expect(formLabelStyle).toEqual(COMPONENT_STYLES.form.label);
    });

    it('should handle sidebar component styles', () => {
      const sidebarContainerStyle = getComponentStyle('sidebar', 'container');
      expect(sidebarContainerStyle).toEqual(COMPONENT_STYLES.sidebar.container);

      const sidebarItemStyle = getComponentStyle('sidebar', 'item');
      expect(sidebarItemStyle).toEqual(COMPONENT_STYLES.sidebar.item);
    });
  });

  describe('createStyles', () => {
    it('should return the same object passed to it', () => {
      const testStyles = {
        container: {
          padding: '1rem',
          margin: '0.5rem',
        },
        button: {
          backgroundColor: '#blue',
          color: 'white',
        },
      };

      const result = createStyles(testStyles);
      expect(result).toEqual(testStyles);
      expect(result).toBe(testStyles); // Should be the same reference
    });

    it('should handle empty object', () => {
      const result = createStyles({});
      expect(result).toEqual({});
    });

    it('should handle nested objects', () => {
      const nestedStyles = {
        parent: {
          child: {
            grandchild: {
              property: 'value',
            },
          },
        },
      };

      const result = createStyles(nestedStyles);
      expect(result).toEqual(nestedStyles);
    });
  });

  describe('theme consistency', () => {
    it('should use theme colors in component styles', () => {
      expect(COMPONENT_STYLES.card.base.backgroundColor).toBe(THEME.colors.card.background);
      expect(COMPONENT_STYLES.button.primary.backgroundColor).toBe(THEME.colors.button.primary);
      expect(COMPONENT_STYLES.form.input.backgroundColor).toBe(THEME.colors.form.background);
    });

    it('should use theme spacing in component styles', () => {
      expect(COMPONENT_STYLES.form.input.padding).toBe(THEME.spacing.sm);
      expect(COMPONENT_STYLES.card.header.padding).toBe(THEME.spacing.lg);
    });

    it('should use theme typography in component styles', () => {
      expect(COMPONENT_STYLES.button.primary.fontSize).toBe(THEME.fontSize.sm);
      expect(COMPONENT_STYLES.table.cell.fontSize).toBe(THEME.fontSize.sm);
    });
  });
});