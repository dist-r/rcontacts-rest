import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { ApiResponse } from "../common/api.response";
import AppError from "../common/api.error";
import ILogger from "../config/logger/ilogger";

export default function globalErrorHandler(err: Error, c: Context, logger: ILogger){

  if (err instanceof AppError) {
      logger.debug("BusinissError Flow")
      const response : ApiResponse<null> = {
        message: err.message,
        success: false,
        data: null
      }
      c.status(err.statusCode)
      return c.json(response)
  } else {
      logger.error("InternalServerError Flow")
      const response : ApiResponse<null> = {
        message: "Internal Server Error",
        success: false,
        data: null
      }
      c.status(500)
      return c.json(response)
  }
  
}