import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AppError } from "src/shared/app.error";
import { ApiResponse } from "src/shared/api.response";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    let statusDefault = HttpStatus.INTERNAL_SERVER_ERROR;

    let messageDefault = "Internal server error";

    if (exception instanceof AppError) {
      statusDefault = exception.code;
      messageDefault = exception.message;
    }

    if (exception instanceof HttpException) {
      statusDefault = exception.getStatus();
      messageDefault = exception.message;
    }

    response.status(statusDefault).json(
      new ApiResponse<null>(false, messageDefault, null)
    );
  }
}