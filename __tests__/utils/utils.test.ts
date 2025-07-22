import { cn } from '@/src/lib/utils';

describe('utils', () => {
  describe('cn (className utility)', () => {
    it('should merge simple class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
    });

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid');
    });

    it('should handle empty string', () => {
      expect(cn('base', '', 'valid')).toBe('base valid');
    });

    it('should merge Tailwind conflicting classes correctly', () => {
      // twMerge should resolve conflicting Tailwind classes
      expect(cn('px-2 px-4')).toBe('px-4');
      expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500');
    });

    it('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });

    it('should handle objects with boolean values', () => {
      expect(cn({
        'base': true,
        'conditional': true,
        'hidden': false,
      })).toBe('base conditional');
    });

    it('should handle mixed input types', () => {
      expect(cn(
        'base',
        ['array-class1', 'array-class2'],
        {
          'object-class': true,
          'hidden-class': false,
        },
        'final-class'
      )).toBe('base array-class1 array-class2 object-class final-class');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle complex Tailwind merge scenarios', () => {
      // Testing that twMerge properly handles Tailwind CSS conflicts
      expect(cn('bg-red-500 bg-blue-500 text-lg text-xl')).toBe('bg-blue-500 text-xl');
      // For this case, p-2 provides both px-2 and py-2, but px-4 and py-6 override them
      expect(cn('p-2 px-4 py-6')).toBe('p-2 px-4 py-6');
    });

    it('should preserve non-conflicting classes', () => {
      expect(cn('flex items-center justify-between p-4 bg-white')).toBe('flex items-center justify-between p-4 bg-white');
    });

    it('should handle complex conditional logic', () => {
      const isActive = true;
      const isDisabled = false;
      const variant = 'primary';

      expect(cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class',
        variant === 'primary' && 'primary-class',
        variant === 'secondary' && 'secondary-class'
      )).toBe('base-class active-class primary-class');
    });

    it('should handle nested conditional arrays', () => {
      const condition1 = true;
      const condition2 = false;

      expect(cn([
        'base',
        condition1 && ['conditional1', 'conditional1-extra'],
        condition2 && ['conditional2', 'conditional2-extra'],
        'always-present'
      ])).toBe('base conditional1 conditional1-extra always-present');
    });

    it('should trim and normalize whitespace', () => {
      expect(cn('  class1  ', '  class2  ')).toBe('class1 class2');
    });
  });
});
