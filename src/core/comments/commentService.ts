import { inject, injectable } from 'inversify';
import { CommentServiceInterface } from './commentServiceInterface.js';
import { AppComponents } from '../../types/appComponents.js';
import { LoggerInterface } from '../logger.js';
import { CommentEntity } from './commentEntity.js';
import { Comment } from '../../types/comment.js';
import { DocumentType, types } from '@typegoose/typegoose';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponents.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {
  }

  public async create(dto: Comment): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`New Comment created: ${dto.text}`);

    return result.populate('userId');
  }

  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[] | null> {
    return this.commentModel.find({offerId}).populate('userId');
  }
}
