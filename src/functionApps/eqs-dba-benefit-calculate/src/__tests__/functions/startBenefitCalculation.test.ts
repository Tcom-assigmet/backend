import { startBenefitCalculation } from '../../functions/startBenefitCalculation';
import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { ValidationService } from '../../utils/validation';
import { HttpRequest, InvocationContext } from '@azure/functions';
import { 
  createTestHttpRequest, 
  createTestInvocationContext,
  validStartProcessRequest,
  mockProcessResponse
} from '../testFixtures';

// Mock the services
jest.mock('../../services/benefitCalculationService');
jest.mock('../../utils/validation');

describe('startBenefitCalculation Function', () => {
  let mockRequest: HttpRequest;
  let mockContext: jest.Mocked<InvocationContext>;
  let mockBenefitService: jest.Mocked<BenefitCalculationService>;
  let mockValidationService: jest.Mocked<ValidationService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = createTestHttpRequest({
      method: 'POST',
      url: '/api/benefit/start'
    });

    mockContext = createTestInvocationContext();

    // Create properly typed mocks
    mockBenefitService = {
      startBenefitCalculation: jest.fn(),
      getTaskDetails: jest.fn(),
      completeTask: jest.fn(),
      getFinalResults: jest.fn(),
      completeTaskDirect: jest.fn()
    } as unknown as jest.Mocked<BenefitCalculationService>;

    mockValidationService = {
      validateStartProcessRequest: jest.fn()
    } as unknown as jest.Mocked<ValidationService>;

    // Mock the service constructors
    (BenefitCalculationService as jest.MockedClass<typeof BenefitCalculationService>).mockImplementation(() => mockBenefitService);
    (ValidationService as jest.MockedClass<typeof ValidationService>).mockImplementation(() => mockValidationService);
  });

  describe('successful execution', () => {
    it('should start benefit calculation successfully', async () => {
      // Setup mocks
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(validStartProcessRequest);
      mockValidationService.validateStartProcessRequest.mockReturnValue([]); // No validation errors
      mockBenefitService.startBenefitCalculation.mockResolvedValue(mockProcessResponse);

      // Execute function
      const result = await startBenefitCalculation(mockRequest, mockContext);

      // Verify results
      expect(result.status).toBe(201);
      expect(result.jsonBody).toEqual({
        success: true,
        message: 'Benefit calculation started successfully',
        data: mockProcessResponse
      });

      // Verify service calls
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockValidationService.validateStartProcessRequest).toHaveBeenCalledWith(validStartProcessRequest);
      expect(mockBenefitService.startBenefitCalculation).toHaveBeenCalledWith(validStartProcessRequest);
    });
  });

  describe('error handling', () => {
    it('should handle JSON parsing errors', async () => {
      const parseError = new SyntaxError('Unexpected token in JSON');
      (mockRequest.json as jest.MockedFunction<any>).mockRejectedValue(parseError);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'INVALID_JSON',
        message: 'Invalid JSON in request body',
        details: ['Unexpected token in JSON']
      });

      expect(mockValidationService.validateStartProcessRequest).not.toHaveBeenCalled();
      expect(mockBenefitService.startBenefitCalculation).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const invalidRequest = { ...validStartProcessRequest, firstName: '' };
      const validationErrors = [
        { field: 'firstName', message: 'First name is required', code: 'REQUIRED' }
      ];

      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(invalidRequest);
      mockValidationService.validateStartProcessRequest.mockReturnValue(validationErrors);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody).toEqual({
        error: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: validationErrors
      });

      expect(mockBenefitService.startBenefitCalculation).not.toHaveBeenCalled();
    });

    it('should handle process not found errors', async () => {
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(validStartProcessRequest);
      mockValidationService.validateStartProcessRequest.mockReturnValue([]); // No validation errors
      
      const processNotFoundError = new Error('process not found');
      mockBenefitService.startBenefitCalculation.mockRejectedValue(processNotFoundError);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(result.status).toBe(404);
      expect(result.jsonBody).toEqual({
        error: 'PROCESS_NOT_FOUND',
        message: 'Process definition not found',
        details: ['process not found']
      });
    });

    it('should handle service unavailable errors', async () => {
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(validStartProcessRequest);
      mockValidationService.validateStartProcessRequest.mockReturnValue([]); // No validation errors
      
      const serviceUnavailableError = new Error('service unavailable');
      mockBenefitService.startBenefitCalculation.mockRejectedValue(serviceUnavailableError);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(result.status).toBe(503);
      expect(result.jsonBody).toEqual({
        error: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable',
        details: ['service unavailable']
      });
    });

    it('should handle generic internal server errors', async () => {
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(validStartProcessRequest);
      mockValidationService.validateStartProcessRequest.mockReturnValue([]); // No validation errors
      
      const genericError = new Error('Database connection failed');
      mockBenefitService.startBenefitCalculation.mockRejectedValue(genericError);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(result.status).toBe(500);
      expect(result.jsonBody).toEqual({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        details: ['Database connection failed']
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty request body', async () => {
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue({});
      mockValidationService.validateStartProcessRequest.mockReturnValue([
        { field: 'firstName', message: 'First name is required', code: 'REQUIRED' },
        { field: 'lastName', message: 'Last name is required', code: 'REQUIRED' }
      ]);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody.error).toBe('VALIDATION_ERROR');
    });

    it('should handle null request body', async () => {
      (mockRequest.json as jest.MockedFunction<any>).mockResolvedValue(null);
      mockValidationService.validateStartProcessRequest.mockReturnValue([
        { field: 'request', message: 'Request body cannot be empty', code: 'REQUIRED' }
      ]);

      const result = await startBenefitCalculation(mockRequest, mockContext);

      expect(result.status).toBe(400);
      expect(result.jsonBody.error).toBe('VALIDATION_ERROR');
    });
  });
});