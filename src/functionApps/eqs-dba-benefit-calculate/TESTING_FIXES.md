# Common TypeScript Testing Error Fixes

This document provides solutions to common TypeScript errors when writing Jest tests for Azure Functions.

## Error 1: HttpRequest Mocking TypeScript Error

### Problem
```typescript
// This causes a TypeScript error:
mockRequest = {
  json: jest.fn(),
  url: '/api/benefit/complete',
  method: 'POST',
  headers: {},
  query: {},
  params: {},
  text: jest.fn(),
  arrayBuffer: jest.fn(),
  formData: jest.fn()
} as jest.Mocked<HttpRequest>;
```

**Error Message:**
```
Conversion of type '{ json: jest.Mock<any, any, any>; ... }' to type 'Mocked<HttpRequest>' may be a mistake because neither type sufficiently overlaps with the other.
Type '{ ... }' is missing the following properties from type '{ ... }': user, body, bodyUsed, blob, clone
```

### Solutions

#### Solution 1: Add Missing Properties
```typescript
mockRequest = {
  json: jest.fn(),
  url: '/api/benefit/complete',
  method: 'POST',
  headers: {} as any,           // Cast to any for Headers type
  query: {} as any,             // Cast to any for URLSearchParams type
  params: {},
  text: jest.fn(),
  arrayBuffer: jest.fn(),
  formData: jest.fn(),
  user: {} as any,              // Add missing properties
  body: null,
  bodyUsed: false,
  blob: jest.fn(),
  clone: jest.fn()
} as jest.Mocked<HttpRequest>;
```

#### Solution 2: Use Test Utilities (Recommended)
```typescript
import { createTestHttpRequest } from '../testFixtures';

// In your test:
mockRequest = createTestHttpRequest({
  url: '/api/benefit/complete',
  method: 'POST'
});
```

#### Solution 3: Partial Mocking
```typescript
let mockRequest: Partial<HttpRequest>;

mockRequest = {
  json: jest.fn(),
  url: '/api/benefit/complete',
  method: 'POST',
  params: {}
};

// Use as: someFunction(mockRequest as HttpRequest, mockContext)
```

## Error 2: FinalResultResponse Structure Error

### Problem
```typescript
// This causes a TypeScript error:
const mockResponse: FinalResultResponse = {
  processInstanceId: 'proc-123',
  taskId: 'task-456',
  results: [],      // ❌ 'results' does not exist
  status: 'completed'
};
```

**Error Message:**
```
Object literal may only specify known properties, and 'results' does not exist in type 'FinalResultResponse'.
```

### Solution: Use Correct Structure

According to the type definition, `FinalResultResponse` has this structure:
```typescript
interface FinalResultResponse {
  message: string;
  processInstanceId: string;
  taskId: string | null;
  memberData: MemberData;
  subProcessData: SubProcessData;
}
```

#### Correct Usage:
```typescript
import { mockFinalResultResponse } from '../testFixtures';

// Use the pre-built mock:
const mockResponse = mockFinalResultResponse;

// Or create your own:
const mockResponse: FinalResultResponse = {
  message: 'Process completed successfully',
  processInstanceId: 'proc-123',
  taskId: 'task-456',
  memberData: {} as MemberData,
  subProcessData: {} as SubProcessData
};
```

## Error 3: InvocationContext Mocking

### Problem
```typescript
// Incomplete context mock
mockContext = {
  log: jest.fn(),
  error: jest.fn()
} as jest.Mocked<InvocationContext>;
```

### Solution
```typescript
import { createTestInvocationContext } from '../testFixtures';

// Use the utility:
mockContext = createTestInvocationContext();

// Or create manually:
mockContext = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  invocationId: 'test-invocation-id',
  functionName: 'test-function',
  extraInputs: [],
  extraOutputs: []
} as unknown as jest.Mocked<InvocationContext>;
```

## Best Practices for Test Mocking

### 1. Use Test Fixtures
```typescript
import { 
  mockFinalResultResponse,
  validStartProcessRequest,
  createTestHttpRequest,
  createTestInvocationContext 
} from '../testFixtures';

describe('Your Test', () => {
  let mockRequest: HttpRequest;
  let mockContext: jest.Mocked<InvocationContext>;

  beforeEach(() => {
    mockRequest = createTestHttpRequest({ method: 'POST' });
    mockContext = createTestInvocationContext();
  });
});
```

### 2. Type-Safe Mocking
```typescript
// Instead of casting everything to 'any'
const mockService = {
  someMethod: jest.fn()
} as any;

// Use proper typing
const mockService = {
  someMethod: jest.fn().mockResolvedValue(expectedResult)
} as jest.Mocked<YourServiceType>;
```

### 3. Service Mocking Pattern
```typescript
import { YourService } from '../../services/yourService';

jest.mock('../../services/yourService');
const MockedYourService = YourService as jest.MockedClass<typeof YourService>;

describe('Tests', () => {
  let mockService: jest.Mocked<YourService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockService = new MockedYourService() as jest.Mocked<YourService>;
    
    // Replace the global instance
    jest.spyOn(require('../../your-module'), 'serviceInstance', 'get')
      .mockReturnValue(mockService);
  });
});
```

### 4. Response Mocking
```typescript
import { mockHttpResponses } from '../testFixtures';

// Use pre-built response mocks
const successResponse = mockHttpResponses.success(data);
const errorResponse = mockHttpResponses.badRequest('Validation failed');
```

## Common Test Patterns

### Testing Azure Functions
```typescript
import { createTestHttpRequest, createTestInvocationContext } from '../testFixtures';
import { yourAzureFunction } from '../../functions/yourFunction';

describe('Azure Function Tests', () => {
  it('should handle successful request', async () => {
    const mockRequest = createTestHttpRequest({
      method: 'POST',
      body: JSON.stringify(validRequestData)
    });
    const mockContext = createTestInvocationContext();

    // Mock the request.json() method
    (mockRequest.json as jest.Mock).mockResolvedValue(validRequestData);

    const result = await yourAzureFunction(mockRequest, mockContext);

    expect(result.status).toBe(200);
    expect(mockContext.log).toHaveBeenCalledWith(expect.stringContaining('success'));
  });
});
```

### Testing Services
```typescript
describe('Service Tests', () => {
  it('should handle business logic', async () => {
    const service = new YourService();
    const result = await service.processData(validInput);
    
    expect(result).toEqual(expectedOutput);
  });
});
```

### Testing Validation
```typescript
import { validationService } from '../../utils/validation';
import { validStartProcessRequest } from '../testFixtures';

describe('Validation Tests', () => {
  it('should validate correct input', () => {
    const errors = validationService.validate(validStartProcessRequest);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid input', () => {
    const invalidRequest = { ...validStartProcessRequest, firstName: '' };
    const errors = validationService.validate(invalidRequest);
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

## Quick Reference

### Import Pattern
```typescript
import { 
  createTestHttpRequest, 
  createTestInvocationContext,
  mockFinalResultResponse,
  validStartProcessRequest
} from '../testFixtures';
```

### Mock Setup Pattern
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  mockRequest = createTestHttpRequest({ method: 'POST' });
  mockContext = createTestInvocationContext();
  mockService = createMockService();
});
```

### Assertion Pattern
```typescript
expect(result.status).toBe(expectedStatus);
expect(result.jsonBody.success).toBe(true);
expect(mockContext.log).toHaveBeenCalledWith(expectedMessage);
expect(mockService.method).toHaveBeenCalledWith(expectedArgs);
```

These patterns will help you avoid common TypeScript errors and create more maintainable tests.