# Quick Fixes for "mockResolvedValue does not exist" Error

## The Problem
```typescript
// This error:
mockCamundaService.startProcess.mockResolvedValue(processInstanceId);
//                              ^^^^^^^^^^^^^^^^^ 
// Property 'mockResolvedValue' does not exist on type '() => Promise<unknown>'
```

## Quick Fix #1: Cast the Mock Function
```typescript
// Before (causes error):
mockCamundaService.startProcess.mockResolvedValue('proc-123');

// After (works):
(mockCamundaService.startProcess as jest.MockedFunction<any>)
  .mockResolvedValue('proc-123');
```

## Quick Fix #2: Recreate the Mock
```typescript
// Replace the problematic mock:
mockCamundaService.startProcess = jest.fn().mockResolvedValue('proc-123');
```

## Quick Fix #3: Use Helper Function
```typescript
import { createMockCamundaService } from '../mockPatterns';

beforeEach(() => {
  mockCamundaService = createMockCamundaService();
  // Now this works:
  mockCamundaService.startProcess.mockResolvedValue('proc-123');
});
```

## Quick Fix #4: Individual Function Mocking
```typescript
it('should work', async () => {
  const mockStartProcess = jest.fn().mockResolvedValue('proc-123');
  const mockGetTaskId = jest.fn().mockResolvedValue('task-456');
  
  mockCamundaService.startProcess = mockStartProcess;
  mockCamundaService.getTaskId = mockGetTaskId;
  
  // Test your code...
});
```

## Quick Fix #5: Module-Level Mocking
```typescript
// At the top of your test file:
jest.mock('../../services/camundaService', () => ({
  CamundaService: jest.fn().mockImplementation(() => ({
    startProcess: jest.fn(),
    getTaskId: jest.fn(),
    getRequiredFields: jest.fn(),
    completeTask: jest.fn(),
    getFinalResults: jest.fn()
  }))
}));

// Then in your test:
const MockedCamundaService = CamundaService as jest.MockedClass<typeof CamundaService>;
let mockCamundaService: jest.Mocked<CamundaService>;

beforeEach(() => {
  mockCamundaService = new MockedCamundaService() as jest.Mocked<CamundaService>;
  // This will work:
  mockCamundaService.startProcess.mockResolvedValue('proc-123');
});
```

## Most Common Working Pattern

```typescript
describe('Your Test', () => {
  let service: YourService;
  let mockDependency: jest.Mocked<DependencyService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock with all methods as jest.fn() - use unknown cast for complex types
    mockDependency = {
      methodOne: jest.fn(),
      methodTwo: jest.fn(),
      methodThree: jest.fn()
    } as unknown as jest.Mocked<DependencyService>;
    
    service = new YourService();
    (service as any).dependency = mockDependency;
  });

  it('should work', async () => {
    // These will all work now:
    mockDependency.methodOne.mockResolvedValue('result1');
    mockDependency.methodTwo.mockRejectedValue(new Error('test error'));
    mockDependency.methodThree.mockReturnValue('sync result');
    
    // Your test logic...
  });
});
```

## ✅ **PROVEN WORKING SOLUTION**

If you get TypeScript overlap errors, use the **double cast pattern**:

```typescript
// ✅ This works and avoids all TypeScript errors:
mockService = {
  startProcess: jest.fn(),
  getTaskId: jest.fn(),
  getRequiredFields: jest.fn(),
  // ... other methods
} as unknown as jest.Mocked<ServiceType>;

// Now these will work perfectly:
mockService.startProcess.mockResolvedValue('proc-123');
mockService.getTaskId.mockRejectedValue(new Error('test'));
```

## Why This Happens

1. **Type Mismatch**: Jest doesn't automatically know a function is a mock
2. **Incomplete Mock**: The mock wasn't created with `jest.fn()`
3. **Wrong Typing**: The function wasn't properly typed as a Jest mock

## Prevention

Always create mocks like this:
```typescript
const mockService = {
  asyncMethod: jest.fn(),
  syncMethod: jest.fn()
} as jest.Mocked<ServiceType>;
```

Not like this:
```typescript
const mockService = {
  asyncMethod: () => Promise.resolve(),
  syncMethod: () => 'result'
} as jest.Mocked<ServiceType>;
```