import { CONFIG } from '../config/constants';
import { logger } from './custom-logger';
import { 
  Constructor, 
  LogData, 
  LogValue, 
  ProcessStepData, 
  ErrorWithMessage,
  AsyncMethod
} from '../models/types';

interface AutoLogConfig {
  enabled?: boolean; 
  logLevel?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  includeArgs?: boolean;
  includeResult?: boolean;
  excludeMethods?: string[];
  processIdKey?: string;
  logPrefix?: string;
}

interface ProcessInfo {
  id: string;
  operation: string;
  className: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  steps: ProcessStep[];
}

interface ProcessStep {
  method: string;
  stepType: 'START' | 'END' | 'ERROR';
  timestamp: number;
<<<<<<< HEAD
  data?: LogData;
=======
  data?: ProcessStepData;
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
}

// Define proper types for log data
type LogData = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined
  | LogData[] 
  | { [key: string]: LogData }
  | {
      processId?: string;
      className?: string;
      method?: string;
      duration?: string;
      args?: LogData[];
      error?: {
        message: string;
        stack?: string;
      };
    };

// Type for constructor function that works with mixins
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T;

const defaultConfig: AutoLogConfig = {
  enabled: CONFIG.ENABLE_OPERATION_LOGGING, 
  logLevel: 'DEBUG',
  includeArgs: false,
  includeResult: false,
  excludeMethods: ['constructor'],
  processIdKey: 'processId',
  logPrefix: 'AutoLog'
};

class ProcessContext {
  private static contexts = new Map<string, ProcessInfo>();
  
