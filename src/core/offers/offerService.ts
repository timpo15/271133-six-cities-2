import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { AppComponents } from '../../types/appComponents.js';
import { OfferServiceInterface } from './offerServiceInterface.js';
import { LoggerInterface } from '../logger.js';
import { OfferEntity } from './offerEntity.js';
import { CreateOfferRequest, UpdateOfferRequest } from './dto.js';


const MAX_OFFERS_COUNT = 50;
const MAX_PREMIUM_OFFERS_COUNT = 10;

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponents.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {
  }

  public async create(dto: CreateOfferRequest): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer was created: ${dto.title}`);
    return result;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async find(count: number | undefined): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? MAX_OFFERS_COUNT;
    return this.offerModel.find().sort({ createdAt: -1 }).populate('host').limit(limit).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('host').exec();
  }

  public async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city: city, isPremium: true })
      .sort({ createdAt: -1 })
      .limit(MAX_PREMIUM_OFFERS_COUNT)
      .populate('host')
      .exec();
  }

  incComment(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentsCount: 1,
        },
      })
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferRequest): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate('host').exec();
  }

  public async updateRating(offerId: string, rating: number): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, { rating: rating }, { new: true }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async findByIds(offerIds: string[]): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ _id: { $in: offerIds } })
      .populate('host')
      .exec();
  }
}
