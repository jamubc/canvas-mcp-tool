import { config } from '../config/index.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private name: string;
  private enabled: boolean;
  private level: LogLevel;

  constructor(name: string) {
    this.name = name;
    this.enabled = config.logging.enabled;
    this.level = config.logging.level;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.name}]`;
    
    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data)}`;
    }
    
    return `${prefix} ${message}`;
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.error(this.formatMessage('debug', message, data));
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.error(this.formatMessage('info', message, data));
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.error(this.formatMessage('warn', message, data));
    }
  }

  error(message: string, error?: any): void {
    if (this.shouldLog('error')) {
      const errorData = error instanceof Error ? {
        errorMessage: error.message,
        stack: error.stack,
        ...error
      } : error;
      
      console.error(this.formatMessage('error', message, errorData));
    }
  }
}

export function createLogger(name: string): Logger {
  return new Logger(name);
}