import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { OfferEntity } from '../offers/offerEntity.js';
import { UserEntity } from '../users/userEntity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  },
})
export class CommentEntity extends defaultClasses.TimeStamps {

    @prop({trim: true, required: true})
  public text!: string;

    @prop({required: false})
    public publicationDate!: Date;

    @prop({required: true})
    public rating!: number;

    @prop({required: true, ref: UserEntity})
    public userId!: Ref<UserEntity>;

    @prop({required: true, ref: OfferEntity})
    public offerId!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
