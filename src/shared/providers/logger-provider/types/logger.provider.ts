export abstract class LoggerProvider {
  abstract log(message: any, context?: string): void;
  abstract fatal(message: any, context?: string): void;
  abstract error(message: any, context?: string): void;
  abstract warn(message: any, context?: string): void;
  abstract debug?(message: any, context?: string): void;
  abstract verbose?(message: any, context?: string): void;
}
