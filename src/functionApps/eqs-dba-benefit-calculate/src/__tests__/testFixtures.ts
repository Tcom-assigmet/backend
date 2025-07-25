import { HttpRequest, InvocationContext } from '@azure/functions';
import { 
  StartProcessRequest, 
  FinalResultResponse, 
  CompleteTaskRequest, 
  ProcessResponse,
  RequiredField,
  MemberData,
  SubProcessData 
} from '../models/types';

// Common test data
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
    yearsOfService: { value: 10, type: 'Long' },
    department: { value: 'Engineering', type: 'String' }
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
  message: 'Process completed successfully',
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
    { name: 'yearsOfService', type: 'number', required: true },
    { name: 'department', type: 'string', required: false }
  ]
};

export const mockRequiredFields: RequiredField[] = [
  { name: 'salary', type: 'number', required: true, label: 'Annual Salary' },
  { name: 'yearsOfService', type: 'number', required: true, label: 'Years of Service' },
  { name: 'department', type: 'string', required: false, label: 'Department' },
  { name: 'bonusAmount', type: 'number', required: false, label: 'Bonus Amount' }
];

// Helper function to create a complete mock HTTP request
export function createTestHttpRequest(overrides: Partial<HttpRequest> = {}): HttpRequest {
  return {
    json: jest.fn(),
    text: jest.fn(),
    arrayBuffer: jest.fn(),
    formData: jest.fn(),
    blob: jest.fn(),
    clone: jest.fn(),
    url: '/api/test',
    method: 'GET',
    headers: new Headers(),
    query: new URLSearchParams(),
    params: {},
    user: undefined,
    body: null,
    bodyUsed: false,
    ...overrides
  } as HttpRequest;
}

// Helper function to create a complete mock invocation context
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

// Common mock responses for different scenarios
export const mockHttpResponses = {
  success: (data: any) => ({
    status: 200,
    jsonBody: { success: true, data, timestamp: new Date().toISOString() }
  }),
  
  created: (data: any) => ({
    status: 201,
    jsonBody: { success: true, data, timestamp: new Date().toISOString() }
  }),
  
  badRequest: (message: string) => ({
    status: 400,
    jsonBody: { 
      success: false, 
      error: { message, code: 'VALIDATION_ERROR' },
      timestamp: new Date().toISOString()
    }
  }),
  
  notFound: (message: string) => ({
    status: 404,
    jsonBody: { 
      success: false, 
      error: { message, code: 'NOT_FOUND' },
      timestamp: new Date().toISOString()
    }
  }),
  
  internalServerError: (message: string) => ({
    status: 500,
    jsonBody: { 
      success: false, 
      error: { message, code: 'INTERNAL_ERROR' },
      timestamp: new Date().toISOString()
    }
  })
};