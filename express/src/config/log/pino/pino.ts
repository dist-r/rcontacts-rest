import pino, { Logger } from "pino";
import ILogger from "../ilogger";

class PinoLogger implements ILogger {

  private logger: Logger;

  constructor() {

    const args = process.argv.slice(2);

    const isProduction =
      args.includes("--production");

    const level =
      isProduction ? "info" : "debug";

    const transportStdout = {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    };

    const transport =
      isProduction
        ? undefined
        : transportStdout;

    this.logger = pino({
      level,
      transport,
    });
  }

  debug(
    message: string,
    meta?: Record<string, unknown>
  ): void {
    this.logger.debug(meta, message);
  }

  info(
    message: string,
    meta?: Record<string, unknown>
  ): void {
    this.logger.info(meta, message);
  }

  warn(
    message: string,
    meta?: Record<string, unknown>
  ): void {
    this.logger.warn(meta, message);
  }

  error(
    message: string,
    err?: unknown,
    meta?: Record<string, unknown>
  ): void {

    this.logger.error(
      {
        ...meta,
        err,
      },
      message,
    );
  }
}

export default PinoLogger;