  static create(processId: string, operation: string, className: string): void {
    this.contexts.set(processId, {
      id: processId,
      operation,
      className,
      startTime: Date.now(),
      steps: []
    });
  }
  
<<<<<<< HEAD
  static addStep(processId: string, method: string, stepType: 'START' | 'END' | 'ERROR', data?: LogData): void {
=======
  static addStep(processId: string, method: string, stepType: 'START' | 'END' | 'ERROR', data?: ProcessStepData): void {
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
    const context = this.contexts.get(processId);
    if (context) {
      context.steps.push({
        method,
        stepType,
        timestamp: Date.now(),
        data
      });
    }
  }
  
  static complete(processId: string): ProcessInfo | undefined {
    const context = this.contexts.get(processId);
    if (context) {
      context.endTime = Date.now();
      context.duration = context.endTime - context.startTime;
      this.contexts.delete(processId);
      return context;
    }
    return undefined;
  }
  
  static get(processId: string): ProcessInfo | undefined {
    return this.contexts.get(processId);
  }
}

<<<<<<< HEAD
// Overloaded function signatures for AutoLog
export function AutoLog<T extends Constructor>(target: T): T;
export function AutoLog(config: AutoLogConfig): <T extends Constructor>(target: T) => T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AutoLog<T extends Constructor>(configOrTarget?: AutoLogConfig | T): any {
=======
export function AutoLog<T extends Constructor>(
  configOrTarget?: AutoLogConfig | T,
): any {
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
  if (typeof configOrTarget === 'function') {
    return applyAutoLog(configOrTarget, defaultConfig);
  } else {
    const config = { ...defaultConfig, ...configOrTarget };
    return <U extends Constructor>(target: U) => applyAutoLog(target, config);
  }
}

function applyAutoLog<T extends Constructor>(
  constructor: T,
  config: AutoLogConfig
): T {
  const className = constructor.name;
  
<<<<<<< HEAD
  return class extends constructor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
=======
  class LoggedClass extends (constructor as any) {
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
    constructor(...args: any[]) {
      super(...args);
      
      if (!config.enabled) {
        return;
      }
      
      const methodNames = getAllMethodNames(constructor.prototype);
      
      methodNames.forEach(methodName => {
        if (config.excludeMethods?.includes(methodName)) {
          return;
        }
        
<<<<<<< HEAD
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const originalMethod = (this as any)[methodName];
        if (typeof originalMethod === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this as any)[methodName] = createLoggedMethod(
            originalMethod,
=======
        const originalMethod = (this as Record<string, unknown>)[methodName];
        if (typeof originalMethod === 'function') {
          (this as Record<string, unknown>)[methodName] = createLoggedMethod(
            originalMethod as AsyncMethod,
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
            methodName,
            className,
            config
          );
        }
      });
    }
  }
  
  return LoggedClass as T;
}

function createLoggedMethod(
<<<<<<< HEAD
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalMethod: (...args: any[]) => any,
  methodName: string,
  className: string,
  config: AutoLogConfig
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async function(this: any, ...args: any[]) {
=======
  originalMethod: AsyncMethod,
  methodName: string,
  className: string,
  config: AutoLogConfig
): AsyncMethod {
  return async function(this: Record<string, unknown>, ...args: unknown[]): Promise<unknown> {
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
    if (!config.enabled) {
      return await originalMethod.apply(this, args);
    }
    
    const processId = extractOrGenerateProcessId(args, config.processIdKey!);
    const isProcessStart = methodName === 'startProcess' || methodName.includes('start');
    const isProcessEnd = methodName === 'completeTask' || methodName.includes('complete');
    
    if (isProcessStart) {
      ProcessContext.create(processId, methodName, className);
    }
    
    const startTime = Date.now();
    const logData: LogData = {
      processId,
      className,
      method: methodName,
      ...(config.includeArgs && { 
        args: sanitizeLogData(args) as LogData[]
      })
    };
    
    const logLevel = config.logLevel!.toLowerCase() as 'debug' | 'info' | 'warn' | 'error';
<<<<<<< HEAD
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (logger as any)[logLevel](`${config.logPrefix} - ${className}.${methodName} START`, logData);
    ProcessContext.addStep(processId, methodName, 'START', logData);
=======
    logger[logLevel](
      `${config.logPrefix} - ${className}.${methodName} START`, 
      logData
    );
    ProcessContext.addStep(processId, methodName, 'START', logData as ProcessStepData);
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
    
    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - startTime;
      
      const endLogData: LogData = {
        processId,
        className,
        method: methodName,
        duration: `${duration}ms`
      };
      
<<<<<<< HEAD
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (logger as any)[logLevel](`${config.logPrefix} - ${className}.${methodName} END`, endLogData);
      ProcessContext.addStep(processId, methodName, 'END', endLogData);
=======
      logger[logLevel](
        `${config.logPrefix} - ${className}.${methodName} END`, 
        endLogData
      );
      ProcessContext.addStep(processId, methodName, 'END', endLogData as ProcessStepData);
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
      
      if (isProcessEnd) {
        const processInfo = ProcessContext.complete(processId);
        if (processInfo) {
          logger.info(`${config.logPrefix} - PROCESS COMPLETED`, {
            processId,
            operation: processInfo.operation,
            totalDuration: `${processInfo.duration}ms`,
            stepsCount: processInfo.steps.length,
            steps: processInfo.steps.map(step => ({
              method: step.method,
              type: step.stepType,
              timestamp: new Date(step.timestamp).toISOString()
            }))
          });
        }
      }
      
      return result;
    } catch (error: unknown) {
<<<<<<< HEAD
      const duration = Date.now() - startTime;
      const err = error as Error;
=======
      const errorObj = error as ErrorWithMessage;
      const duration = Date.now() - startTime;
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
      const errorLogData: LogData = {
        processId,
        className,
        method: methodName,
        duration: `${duration}ms`,
        error: {
<<<<<<< HEAD
          message: err.message,
          stack: err.stack
=======
          message: errorObj.message || 'Unknown error',
          stack: errorObj.stack
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
        }
      };
      
      logger.error(`${config.logPrefix} - ${className}.${methodName} ERROR`, errorLogData);
      ProcessContext.addStep(processId, methodName, 'ERROR', errorLogData as ProcessStepData);
      
      if (isProcessStart || isProcessEnd) {
        const processInfo = ProcessContext.complete(processId);
        if (processInfo) {
          logger.error(`${config.logPrefix} - PROCESS FAILED`, {
            processId,
            operation: processInfo.operation,
            totalDuration: `${processInfo.duration}ms`,
            stepsCount: processInfo.steps.length,
<<<<<<< HEAD
            error: err.message
=======
            error: errorObj.message || 'Unknown error'
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
          });
        }
      }
      
      throw error;
    }
  };
}

<<<<<<< HEAD
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractOrGenerateProcessId(args: any[], processIdKey: string): string {
  for (const arg of args) {
    if (arg && typeof arg === 'object' && arg !== null) {
      if (arg.memberId && typeof arg.memberId === 'string') return arg.memberId;
      if (arg.processInstanceId && typeof arg.processInstanceId === 'string') return arg.processInstanceId;
      if (arg[processIdKey] && typeof arg[processIdKey] === 'string') return arg[processIdKey];
      if (arg.taskId && typeof arg.taskId === 'string') return arg.taskId;
      if (arg.id && typeof arg.id === 'string') return arg.id;
=======
function extractOrGenerateProcessId(args: unknown[], processIdKey: string): string {
  for (const arg of args) {
    if (arg && typeof arg === 'object') {
      const obj = arg as Record<string, unknown>;
      if (typeof obj.memberId === 'string') return obj.memberId;
      if (typeof obj.processInstanceId === 'string') return obj.processInstanceId;
      if (typeof obj[processIdKey] === 'string') return obj[processIdKey] as string;
      if (typeof obj.taskId === 'string') return obj.taskId;
      if (typeof obj.id === 'string') return obj.id;
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
    }
  }
  
  if (args.length > 0 && typeof args[0] === 'string' && args[0].length > 3) {
    return args[0];
  }
  
  return `process-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

<<<<<<< HEAD
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAllMethodNames(prototype: any): string[] {
=======
function getAllMethodNames(prototype: object): string[] {
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
  const methods: string[] = [];
  let current = prototype;
  
  while (current && current !== Object.prototype) {
    const names = Object.getOwnPropertyNames(current);
    names.forEach(name => {
      if (name !== 'constructor' && 
          typeof (current as Record<string, unknown>)[name] === 'function' && 
          !methods.includes(name)) {
        methods.push(name);
      }
    });
    current = Object.getPrototypeOf(current) as object;
  }
  
  return methods;
}

<<<<<<< HEAD
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeLogData(data: any): LogData {
=======
function sanitizeLogData(data: unknown): LogValue {
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }
  
  if (data instanceof Date) {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item));
  }
  
  if (typeof data === 'object') {
<<<<<<< HEAD
    const sanitized: { [key: string]: LogData } = {};
=======
    const sanitized: { [key: string]: LogValue } = {};
>>>>>>> d4338e72701a55628774c3db4b3a7ad29be0d04c
    for (const [key, value] of Object.entries(data)) {
      if (typeof value !== 'function') {
        sanitized[key] = sanitizeLogData(value);
      }
    }
    return sanitized;
  }
  
  return String(data);
}

export { ProcessContext, type ProcessInfo, type ProcessStep };