import { Comment } from '../../types/comment.js';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './commentEntity.js';

export interface CommentServiceInterface {
    create(dto: Comment): Promise<DocumentType<CommentEntity>>;
    createForOffer(dto: Comment): Promise<DocumentType<CommentEntity>>;

    findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[] | null>;
    deleteByOfferId(offerId: string): Promise<number | null>;
}
