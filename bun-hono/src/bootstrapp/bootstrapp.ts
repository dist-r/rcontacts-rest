import {logger} from "hono/logger"
import {cors} from "hono/cors"
import {Hono, Context} from "hono"

// APP ENVIRONTMENT
import globalErrorHandler from "../middleware/error.middleware";
import ILogger from "../config/logger/ilogger";
import PinoLogger from "../config/logger/logger.pino";

// PG ENVIRONTMENT
import poolPg from "../config/postgres.raw";

// MODULE
import ContactModule from "../modules/contact/contact.module";
import UserModule from "../modules/user/user.module";

async function bootstrapp () {
  
  const urlApiVersion = process.env.API_VERSION as string || "/api/v2"
  const db = poolPg

  const app = new Hono()
  const loggerApp = new PinoLogger()

  // GLOBAL ERROR HANDLER

  app.onError((err : Error, c : Context) => globalErrorHandler(err, c, loggerApp))

  // GLOBAL Middlewar
  app.use(logger())
  app.use(cors())
  
  // MODULE
  const contactModule = ContactModule.init({pool: db, logger: loggerApp})
  app.route(urlApiVersion, contactModule)

  const userModule = UserModule.init({pool: db, logger: loggerApp})
  app.route(urlApiVersion, userModule)
  
  return app
}

export default bootstrapp;
