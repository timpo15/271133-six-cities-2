import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ValidateDtoMiddleware } from '../../rest/middleware/validate-request.js';
import { ValidateObjectIdMiddleware } from '../../rest/middleware/validate-object-id.js';
import { DocumentExistsMiddleware } from '../../rest/middleware/document-exists.js';
import { CreateOfferRequest, FavoriteOfferShortResponse, OfferResponse, UpdateOfferRequest } from './dto.js';
import { plainToInstance } from 'class-transformer';
import { ParamsDictionary } from 'express-serve-static-core';
import { PrivateRouteMiddleware } from '../../rest/middleware/private-route.js';
import { HttpError } from '../../rest/exceptions/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '../../rest/controller/baseController.js';
import { AppComponents } from '../../types/appComponents.js';
import { LoggerInterface } from '../logger.js';
import { OfferServiceInterface } from './offerServiceInterface.js';
import { UserServiceInterface } from '../users/userServiceInterface.js';
import { CommentServiceInterface } from '../comments/commentServiceInterface.js';
import { HttpMethod } from '../../rest/types/httpMethod.js';

export type ParamsOffer =
  | {
      offerId: string;
    }
  | ParamsDictionary;

export type ParamsCity =
  | {
      city: string;
    }
  | ParamsDictionary;

export type ParamsStatus =
  | {
      status: string;
    }
  | ParamsDictionary;

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(AppComponents.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponents.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponents.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponents.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.addRoute({
      path: '/offers',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/offers',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferRequest)],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferRequest),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId')],
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.showPremium,
    });

    this.addRoute({
      path: '/favorite/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.updateFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.showFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  public async index({ params }: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offerCount = params.count ? parseInt(`${params.count}`, 10) : undefined;
    const offers = await this.offerService.find(offerCount);
    this.ok(res, plainToInstance(OfferResponse, offers, { excludeExtraneousValues: true }));
  }

  public async create(
    { body, user }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferRequest>,
    res: Response,
  ): Promise<void> {
    body.host = user.id;
    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async show({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (offer) {
      offer.isFavorite = await this.userService.checkFavorite(user.id, params.offerId);
    }
    this.ok(res, plainToInstance(OfferResponse, offer, { excludeExtraneousValues: true }));
  }

  public async update(
    { params, body, user }: Request<ParamsOffer, unknown, UpdateOfferRequest>,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    if (offer.host.id.toString() !== user.id) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden');
    }
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, plainToInstance(OfferResponse, updatedOffer, { excludeExtraneousValues: true }));
  }

  public async delete({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    if (offer.host.id.toString() !== user.id) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden');
    }
    await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteByOfferId(params.offerId);
    this.noContent(res, `Offer ${params.offerId} deleted`);
  }

  public async showPremium({ query }: Request<ParamsCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(query.city as string);
    this.ok(res, plainToInstance(OfferResponse, offers, { excludeExtraneousValues: true }));
  }

  public async showFavorites({ user }: Request, _res: Response): Promise<void> {
    const offersIds = await this.userService.findFavorites(user.id);
    const offers = await this.offerService.findByIds(offersIds);
    this.ok(_res, plainToInstance(FavoriteOfferShortResponse, offers, { excludeExtraneousValues: true }));
  }

  public async updateFavorite(req: Request<ParamsOffer & ParamsStatus>, res: Response): Promise<void> {
    const { params, user } = req;
    if (params.status === '1') {
      await this.userService.addToFavoritesById(user.id, params.offerId);
      return this.show(req, res);
    } else if (params.status === '0') {
      await this.userService.removeFromFavoritesById(user.id, params.offerId);
      return this.show(req, res);
    } else {
      throw new Error('Invalid status');
    }
  }
}
