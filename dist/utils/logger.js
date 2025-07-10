import { config } from '../config/index.js';
export class Logger {
    name;
    enabled;
    level;
    constructor(name) {
        this.name = name;
        this.enabled = config.logging.enabled;
        this.level = config.logging.level;
    }
    shouldLog(level) {
        if (!this.enabled)
            return false;
        const levels = ['debug', 'info', 'warn', 'error'];
        const currentLevelIndex = levels.indexOf(this.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= currentLevelIndex;
    }
    formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.name}]`;
        if (data) {
            return `${prefix} ${message} ${JSON.stringify(data)}`;
        }
        return `${prefix} ${message}`;
    }
    debug(message, data) {
        if (this.shouldLog('debug')) {
            console.error(this.formatMessage('debug', message, data));
        }
    }
    info(message, data) {
        if (this.shouldLog('info')) {
            console.error(this.formatMessage('info', message, data));
        }
    }
    warn(message, data) {
        if (this.shouldLog('warn')) {
            console.error(this.formatMessage('warn', message, data));
        }
    }
    error(message, error) {
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
export function createLogger(name) {
    return new Logger(name);
}
//# sourceMappingURL=logger.js.map