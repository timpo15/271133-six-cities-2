import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { AppComponents } from '../../types/appComponents.js';
import { OfferServiceInterface } from './offerServiceInterface.js';
import { LoggerInterface } from '../logger.js';
import { OfferEntity } from './offerEntity.js';


@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponents.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: OfferEntity): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.name}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }
}
