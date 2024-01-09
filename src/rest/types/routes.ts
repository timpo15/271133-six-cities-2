import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../middleware/middlewareInterface.js';

enum HttpMethod {
    Get = 'get',
    Post = 'post',
    Delete = 'delete',
    Patch = 'patch',
    Put = 'put',
}

export interface RouteInterface {
    path: string;
    method: HttpMethod;
    middlewares?: MiddlewareInterface[];
    handler: (req: Request, res: Response, next: NextFunction) => void;
}
