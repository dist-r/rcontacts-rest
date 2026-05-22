import { pino } from "pino";
import ILogger from "./ilogger";

const isDev = process.argv.includes("--dev");

// export const appLog = pino({
//   level: isDev ? "debug" : "info",
//   transport: {
//     target: "pino-pretty",
//     options: {
//       colorize: true,
//     },
//   },
// })

export default class PinoLogger implements ILogger{

  private logger = pino({
    level: isDev ? "debug" : "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  });

  debug(message: string, meta?: unknown): void {
    this.logger.debug(meta, message);
  }

  info(message: string, meta?: unknown): void {
    this.logger.info(meta, message);
  }

  warn(message: string, meta?: unknown): void {
    this.logger.warn(meta, message);
  }

  error(message: string, meta?: unknown): void {
    this.logger.error(meta, message);
  }

}