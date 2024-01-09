import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middlewareInterface.js';
import { HttpError } from '../exceptions/http-error.js';

export class PrivateRouteMiddleware implements MiddlewareInterface {
  public async execute({ user }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'PrivateRouteMiddleware');
    }

    return next();
  }
}
