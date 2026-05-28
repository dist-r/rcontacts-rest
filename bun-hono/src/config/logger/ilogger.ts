export default interface ILogger {

  debug(message: string, meta?: Record<string, unknown>) : void;
  info(message: string, meta?: Record<string, unknown>) : void;
  warn(message: string, meta?: Record<string, unknown>) : void;
  error(message: string, err?: unknown, meta?: Record<string, unknown>) : void;

}