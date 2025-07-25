import { HttpRequest, InvocationContext } from '@azure/functions';
import { 
  StartProcessRequest, 
  CompleteTaskRequest, 
  FinalResultResponse,
  MemberData,
  SubProcessData,
  ProcessResponse,
  RequiredField,
  ApiResponse,
  ApiError
} from '../models/types';

// Test data fixtures
export const validStartProcessRequest: StartProcessRequest = {
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

export const validCompleteTaskRequest: CompleteTaskRequest = {
  processInstanceId: 'proc-123',
  variables: {
    salary: { value: 50000, type: 'Double' },
    yearsOfService: { value: 10, type: 'Long' }
  }
};

export const mockMemberData: MemberData = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  dateJoinedFund: '2020-01-01',
  memberId: 'MEM123',
  effectiveDate: '2024-01-01',
  calculationDate: '2024-01-01',
  benefitClass: 'Standard',
  planNumber: 'PLAN001',
  paymentType: 'Monthly',
  paymentTypeDesc: 'Monthly Payment',
  maxBenMult: '1.0',
  othMult3: '0.5',
  othMult5: '0.3',
  sgMaxContBase: '50000',
  mbrSGM: '5000',
  SGM: '5000',
  fixedSpecSGMult: '1.0',
  accRetMult_PriorDt: '1.0',
  finalAvSal: '60000',
  discFactA: '0.95',
  dateBenAccr: '2024-01-01',
  accBenMult: '1.0',
  accRetMult: '1.0',
  addtnlSG: '1000',
  addtnlSGAcct: '1000',
  addtnlVolDeath: '500',
  compAddtnlAcct: '500',
  cpiVal1: '100',
  cpiVal2: '105',
  dbOffsetAcct: '1000',
  deathMult: '2.0',
  discFactB: '0.90',
  discFactC: '0.85',
  discFactD: '0.80',
  empNotnlAcct: '2000',
  famLawAcctVal: '5000',
  fas_920630: '55000',
  fas_CalcDate: '2024-01-01',
  FutSrvc: '15',
  interest: '0.05',
  mbrAcct: '50000',
  mbrContAcct: '10000',
  mbrEquitShare: '0.6',
  mbrVolAcct: '5000',
  notnlInitBal: '45000',
  notnlAcct: '48000',
  notnlSgAcct: '3000',
  notnlSgBal: '3500',
  othBen1: '1000',
  othBen2: '1500',
  othMult1: '1.1',
  othMult2: '1.2',
  othMult4: '0.8',
  oteAddtnl: '2000',
  rolloverAcct: '15000',
  salary: '60000',
  sgAcct: '5000',
  srchrgAcct: '500',
  vestFactA: '1.0',
  sgNotionalAccount: '5500',
  memberContributions: '12000',
  finalAvSalForMrb2: '62000'
};

export const mockSubProcessData: SubProcessData = {
  pymntAmt: '2500.00',
  minBenCheck: 'true',
  maxBenCheck: 'false',
  totalVolAcctsAdd: '5000.00',
  totalVolAcctsSub: '1000.00',
  totalVolAcctsNet: '4000.00'
};

export const mockFinalResultResponse: FinalResultResponse = {
  message: 'Task completed successfully',
  processInstanceId: 'proc-123',
  taskId: 'task-456',
  memberData: mockMemberData,
  subProcessData: mockSubProcessData
};

export const mockProcessResponse: ProcessResponse = {
  processInstanceId: 'proc-123',
  taskId: 'task-456',
  requiredFields: [
    { name: 'salary', type: 'number', required: true },
    { name: 'yearsOfService', type: 'number', required: true }
  ]
};

export const mockRequiredFields: RequiredField[] = [
  { name: 'salary', type: 'number', required: true },
  { name: 'yearsOfService', type: 'number', required: true }
];

// Mock HTTP Request utility
export function createTestHttpRequest(overrides: Partial<HttpRequest> = {}): HttpRequest {
  const mockRequest = {
    json: jest.fn(),
    text: jest.fn(),
    arrayBuffer: jest.fn(),
    formData: jest.fn(),
    blob: jest.fn(),
    clone: jest.fn(),
    url: '/api/test',
    method: 'GET',
    headers: new Headers() as any,
    query: new URLSearchParams() as any,
    params: {},
    user: {} as any,
    body: null,
    bodyUsed: false,
    ...overrides
  } as unknown as HttpRequest;

  // Make params writable for testing
  Object.defineProperty(mockRequest, 'params', {
    value: overrides.params || {},
    writable: true,
    configurable: true
  });

  return mockRequest;
}

// Mock InvocationContext utility
export function createTestInvocationContext(): jest.Mocked<InvocationContext> {
  return {
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
}

// Helper to create mock request with specific params
export function createMockRequestWithParams(params: Record<string, any>): HttpRequest {
  return createTestHttpRequest({ params });
}

// Helper to create mock request with JSON body
export function createMockRequestWithJson(jsonData: any): HttpRequest {
  const request = createTestHttpRequest();
  (request.json as jest.MockedFunction<any>).mockResolvedValue(jsonData);
  return request;
}

// Helper functions to create expected response formats that match responseBuilder
export function createExpectedSuccessResponse<T>(
  data: T,
  path: string = '/api/test',
  method: string = 'GET'
): ApiResponse<T> {
  return {
    success: true,
    data,
    error: undefined,
    timestamp: expect.any(String),
    path,
    method
  };
}

export function createExpectedErrorResponse(
  code: string,
  message: string,
  path: string = '/api/test',
  method: string = 'GET',
  details?: string,
  validationErrors?: any[]
): ApiResponse<undefined> {
  return {
    success: false,
    data: undefined,
    error: {
      code,
      message,
      details,
      validationErrors
    },
    timestamp: expect.any(String),
    path,
    method
  };
}

// Common HTTP responses for testing (updated to match actual responseBuilder format)
export const mockHttpResponses = {
  success: <T>(data: T, path: string = '/api/test', method: string = 'GET') => ({
    status: 200,
    jsonBody: createExpectedSuccessResponse(data, path, method)
  }),
  created: <T>(data: T, path: string = '/api/test', method: string = 'POST') => ({
    status: 201,
    jsonBody: createExpectedSuccessResponse(data, path, method)
  }),
  badRequest: (message: string, path: string = '/api/test', method: string = 'POST', validationErrors?: any[]) => ({
    status: 400,
    jsonBody: createExpectedErrorResponse('VALIDATION_ERROR', message, path, method, undefined, validationErrors)
  }),
  notFound: (message: string, path: string = '/api/test', method: string = 'GET') => ({
    status: 404,
    jsonBody: createExpectedErrorResponse('NOT_FOUND', message, path, method)
  }),
  internalServerError: (message: string, path: string = '/api/test', method: string = 'GET', details?: string) => ({
    status: 500,
    jsonBody: createExpectedErrorResponse('INTERNAL_ERROR', message, path, method, details)
  })
};