import { Request, Response , NextFunction } from "express";
import AppError from "../shared/custom.error";
import ApiResponse from "../shared/api.response";
import ILogger from "../config/log/ilogger";
import { ZodError } from "zod";

class GlobalErrorHandler 
{
  constructor(private logger: ILogger) {}

  public handleError(err: any, _req: Request, res: Response, _next: NextFunction): void {
    
    if (err instanceof AppError){
      this.logger.error(`AppError: ${err.message}`);
      const apiResponse: ApiResponse<null> = {
        message: err.message,
        success: false,
        data: null,
      };
      res.status(err.statusCode).json(apiResponse);
    } else if (err instanceof ZodError) {
      this.logger.error(`Validation Error: ${err.message}`);
      const apiResponse: ApiResponse<null> = {
        message: "Validation Error",
        success: false,
        data: null
      };
      res.status(400).json(apiResponse);
    } else {
      this.logger.error(`Internal Server Error: ${err.message}`);
      const apiResponse: ApiResponse<null> = {
        message: "Internal Server Error",
        success: false,
        data: null
      };
      res.status(500).json(apiResponse);
    }
  }
}

export default GlobalErrorHandler;