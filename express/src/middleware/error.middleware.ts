import { Request, Response } from "express";
import AppError from "../shared/custom.error";
import ApiResponse from "../shared/api.response";
import ILogger from "../config/log/ilogger";

class GlobalErrorHandler 
{
  constructor(private logger: ILogger) {}

  public handleError(err: any, _req: Request, res: Response): void {
    
    if (err instanceof AppError){
      this.logger.error(`AppError: ${err.message}`);
      const apiResponse: ApiResponse<null> = {
        message: err.message,
        data: null
      };
      res.status(err.statusCode).json(apiResponse);
    } else {
      const apiResponse: ApiResponse<null> = {
        message: "Internal Server Error",
        data: null
      };
      res.status(500).json(apiResponse);
    }
  }
}

export default GlobalErrorHandler;