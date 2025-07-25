// eslint-disable-next-line @typescript-eslint/no-require-imports
const originalLogger = require('@novigi/logger');
import { LogData } from '../models/types';

interface LoggerMethods {
  setLevel?(level: string): void;
  setColors?(enabled: boolean): void;
  [key: string]: unknown;
}

class CustomLogger {
  private logger: LoggerMethods;

  constructor() {
    this.logger = originalLogger as LoggerMethods;
  }

  private formatMessage(level: string, message: string, data?: LogData): void {
    const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
    
    if (data && Object.keys(data).length > 0) {
      console.log(`${timestamp} - ${level.toUpperCase()} - ${message}`, data);
    } else {
      console.log(`${timestamp} - ${level.toUpperCase()} - ${message}`);
    }
  }

  debug(message: string, data?: LogData): void {
    this.formatMessage('debug', message, data);
  }

  info(message: string, data?: LogData): void {
    this.formatMessage('info', message, data);
  }

  warn(message: string, data?: LogData): void {
    this.formatMessage('warn', message, data);
  }

  error(message: string, data?: LogData): void {
    this.formatMessage('error', message, data);
  }

  setLevel(level: string): void {
    if (this.logger.setLevel) {
      this.logger.setLevel(level);
    }
  }

  setColors(enabled: boolean): void {
    if (this.logger.setColors) {
      this.logger.setColors(enabled);
    }
  }
}

export const logger = new CustomLogger();

export { CustomLogger };