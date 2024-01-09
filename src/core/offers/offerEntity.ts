import typegoose, { defaultClasses, getModelForClass, Ref, Severity } from '@typegoose/typegoose';
import { City } from '../../types/city.js';
import { LivingType } from '../../types/livingType.js';
import { Service } from '../../types/service.js';
import { Coordinates } from '../../types/coordinates.js';
import { UserEntity } from '../users/userEntity.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  // @prop({required: true})
  public title!: string;

    @prop({required: true})
  public description!: string;

    public publicationDate!: Date;

    @prop({required: true, enum: City})
    public city!: City;

    @prop({required: true})
    public previewImage!: string;

    @prop({required: true, type: String, default: []})
    public propertyImages!: Array<string>;

    @prop({required: true})
    public isPremium!: boolean;

    // @prop({required: true})
    public favorite!: boolean;

    @prop({required: false})
    public rating!: number;

    @prop({required: true, enum: LivingType})
    public type!: LivingType;

    @prop({required: true})
    public bedrooms!: number;

    @prop({required: true})
    public maxAdults!: number;

    @prop({required: true})
    public price!: number;

    @prop({required: true, enum: Service, type: String, default: []})
    public goods!: Array<Service>;


    @prop({required: false})
    public commentsCount!: number;

    @prop({required: true, allowMixed: Severity.ALLOW})
    public location!: Coordinates;

    @prop({
      ref: UserEntity,
      required: true,
    })
    public host!: Ref<UserEntity>;

    public isFavorite!: boolean;

}

export const OfferModel = getModelForClass(OfferEntity);
