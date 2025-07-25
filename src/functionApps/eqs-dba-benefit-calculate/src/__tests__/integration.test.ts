import { validationService } from '../utils/validation';
import { responseBuilder } from '../utils/helpers';
import { createMockHttpRequest, createMockInvocationContext } from './testUtils';
import { StartProcessRequest } from '../models/types';

describe('Integration Tests', () => {
  describe('Validation Service', () => {
    it('should validate a complete request successfully', () => {
      const validRequest: StartProcessRequest = {
        firstName: 'John',
        lastName: 'Doe',
        memberId: 'MEM123',
        dateOfBirth: '1990-01-01',
        dateJoinedFund: '2020-01-01',
        effectiveDate: '2024-01-01',
        calculationDate: '2024-01-01',
        benefitClass: 'Standard',
        paymentType: 'Monthly',
        planNumber: 'PLAN001',
        paymentTypeDesc: 'Monthly Payment'
      };

      const errors = validationService.validateStartProcessRequest(validRequest);
      expect(errors).toHaveLength(0);
    });

    it('should return validation errors for invalid request', () => {
      const invalidRequest: StartProcessRequest = {
        firstName: '',
        lastName: '',
        memberId: '',
        dateOfBirth: 'invalid-date',
        dateJoinedFund: '2020-01-01',
        effectiveDate: '2024-01-01',
        calculationDate: '2024-01-01',
        benefitClass: '',
        paymentType: 'Monthly',
        planNumber: 'PLAN001',
        paymentTypeDesc: 'Monthly Payment'
      };

      const errors = validationService.validateStartProcessRequest(invalidRequest);
      expect(errors.length).toBeGreaterThan(0);
      
      const fieldNames = errors.map(e => e.field);
      expect(fieldNames).toContain('firstName');
      expect(fieldNames).toContain('lastName');
      expect(fieldNames).toContain('memberId');
      expect(fieldNames).toContain('dateOfBirth');
      expect(fieldNames).toContain('benefitClass');
    });
  });

  describe('Response Builder', () => {
    const mockRequest = createMockHttpRequest();

    it('should create successful response', () => {
      const data = { message: 'Success' };
      const response = responseBuilder.success(mockRequest, data);
      
      expect(response.status).toBe(200);
      expect(response.jsonBody.success).toBe(true);
      expect(response.jsonBody.data).toEqual(data);
    });

    it('should create error response', () => {
      const response = responseBuilder.badRequest(mockRequest, 'Validation failed');
      
      expect(response.status).toBe(400);
      expect(response.jsonBody.success).toBe(false);
      expect(response.jsonBody.error?.message).toBe('Validation failed');
    });

    it('should include timestamp and request info in responses', () => {
      const response = responseBuilder.success(mockRequest, {});
      
      expect(response.jsonBody.timestamp).toBeDefined();
      expect(response.jsonBody.path).toBe(mockRequest.url);
      expect(response.jsonBody.method).toBe(mockRequest.method);
    });
  });

  describe('Mock Utilities', () => {
    it('should create proper mock HTTP request', () => {
      const request = createMockHttpRequest({
        url: '/test',
        method: 'POST',
        params: { id: '123' }
      });

      expect(request.url).toBe('/test');
      expect(request.method).toBe('POST');
      expect(request.params.id).toBe('123');
      expect(typeof request.json).toBe('function');
    });

    it('should create proper mock invocation context', () => {
      const context = createMockInvocationContext();

      expect(typeof context.log).toBe('function');
      expect(typeof context.error).toBe('function');
      expect(typeof context.warn).toBe('function');
      expect(context.invocationId).toBeDefined();
      expect(context.functionName).toBeDefined();
    });
  });
});