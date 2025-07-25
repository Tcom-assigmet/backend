import { HttpRequest, InvocationContext } from '@azure/functions';

export function createMockHttpRequest(overrides: Partial<HttpRequest> = {}): HttpRequest {
  return {
    json: jest.fn(),
    text: jest.fn(),
    arrayBuffer: jest.fn(),
    formData: jest.fn(),
    blob: jest.fn(),
    clone: jest.fn(),
    url: '/api/test',
    method: 'GET',
    headers: {} as any,
    query: {} as any,
    params: {},
    user: {} as any,
    body: null,
    bodyUsed: false,
    ...overrides
  } as HttpRequest;
}

export function createMockInvocationContext(): jest.Mocked<InvocationContext> {
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