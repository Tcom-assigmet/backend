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
  data?: ProcessStepData;
}

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
  
  static addStep(processId: string, method: string, stepType: 'START' | 'END' | 'ERROR', data?: ProcessStepData): void {
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

export function AutoLog<T extends Constructor>(
  configOrTarget?: AutoLogConfig | T,
): any {
  if (typeof configOrTarget === 'function') {
    return applyAutoLog(configOrTarget, defaultConfig);
  } else {
    const config = { ...defaultConfig, ...configOrTarget };
    return (target: T) => applyAutoLog(target, config);
  }
}

function applyAutoLog<T extends Constructor>(
  constructor: T,
  config: AutoLogConfig
): T {
  const className = constructor.name;
  
  class LoggedClass extends (constructor as any) {
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
        
        const originalMethod = (this as Record<string, unknown>)[methodName];
        if (typeof originalMethod === 'function') {
          (this as Record<string, unknown>)[methodName] = createLoggedMethod(
            originalMethod as AsyncMethod,
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
  originalMethod: AsyncMethod,
  methodName: string,
  className: string,
  config: AutoLogConfig
): AsyncMethod {
  return async function(this: Record<string, unknown>, ...args: unknown[]): Promise<unknown> {
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
        args: sanitizeLogData(args) 
      })
    };
    
    const logLevel = config.logLevel!.toLowerCase() as 'debug' | 'info' | 'warn' | 'error';
    logger[logLevel](
      `${config.logPrefix} - ${className}.${methodName} START`, 
      logData
    );
    ProcessContext.addStep(processId, methodName, 'START', logData as ProcessStepData);
    
    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - startTime;
      
      const endLogData: LogData = {
        processId,
        className,
        method: methodName,
        duration: `${duration}ms`
      };
      
      logger[logLevel](
        `${config.logPrefix} - ${className}.${methodName} END`, 
        endLogData
      );
      ProcessContext.addStep(processId, methodName, 'END', endLogData as ProcessStepData);
      
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
      const errorObj = error as ErrorWithMessage;
      const duration = Date.now() - startTime;
      const errorLogData: LogData = {
        processId,
        className,
        method: methodName,
        duration: `${duration}ms`,
        error: {
          message: errorObj.message || 'Unknown error',
          stack: errorObj.stack
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
            error: errorObj.message || 'Unknown error'
          });
        }
      }
      
      throw error;
    }
  };
}

function extractOrGenerateProcessId(args: unknown[], processIdKey: string): string {
  for (const arg of args) {
    if (arg && typeof arg === 'object') {
      const obj = arg as Record<string, unknown>;
      if (typeof obj.memberId === 'string') return obj.memberId;
      if (typeof obj.processInstanceId === 'string') return obj.processInstanceId;
      if (typeof obj[processIdKey] === 'string') return obj[processIdKey] as string;
      if (typeof obj.taskId === 'string') return obj.taskId;
      if (typeof obj.id === 'string') return obj.id;
    }
  }
  
  if (args.length > 0 && typeof args[0] === 'string' && args[0].length > 3) {
    return args[0];
  }
  
  return `process-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getAllMethodNames(prototype: object): string[] {
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

function sanitizeLogData(data: unknown): LogValue {
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
    const sanitized: { [key: string]: LogValue } = {};
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

