import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ZodError) {
      res.status(400).json({
        errors: [exception.errors],
      });
    } else if (exception instanceof HttpException) {
      res.status(exception.getStatus()).json({
        errors: [exception.getResponse()],
      });
    } else {
      res.status(500).json({
        errors: [exception.message],
      });
    }
  }
}
