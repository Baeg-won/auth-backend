import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 모든 Exception 대해 처리
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 클라이언트에서 보낸 Request 정보와 반환할 Response 객체 정의
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // default 값 설정
    let status = HttpStatus.UNAUTHORIZED;
    let message = (exception as any).message.message;
    let code = 'UnauthorizedException';

    // 예외 상황에 따라 분기
    switch (exception.constructor) {
      case UnauthorizedException:
        message = (exception as UnauthorizedException).message;
        code = (exception as any).code;
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // 반환겂 초기화
    const error = {
      message,
      statusCode: status,
      code,
      path: request.url,
      timestamp: new Date(),
    };

    Logger.error(JSON.stringify(error));

    response.status(status).json(error);
  }
}
