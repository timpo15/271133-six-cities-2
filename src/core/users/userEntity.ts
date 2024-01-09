import { User } from '../../types/user.js';
import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import * as crypto from 'node:crypto';
import { OfferEntity } from '../offers/offerEntity.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

export const createSHA256 = (line: string, salt?: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt || '');
  return shaHasher.update(line).digest('hex');
};

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
    @prop({unique: true, required: true})
  public email: string;

    @prop({required: false, default: ''})
    public avatar?: string;

    @prop({required: true, default: ''})
    public name: string;

    @prop({required: true, default: ''})
    public password!: string;

    @prop({
      required: true,
      type: () => Boolean,
    })
    @prop({ required: true, ref: 'OfferEntity', default: [] })
    public favorite!: Ref<OfferEntity>[];

    public isPro: boolean;

    constructor(
      userData: User,
    ) {
      super();

      this.email = userData.email;
      this.avatar = userData.avatar;
      this.name = userData.name;
      this.isPro = userData.isPro;

    }

    public setPassword(password: string, salt?: string) {
      this.password = createSHA256(password, salt);
    }

    public verifyPassword(password: string, salt?: string) {
      const hashPassword = createSHA256(password, salt);
      return hashPassword === this.password;
    }

    public getPassword() {
      return this.password;
    }
}

export const UserModel = getModelForClass(UserEntity);
