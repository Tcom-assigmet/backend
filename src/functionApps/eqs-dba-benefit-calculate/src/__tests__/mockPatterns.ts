// Different patterns for creating Jest mocks to avoid mockResolvedValue errors

import { CamundaService } from '../services/camundaService';

// Pattern 1: Manual Mock Object (Recommended)
export function createMockCamundaService(): jest.Mocked<CamundaService> {
  return {
    startProcess: jest.fn(),
    getTaskId: jest.fn(),
    getRequiredFields: jest.fn(),
    completeTask: jest.fn(),
    getFinalResults: jest.fn(),
    // Add any other methods that exist in CamundaService
  } as jest.Mocked<CamundaService>;
}

// Pattern 2: Using jest.mocked() utility (Jest 27+)
export function createMockWithJestMocked(): jest.Mocked<CamundaService> {
  const mockService = new CamundaService();
  return jest.mocked(mockService, true); // true for deep mocking
}

// Pattern 3: Using jest.createMockFromModule
export function createMockFromModule(): jest.Mocked<CamundaService> {
  const mockModule = jest.createMockFromModule<typeof CamundaService>('../services/camundaService');
  return new mockModule() as jest.Mocked<CamundaService>;
}

// Pattern 4: Inline casting (when you know the method exists)
export function demonstrateInlineCasting() {
  const mockService = {} as jest.Mocked<CamundaService>;
  
  // Cast individual methods
  mockService.startProcess = jest.fn() as jest.MockedFunction<CamundaService['startProcess']>;
  mockService.getTaskId = jest.fn() as jest.MockedFunction<CamundaService['getTaskId']>;
  
  return mockService;
}

// Pattern 5: Using jest.fn() with explicit typing
export function createTypedMocks() {
  return {
    startProcess: jest.fn<Promise<string>, [any]>(),
    getTaskId: jest.fn<Promise<string>, [string]>(),
    getRequiredFields: jest.fn<Promise<any[]>, [string, string]>(),
    completeTask: jest.fn<Promise<string>, [any]>(),
    getFinalResults: jest.fn<Promise<any>, [string, string | null]>()
  };
}

// Pattern 6: For when you get "does not exist" errors
export function fixMockResolvedValueError() {
  const mockFunction = jest.fn();
  
  // If you get "mockResolvedValue does not exist", do this:
  const properMockFunction = mockFunction as jest.MockedFunction<() => Promise<any>>;
  
  // Now this will work:
  properMockFunction.mockResolvedValue('some value');
  
  return properMockFunction;
}

// Usage examples in tests:

/*
// Example 1: Using the helper function
beforeEach(() => {
  mockCamundaService = createMockCamundaService();
  
  // Now these work:
  mockCamundaService.startProcess.mockResolvedValue('proc-123');
  mockCamundaService.getTaskId.mockResolvedValue('task-456');
});

// Example 2: If you still get errors, cast the specific method:
beforeEach(() => {
  mockCamundaService = createMockCamundaService();
  
  // Cast if needed:
  (mockCamundaService.startProcess as jest.MockedFunction<any>)
    .mockResolvedValue('proc-123');
});

// Example 3: For individual function mocking:
it('should work', async () => {
  const mockStartProcess = jest.fn().mockResolvedValue('proc-123');
  mockCamundaService.startProcess = mockStartProcess;
  
  // Use the service...
});

// Example 4: When mocking modules:
jest.mock('../services/camundaService', () => ({
  CamundaService: jest.fn().mockImplementation(() => ({
    startProcess: jest.fn(),
    getTaskId: jest.fn(),
    getRequiredFields: jest.fn(),
    completeTask: jest.fn(),
    getFinalResults: jest.fn()
  }))
}));
*/