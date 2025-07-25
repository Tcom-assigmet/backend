import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { CamundaService } from '../../services/camundaService';
import { 
  StartProcessRequest, 
  ProcessResponse, 
  CompleteTaskRequest,
  RequiredField,
  FinalResultResponse 
} from '../../models/types';

// Mock the CamundaService
jest.mock('../../services/camundaService');
const MockedCamundaService = CamundaService as jest.MockedClass<typeof CamundaService>;

describe('BenefitCalculationService', () => {
  let service: BenefitCalculationService;
  let mockCamundaService: jest.Mocked<CamundaService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCamundaService = new MockedCamundaService() as jest.Mocked<CamundaService>;
    service = new BenefitCalculationService();
    // Replace the camundaService instance with our mock
    (service as any).camundaService = mockCamundaService;
  });

  describe('startBenefitCalculation', () => {
    const mockRequest: StartProcessRequest = {
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

    const mockRequiredFields: RequiredField[] = [
      { name: 'salary', type: 'number', required: true },
      { name: 'yearsOfService', type: 'number', required: true }
    ];

    it('should successfully start benefit calculation', async () => {
      const processInstanceId = 'proc-123';
      const taskId = 'task-456';

      mockCamundaService.startProcess.mockResolvedValue(processInstanceId);
      mockCamundaService.getTaskId.mockResolvedValue(taskId);
      mockCamundaService.getRequiredFields.mockResolvedValue(mockRequiredFields);

      const result = await service.startBenefitCalculation(mockRequest);

      expect(mockCamundaService.startProcess).toHaveBeenCalledWith(mockRequest);
      expect(mockCamundaService.getTaskId).toHaveBeenCalledWith(processInstanceId);
      expect(mockCamundaService.getRequiredFields).toHaveBeenCalledWith(taskId, processInstanceId);

      expect(result).toEqual({
        processInstanceId,
        taskId,
        requiredFields: mockRequiredFields
      });
    });

    it('should throw error when process start fails', async () => {
      const error = new Error('Process start failed');
      mockCamundaService.startProcess.mockRejectedValue(error);

      await expect(service.startBenefitCalculation(mockRequest))
        .rejects.toThrow('Process start failed');

      expect(mockCamundaService.startProcess).toHaveBeenCalledWith(mockRequest);
      expect(mockCamundaService.getTaskId).not.toHaveBeenCalled();
      expect(mockCamundaService.getRequiredFields).not.toHaveBeenCalled();
    });

    it('should throw error when getTaskId fails', async () => {
      const processInstanceId = 'proc-123';
      const error = new Error('Task retrieval failed');

      mockCamundaService.startProcess.mockResolvedValue(processInstanceId);
      mockCamundaService.getTaskId.mockRejectedValue(error);

      await expect(service.startBenefitCalculation(mockRequest))
        .rejects.toThrow('Task retrieval failed');

      expect(mockCamundaService.startProcess).toHaveBeenCalledWith(mockRequest);
      expect(mockCamundaService.getTaskId).toHaveBeenCalledWith(processInstanceId);
      expect(mockCamundaService.getRequiredFields).not.toHaveBeenCalled();
    });

    it('should throw error when getRequiredFields fails', async () => {
      const processInstanceId = 'proc-123';
      const taskId = 'task-456';
      const error = new Error('Required fields retrieval failed');

      mockCamundaService.startProcess.mockResolvedValue(processInstanceId);
      mockCamundaService.getTaskId.mockResolvedValue(taskId);
      mockCamundaService.getRequiredFields.mockRejectedValue(error);

      await expect(service.startBenefitCalculation(mockRequest))
        .rejects.toThrow('Required fields retrieval failed');

      expect(mockCamundaService.startProcess).toHaveBeenCalledWith(mockRequest);
      expect(mockCamundaService.getTaskId).toHaveBeenCalledWith(processInstanceId);
      expect(mockCamundaService.getRequiredFields).toHaveBeenCalledWith(taskId, processInstanceId);
    });
  });

  describe('getTaskDetails', () => {
    const processInstanceId = 'proc-123';
    const mockRequiredFields: RequiredField[] = [
      { name: 'field1', type: 'string', required: true },
      { name: 'field2', type: 'number', required: false }
    ];

    it('should successfully get task details', async () => {
      const taskId = 'task-456';

      mockCamundaService.getTaskId.mockResolvedValue(taskId);
      mockCamundaService.getRequiredFields.mockResolvedValue(mockRequiredFields);

      const result = await service.getTaskDetails(processInstanceId);

      expect(mockCamundaService.getTaskId).toHaveBeenCalledWith(processInstanceId);
      expect(mockCamundaService.getRequiredFields).toHaveBeenCalledWith(taskId, processInstanceId);

      expect(result).toEqual({
        taskId,
        requiredFields: mockRequiredFields
      });
    });

    it('should throw error when getTaskId fails', async () => {
      const error = new Error('Task not found');
      mockCamundaService.getTaskId.mockRejectedValue(error);

      await expect(service.getTaskDetails(processInstanceId))
        .rejects.toThrow('Task not found');

      expect(mockCamundaService.getTaskId).toHaveBeenCalledWith(processInstanceId);
      expect(mockCamundaService.getRequiredFields).not.toHaveBeenCalled();
    });

    it('should throw error when getRequiredFields fails', async () => {
      const taskId = 'task-456';
      const error = new Error('Required fields not found');

      mockCamundaService.getTaskId.mockResolvedValue(taskId);
      mockCamundaService.getRequiredFields.mockRejectedValue(error);

      await expect(service.getTaskDetails(processInstanceId))
        .rejects.toThrow('Required fields not found');

      expect(mockCamundaService.getTaskId).toHaveBeenCalledWith(processInstanceId);
      expect(mockCamundaService.getRequiredFields).toHaveBeenCalledWith(taskId, processInstanceId);
    });
  });

  describe('completeTask', () => {
    const mockCompleteRequest: CompleteTaskRequest = {
      processInstanceId: 'proc-123',
      variables: {
        salary: { value: 50000, type: 'Double' },
        yearsOfService: { value: 10, type: 'Long' }
      }
    };

    it('should successfully complete task', async () => {
      const expectedMessage = 'Task completed successfully';
      mockCamundaService.completeTask.mockResolvedValue(expectedMessage);

      const result = await service.completeTask(mockCompleteRequest);

      expect(mockCamundaService.completeTask).toHaveBeenCalledWith(mockCompleteRequest);
      expect(result).toBe(expectedMessage);
    });

    it('should throw error when task completion fails', async () => {
      const error = new Error('Task completion failed');
      mockCamundaService.completeTask.mockRejectedValue(error);

      await expect(service.completeTask(mockCompleteRequest))
        .rejects.toThrow('Task completion failed');

      expect(mockCamundaService.completeTask).toHaveBeenCalledWith(mockCompleteRequest);
    });

    it('should handle empty variables', async () => {
      const requestWithEmptyVars: CompleteTaskRequest = {
        processInstanceId: 'proc-123',
        variables: {}
      };

      const expectedMessage = 'Task completed successfully';
      mockCamundaService.completeTask.mockResolvedValue(expectedMessage);

      const result = await service.completeTask(requestWithEmptyVars);

      expect(mockCamundaService.completeTask).toHaveBeenCalledWith(requestWithEmptyVars);
      expect(result).toBe(expectedMessage);
    });
  });

  describe('getFinalResults', () => {
    const processInstanceId = 'proc-123';

    it('should successfully get final results', async () => {
      const mockResults: FinalResultResponse = {
        processInstanceId,
        taskId: 'task-456',
        results: [
          { name: 'monthlyBenefit', value: 2500, type: 'currency' },
          { name: 'totalBenefit', value: 300000, type: 'currency' }
        ],
        status: 'completed'
      };

      mockCamundaService.getFinalResults.mockResolvedValue(mockResults);

      const result = await service.getFinalResults(processInstanceId);

      expect(mockCamundaService.getFinalResults).toHaveBeenCalledWith(processInstanceId);
      expect(result).toEqual(mockResults);
    });

    it('should throw error when getting final results fails', async () => {
      const error = new Error('Results not available');
      mockCamundaService.getFinalResults.mockRejectedValue(error);

      await expect(service.getFinalResults(processInstanceId))
        .rejects.toThrow('Results not available');

      expect(mockCamundaService.getFinalResults).toHaveBeenCalledWith(processInstanceId);
    });

    it('should handle empty results', async () => {
      const mockResults: FinalResultResponse = {
        processInstanceId,
        taskId: 'task-456',
        results: [],
        status: 'completed'
      };

      mockCamundaService.getFinalResults.mockResolvedValue(mockResults);

      const result = await service.getFinalResults(processInstanceId);

      expect(result.results).toEqual([]);
      expect(result.status).toBe('completed');
    });
  });

  describe('constructor', () => {
    it('should create instance with CamundaService', () => {
      const newService = new BenefitCalculationService();
      expect(newService).toBeInstanceOf(BenefitCalculationService);
      expect((newService as any).camundaService).toBeInstanceOf(CamundaService);
    });
  });

  describe('error handling patterns', () => {
    it('should propagate specific error types from Camunda service', async () => {
      const processNotFoundError = new Error('process not found');
      mockCamundaService.startProcess.mockRejectedValue(processNotFoundError);

      const mockRequest: StartProcessRequest = {
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

      await expect(service.startBenefitCalculation(mockRequest))
        .rejects.toThrow('process not found');
    });

    it('should propagate service unavailable errors', async () => {
      const serviceUnavailableError = new Error('service unavailable');
      mockCamundaService.startProcess.mockRejectedValue(serviceUnavailableError);

      const mockRequest: StartProcessRequest = {
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

      await expect(service.startBenefitCalculation(mockRequest))
        .rejects.toThrow('service unavailable');
    });
  });
});