import { Express } from "express";
import PgDatabase from "../config/pg.raw.config";
import PinoLogger from "../config/log/pino/pino";
import GlobalErrorHandler from "../middleware/error.middleware";
import UserModule from "../modules/user/user.module";
import ContactModule from "../modules/contact/contact.module";

class Bootstrapp {

  static init(app: Express) : void {
    
    const urlApi = process.env.URL_API || "/api/v1";

    const logger = new PinoLogger();
    const pgDatabase = new PgDatabase();
    const globalErrorHandler = new GlobalErrorHandler(logger);

    const userRouter = UserModule.init({ pool: pgDatabase.getPool(), logger });
    const contactRouter = ContactModule.init({ pool: pgDatabase.getPool(), logger });

    app.use(urlApi, userRouter);
    app.use(urlApi, contactRouter);
    app.use(globalErrorHandler.handleError.bind(globalErrorHandler));
  }
}

export default Bootstrapp;