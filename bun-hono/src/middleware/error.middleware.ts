import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { ApiResponse } from "../common/api.response";
import AppError from "../common/api.error";

export default function globalErrorHandler(err: Error, c: Context){


  let message = err.message
  let statusCode : StatusCode = 500
  if (err instanceof AppError) {
    message = err.message
    statusCode = err.statusCode
  }
  
  const response : ApiResponse<null> = {
    message,
    success: false,
    data: null
  }
  c.status(statusCode)
  return c.json(response)
  
}