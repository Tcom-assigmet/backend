export interface StartProcessRequest {
    firstName: string;
    lastName: string;
    memberId: string;
    dateOfBirth: string;
    dateJoinedFund: string;
    effectiveDate: string;
    calculationDate: string;
    benefitClass: string;
    paymentType: string;
    planNumber: string;
    paymentTypeDesc: string;
}

export type VariableValue = {
  value:  string | number | boolean | Date
  type:  string | number | boolean | Date;
};

export interface CompleteTaskRequest {
    processInstanceId: string;
    variables: Record<string, VariableValue>;
    [key: string]: unknown; // Index signature for flexibility
}

export interface ProcessResponse {
    processInstanceId: string;
    taskId: string;
    requiredFields: RequiredField[];
}

export interface RequiredField {
    name: string;
    type: string;
    label?: string;
    required?: boolean;
}

export interface MemberData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateJoinedFund: string;
    memberId: string;
    effectiveDate: string;
    calculationDate: string;
    benefitClass: string;
    planNumber: string;
    paymentType: string;
    paymentTypeDesc: string;
    maxBenMult: string;
    othMult3: string;
    othMult5: string;
    sgMaxContBase: string;
    mbrSGM: string;
    SGM: string;
    fixedSpecSGMult: string;
    accRetMult_PriorDt: string;
    finalAvSal: string;
    discFactA: string;
    dateBenAccr: string;
    accBenMult: string;
    accRetMult: string;
    addtnlSG: string;
    addtnlSGAcct: string;
    addtnlVolDeath: string;
    compAddtnlAcct: string;
    cpiVal1: string;
    cpiVal2: string;
    dbOffsetAcct: string;
    deathMult: string;
    discFactB: string;
    discFactC: string;
    discFactD: string;
    empNotnlAcct: string;
    famLawAcctVal: string;
    fas_920630: string;
    fas_CalcDate: string;
    FutSrvc: string;
    interest: string;
    mbrAcct: string;
    mbrContAcct: string;
    mbrEquitShare: string;
    mbrVolAcct: string;
    notnlInitBal: string;
    notnlAcct: string;
    notnlSgAcct: string;
    notnlSgBal: string;
    othBen1: string;
    othBen2: string;
    othMult1: string;
    othMult2: string;
    othMult4: string;
    oteAddtnl: string;
    rolloverAcct: string;
    salary: string;
    sgAcct: string;
    srchrgAcct: string;
    vestFactA: string;
    sgNotionalAccount: string;
    memberContributions: string;
    finalAvSalForMrb2: string;
}

export interface SubProcessData {
    pymntAmt: string;
    minBenCheck: string;
    maxBenCheck: string;
    totalVolAcctsAdd: string;
    totalVolAcctsSub: string;
    totalVolAcctsNet: string;
}

export interface FinalResultResponse {
    success: boolean;
    message: string;
    processInstanceId: string;
    taskId: string | null;
    memberData: MemberData;
    subProcessData: SubProcessData;
}

// New type definitions for better type safety

// Camunda API client types
export interface CamundaClient {
    header(name: string, value: string): CamundaClient;
    get(path: string): CamundaClient;
    post(path: string): CamundaClient;
    body(data: unknown): CamundaClient;
    response(): Promise<CamundaResponse>;
}

export interface CamundaResponse {
    body: string | CamundaResponseBody;
    status: number;
}

export interface CamundaResponseBody {
    id?: string;
    [key: string]: unknown;
}

// Process variables types
export interface CamundaVariable {
    value: string | number | boolean | Date | null;
    type: 'String' | 'Double' | 'Boolean' | 'Date' | 'Long';
}

export interface CamundaVariables {
    [key: string]: CamundaVariable;
}

// Task and process types
export interface CamundaTask {
    id: string;
    name?: string;
    processInstanceId: string;
    [key: string]: unknown;
}

export interface CamundaProcessInstance {
    id: string;
    definitionId?: string;
    businessKey?: string;
    ended?: boolean;
    suspended?: boolean;
    [key: string]: unknown;
}

export interface HistoricProcessInstance {
    id: string;
    startTime: string;
    endTime: string | null;
    durationInMillis: number | null;
    [key: string]: unknown;
}

export interface ProcessVariableInstance {
    name: string;
    type: string;
    value: unknown;
    processInstanceId: string;
    [key: string]: unknown;
}

// Logger types
export interface LogData {
    [key: string]: LogValue;
}

export type LogValue = 
    | string 
    | number 
    | boolean 
    | Date 
    | null 
    | undefined 
    | LogValue[] 
    | { [key: string]: LogValue }
    | unknown;

export interface ProcessStepData {
    processId?: string;
    className?: string;
    method?: string;
    duration?: string;
    args?: LogValue[];
    error?: {
        message: string;
        stack?: string;
    };
    [key: string]: LogValue;
}

// Constructor type for decorators
export type Constructor<T = {}> = new (...args: unknown[]) => T;

// Function types for method decoration
export type AsyncMethod = (...args: unknown[]) => Promise<unknown>;
export type SyncMethod = (...args: unknown[]) => unknown;
export type AnyMethod = AsyncMethod | SyncMethod;

// Error types
export interface ErrorWithMessage {
    message: string;
    stack?: string;
    name?: string;
    [key: string]: unknown;
}

// Response data types for helpers
export type ResponseData = 
    | string 
    | number 
    | boolean 
    | null 
    | ResponseData[] 
    | { [key: string]: ResponseData }
    | FinalResultResponse
    | ProcessResponse
    | RequiredField[]
    | { taskId: string; requiredFields: RequiredField[] };

// API client factory function type
export type ApiClientFactory = (baseUrl: string) => CamundaClient;
