import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const message = exception.message
      .match(/\n[^\n]+$/)
      ?.toString()
      .replace(/\n/, '');

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        res.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }
      case 'P2003': {
        const status = HttpStatus.BAD_REQUEST;
        res.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }
      case 'P2019': {
        const status = HttpStatus.BAD_REQUEST;
        res.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }
      case 'P2021': {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        res.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        res.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }
      default: {
        super.catch(exception, host);
        break;
      }
    }
  }
}
