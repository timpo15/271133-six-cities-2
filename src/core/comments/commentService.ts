import { inject, injectable } from 'inversify';
import { CommentServiceInterface } from './commentServiceInterface.js';
import { AppComponents } from '../../types/appComponents.js';
import { LoggerInterface } from '../logger.js';
import { CommentEntity } from './commentEntity.js';
import { Comment } from '../../types/comment.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferServiceInterface } from '../offers/offerServiceInterface.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponents.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
        @inject(AppComponents.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
  }

  public async create(dto: Comment): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`New Comment created: ${dto.text}`);

    return result.populate('userId');
  }

  public async createForOffer(dto: Comment): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    const offerId = dto.offerId;
    await this.offerService.incComment(offerId);

    const allRating = await this.commentModel.find({offerId}).select('rating').exec();
    const offer = await this.offerService.findById(offerId);

    const count = offer?.commentsCount ?? 1;
    const newRating = allRating.reduce((x, y) => x + y.rating, 0) / count;
    await this.offerService.updateRating(offerId, newRating);
    return comment.populate('authorId');
  }


  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[] | null> {
    return this.commentModel.find({offerId}).populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({offerId}).exec();

    return result.deletedCount;
  }
}
