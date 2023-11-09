import typegoose, { defaultClasses, getModelForClass, Ref, Severity } from '@typegoose/typegoose';
import { City } from '../../types/city.js';
import { LivingType } from '../../types/livingType.js';
import { Service } from '../../types/service.js';
import { Coordinates } from '../../types/coordinates.js';
import { UserEntity } from '../users/userEntity.js';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
    @prop({ required: true })
  public name!: string;

    @prop({ required: true })
    public description!: string;

    @prop({ required: true })
    public publicationDate!: Date;

    @prop({ required: true, enum: City })
    public city!: City;

    @prop({ required: true })
    public previewImage!: string;

    @prop({ required: true, type: String, default: [] })
    public propertyImages!: Array<string>;

    @prop({ required: true })
    public premium!: boolean;

    @prop({ required: true })
    public favorite!: boolean;

    @prop({ required: true })
    public rating!: number;

    @prop({ required: true, enum: LivingType })
    public livingType!: LivingType;

    @prop({ required: true })
    public numberOfRooms!: number;

    @prop({ required: true })
    public numberOfGuests!: number;

    @prop({ required: true })
    public rentalCost!: number;

    @prop({ required: true, enum: Service, type:String, default: [] })
    public services!: Array<Service>;

    @prop({ required: true, ref: UserEntity })
    public author!: Ref<UserEntity>;

    @prop({ required: false })
    public commentsCount!: number;

    @prop({ required: true, allowMixed: Severity.ALLOW })
    public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
