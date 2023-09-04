import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    const code = 'TokenExpiredError';

    switch (exception.constructor) {
      case jwt.TokenExpiredError:
        status = 401;
        message = (exception as jwt.TokenExpiredError).message;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const error = {
      message,
      statusCode: status,
      code,
      path: request.url,
      timestamp: new Date(),
    };

    response.status(status).json(error);
  }
}
