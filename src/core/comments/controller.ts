import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ValidateDtoMiddleware } from '../../rest/middleware/validate-request.js';
import { DocumentExistsMiddleware } from '../../rest/middleware/document-exists.js';
import { plainToInstance } from 'class-transformer';
import { PrivateRouteMiddleware } from '../../rest/middleware/private-route.js';
import { BaseController } from '../../rest/controller/baseController.js';
import { AppComponents } from '../../types/appComponents.js';
import { LoggerInterface } from '../logger.js';
import { CommentServiceInterface } from './commentServiceInterface.js';
import { OfferServiceInterface } from '../offers/offerServiceInterface.js';
import { HttpMethod } from '../../rest/types/httpMethod.js';
import CommentResponse, { CreateCommentRequest } from './dto.js';
import { ParamsOffer } from '../offers/controller.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(AppComponents.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponents.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponents.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentRequest),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async index({ params }: Request<ParamsOffer>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, plainToInstance(CommentResponse, comments, { excludeExtraneousValues: true }));
  }

  public async create({ body, params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.commentService.createForOffer({
      ...body,
      offerId: params.offerId,
      authorId: user.id,
    });

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, plainToInstance(CommentResponse, comments, { excludeExtraneousValues: true }));
  }
}
