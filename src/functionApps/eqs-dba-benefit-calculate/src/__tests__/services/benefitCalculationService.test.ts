import { BenefitCalculationService } from '../../services/benefitCalculationService';
import { CamundaService } from '../../services/camundaService';
import { 
  StartProcessRequest, 
  ProcessResponse, 
  CompleteTaskRequest,
  RequiredField,
  FinalResultResponse,
  MemberData,
  SubProcessData
} from '../../models/types';

// Mock the CamundaService
jest.mock('../../services/camundaService');

describe('BenefitCalculationService', () => {
  let service: BenefitCalculationService;
  let mockCamundaService: jest.Mocked<CamundaService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a properly typed mock (cast to unknown first to avoid type overlap error)
    mockCamundaService = {
      startProcess: jest.fn(),
      getTaskId: jest.fn(),
      getRequiredFields: jest.fn(),
      completeTaskWithVariables: jest.fn(),
      completeTaskDirect: jest.fn(),
      getProcessVariables: jest.fn(),
      getSubProcessInstanceId: jest.fn(),
      isProcessCompleted: jest.fn()
    } as unknown as jest.Mocked<CamundaService>;
    
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

      // Now these will work properly
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
  });

  describe('completeTask', () => {
    const mockCompleteRequest: CompleteTaskRequest = {
      processInstanceId: 'proc-123',
      variables: {
        salary: { value: 50000, type: 'Double' },
        yearsOfService: { value: 10, type: 'Long' }
      }
    };

    it('should successfully complete task and return final results', async () => {
      const taskId = 'task-456';
      const mockMainProcessVariables = { salary: '50000', yearsOfService: '10' };
      const mockSubProcessVariables = { pymntAmt: '2500.00' };

      const expectedResult: FinalResultResponse = {
        message: 'Task completed successfully',
        processInstanceId: 'proc-123',
        taskId: 'task-456',
        memberData: {} as MemberData,
        subProcessData: {} as SubProcessData
      };

      mockCamundaService.getTaskId.mockResolvedValue(taskId);
      mockCamundaService.completeTaskWithVariables.mockResolvedValue();
      mockCamundaService.getProcessVariables.mockResolvedValue(mockMainProcessVariables);
      mockCamundaService.getSubProcessInstanceId.mockResolvedValue('subprocess-123');
      mockCamundaService.isProcessCompleted.mockResolvedValue(true);

      const result = await service.completeTask(mockCompleteRequest);

      expect(mockCamundaService.getTaskId).toHaveBeenCalledWith(mockCompleteRequest.processInstanceId);
      expect(mockCamundaService.completeTaskWithVariables).toHaveBeenCalledWith(taskId, mockCompleteRequest.variables);
      expect(result.processInstanceId).toBe('proc-123');
      expect(result.taskId).toBe('task-456');
    });
  });

  describe('getFinalResults', () => {
    const processInstanceId = 'proc-123';
    const taskId = 'task-456';

    it('should successfully get final results', async () => {
      const mockMainProcessVariables = { firstName: 'John', lastName: 'Doe' };
      const mockSubProcessVariables = { pymntAmt: '2500.00' };

      mockCamundaService.getProcessVariables
        .mockResolvedValueOnce(mockMainProcessVariables) // First call for main process
        .mockResolvedValueOnce(mockSubProcessVariables); // Second call for subprocess
      mockCamundaService.getSubProcessInstanceId.mockResolvedValue('subprocess-123');
      mockCamundaService.isProcessCompleted.mockResolvedValue(true);

      const result = await service.getFinalResults(processInstanceId, taskId);

      expect(mockCamundaService.getProcessVariables).toHaveBeenCalledWith(processInstanceId);
      expect(result.processInstanceId).toBe(processInstanceId);
      expect(result.taskId).toBe(taskId);
      expect(result.message).toBe('Task completed successfully');
    });

    it('should handle case with no subprocess', async () => {
      const mockMainProcessVariables = { firstName: 'John', lastName: 'Doe' };

      mockCamundaService.getProcessVariables.mockResolvedValue(mockMainProcessVariables);
      mockCamundaService.getSubProcessInstanceId.mockResolvedValue(null);

      const result = await service.getFinalResults(processInstanceId, taskId);

      expect(result.processInstanceId).toBe(processInstanceId);
      expect(result.taskId).toBe(taskId);
    });
  });

  describe('constructor', () => {
    it('should create instance with CamundaService', () => {
      const newService = new BenefitCalculationService();
      expect(newService).toBeInstanceOf(BenefitCalculationService);
      expect((newService as any).camundaService).toBeInstanceOf(CamundaService);
    });
  });
});