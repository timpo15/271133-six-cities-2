import { nanoid } from 'nanoid';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middlewareInterface.js';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      },
    });

    const uploadSingleFileMiddleware = multer({ storage }).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
