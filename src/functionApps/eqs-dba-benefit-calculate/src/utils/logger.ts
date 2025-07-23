import { CONFIG } from '../config/constants';
import { logger } from './custom-logger';

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
  data?: any;
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
  
  static addStep(processId: string, method: string, stepType: 'START' | 'END' | 'ERROR', data?: any): void {
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

export function AutoLog<T extends { new (...args: any[]): {} }>(
  configOrTarget?: AutoLogConfig | T,
): any {
  if (typeof configOrTarget === 'function') {
    return applyAutoLog(configOrTarget, defaultConfig);
  } else {
    const config = { ...defaultConfig, ...configOrTarget };
    return (target: T) => applyAutoLog(target, config);
  }
}

function applyAutoLog<T extends { new (...args: any[]): {} }>(
  constructor: T,
  config: AutoLogConfig
): T {
  const className = constructor.name;
  
  return class extends constructor {
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
        
        const originalMethod = (this as any)[methodName];
        if (typeof originalMethod === 'function') {
          (this as any)[methodName] = createLoggedMethod(
            originalMethod,
            methodName,
            className,
            config
          );
        }
      });
    }
  } as T;
}

function createLoggedMethod(
  originalMethod: Function,
  methodName: string,
  className: string,
  config: AutoLogConfig
) {
  return async function(this: any, ...args: any[]) {
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
    const logData = {
      processId,
      className,
      method: methodName,
      ...(config.includeArgs && { 
        args: sanitizeLogData(args) 
      })
    };
    
    logger[config.logLevel!.toLowerCase()](`${config.logPrefix} - ${className}.${methodName} START`, logData);
    ProcessContext.addStep(processId, methodName, 'START', logData);
    
    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - startTime;
      
      const endLogData = {
        processId,
        className,
        method: methodName,
        duration: `${duration}ms`
      };
      
      logger[config.logLevel!.toLowerCase()](`${config.logPrefix} - ${className}.${methodName} END`, endLogData);
      ProcessContext.addStep(processId, methodName, 'END', endLogData);
      
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
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const errorLogData = {
        processId,
        className,
        method: methodName,
        duration: `${duration}ms`,
        error: {
          message: error.message,
          stack: error.stack
        }
      };
      
      logger.error(`${config.logPrefix} - ${className}.${methodName} ERROR`, errorLogData);
      ProcessContext.addStep(processId, methodName, 'ERROR', errorLogData);
      
      if (isProcessStart || isProcessEnd) {
        const processInfo = ProcessContext.complete(processId);
        if (processInfo) {
          logger.error(`${config.logPrefix} - PROCESS FAILED`, {
            processId,
            operation: processInfo.operation,
            totalDuration: `${processInfo.duration}ms`,
            stepsCount: processInfo.steps.length,
            error: error.message
          });
        }
      }
      
      throw error;
    }
  };
}

function extractOrGenerateProcessId(args: any[], processIdKey: string): string {
  for (const arg of args) {
    if (arg && typeof arg === 'object') {
      if (arg.memberId) return arg.memberId;
      if (arg.processInstanceId) return arg.processInstanceId;
      if (arg[processIdKey]) return arg[processIdKey];
      if (arg.taskId) return arg.taskId;
      if (arg.id) return arg.id;
    }
  }
  
  if (args.length > 0 && typeof args[0] === 'string' && args[0].length > 3) {
    return args[0];
  }
  
  return `process-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getAllMethodNames(prototype: any): string[] {
  const methods: string[] = [];
  let current = prototype;
  
  while (current && current !== Object.prototype) {
    const names = Object.getOwnPropertyNames(current);
    names.forEach(name => {
      if (name !== 'constructor' && 
          typeof current[name] === 'function' && 
          !methods.includes(name)) {
        methods.push(name);
      }
    });
    current = Object.getPrototypeOf(current);
  }
  
  return methods;
}

function sanitizeLogData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item));
  }
  
  if (typeof data === 'object') {
    const sanitized: any = {};
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

