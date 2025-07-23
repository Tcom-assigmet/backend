const originalLogger = require('@novigi/logger');

interface LogData {
  [key: string]: any;
}

class CustomLogger {
  private logger: any;

  constructor() {
    this.logger = originalLogger;
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