import pino, { Logger } from "pino";
import ILogger from "../ilogger";

class PinoLogger implements ILogger {

  private logger: Logger;
  
  constructor() {
    this.logger = pino(
      {
        level: process.env.LOG_LEVEL || "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        },
      },
    );
  }

  debug(payload: unknown) {
    this.logger.debug(payload);
  }

  info(payload: unknown) {
    this.logger.info(payload);
  }

  warn(payload: unknown) {
    this.logger.warn(payload);
  }

  error(payload: unknown) {
    this.logger.error(payload 
    );
  }
}

export default PinoLogger;