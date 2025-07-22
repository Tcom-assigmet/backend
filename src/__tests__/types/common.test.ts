import {
  isString,
  isNumber,
  isBoolean,
  isDate,
  isArray,
  isObject,
  isApiError,
  isApiResponse,
  BaseApiResponse,
  ApiError,
} from '@/types/common';

describe('Type Guards', () => {
  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString('123')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(123.45)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
    });

    it('should return false for NaN', () => {
      expect(isNumber(NaN)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean({})).toBe(false);
      expect(isBoolean([])).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for valid dates', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2024-01-15'))).toBe(true);
      expect(isDate(new Date(2024, 0, 15))).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isDate(new Date('invalid'))).toBe(false);
      expect(isDate(new Date(NaN))).toBe(false);
    });

    it('should return false for non-dates', () => {
      expect(isDate('2024-01-15')).toBe(false);
      expect(isDate(1705276800000)).toBe(false); // timestamp
      expect(isDate(null)).toBe(false);
      expect(isDate(undefined)).toBe(false);
      expect(isDate({})).toBe(false);
      expect(isDate([])).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(['a', 'b', 'c'])).toBe(true);
      expect(isArray([{}])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray('array')).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray({})).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
    });

    it('should work with generic type parameter', () => {
      const stringArray: unknown = ['a', 'b', 'c'];
      if (isArray<string>(stringArray)) {
        // TypeScript should infer this as string[]
        expect(stringArray[0].charAt).toBeDefined();
      }
    });
  });

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
      expect(isObject({ nested: { obj: true } })).toBe(true);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(undefined)).toBe(false);
    });

    it('should return true for class instances', () => {
      class TestClass {}
      expect(isObject(new TestClass())).toBe(true);
      expect(isObject(new Date())).toBe(true);
    });
  });

  describe('isApiError', () => {
    it('should return true for valid ApiError objects', () => {
      const apiError: ApiError = {
        error: 'Something went wrong',
      };
      expect(isApiError(apiError)).toBe(true);

      const apiErrorWithDetails: ApiError = {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: { field: 'email' },
      };
      expect(isApiError(apiErrorWithDetails)).toBe(true);
    });

    it('should return false for objects without error property', () => {
      expect(isApiError({})).toBe(false);
      expect(isApiError({ message: 'Not an error' })).toBe(false);
      expect(isApiError({ success: false })).toBe(false);
    });

    it('should return false for objects with non-string error', () => {
      expect(isApiError({ error: 123 })).toBe(false);
      expect(isApiError({ error: true })).toBe(false);
      expect(isApiError({ error: null })).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isApiError('error')).toBe(false);
      expect(isApiError(123)).toBe(false);
      expect(isApiError(null)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
    });
  });

  describe('isApiResponse', () => {
    it('should return true for valid BaseApiResponse objects', () => {
      const successResponse: BaseApiResponse = {
        success: true,
        data: { result: 'data' },
      };
      expect(isApiResponse(successResponse)).toBe(true);

      const errorResponse: BaseApiResponse = {
        success: false,
        error: 'Something went wrong',
      };
      expect(isApiResponse(errorResponse)).toBe(true);

      const responseWithMessage: BaseApiResponse = {
        success: true,
        message: 'Operation completed',
        timestamp: '2024-01-15T10:00:00Z',
      };
      expect(isApiResponse(responseWithMessage)).toBe(true);
    });

    it('should return false for objects without success property', () => {
      expect(isApiResponse({})).toBe(false);
      expect(isApiResponse({ data: 'some data' })).toBe(false);
      expect(isApiResponse({ error: 'error' })).toBe(false);
    });

    it('should return false for objects with non-boolean success', () => {
      expect(isApiResponse({ success: 'true' })).toBe(false);
      expect(isApiResponse({ success: 1 })).toBe(false);
      expect(isApiResponse({ success: null })).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isApiResponse('response')).toBe(false);
      expect(isApiResponse(123)).toBe(false);
      expect(isApiResponse(null)).toBe(false);
      expect(isApiResponse(undefined)).toBe(false);
    });

    it('should work with generic type parameter', () => {
      const response: unknown = {
        success: true,
        data: { id: 1, name: 'John' },
      };

      if (isApiResponse<{ id: number; name: string }>(response)) {
        // TypeScript should infer the correct type
        expect(response.data?.id).toBe(1);
        expect(response.data?.name).toBe('John');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle Symbol primitives', () => {
      const symbol = Symbol('test');
      expect(isString(symbol)).toBe(false);
      expect(isNumber(symbol)).toBe(false);
      expect(isBoolean(symbol)).toBe(false);
      expect(isObject(symbol)).toBe(false);
      expect(isArray(symbol)).toBe(false);
    });

    it('should handle function objects', () => {
      const func = () => {};
      expect(isObject(func)).toBe(false); // functions are not considered plain objects by our isObject
      expect(isArray(func)).toBe(false);
      // But they are objects in JS type system
      expect(typeof func).toBe('function');
      expect(func instanceof Object).toBe(true);
    });

    it('should handle frozen objects', () => {
      const frozenObj = Object.freeze({ key: 'value' });
      expect(isObject(frozenObj)).toBe(true);
    });

    it('should handle objects with null prototype', () => {
      const nullProtoObj = Object.create(null);
      nullProtoObj.key = 'value';
      expect(isObject(nullProtoObj)).toBe(true);
    });
  });
});