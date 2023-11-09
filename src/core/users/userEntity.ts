import { User, UserType } from '../../types/user.js';
import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { ConfigInterface } from '../../rest/config.js';
import { RestSchema } from '../../rest/schema.js';
import * as crypto from 'node:crypto';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
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

    @prop({required: true, default: UserType.simple})
    public type: UserType;

    constructor(
      userData: User,
        private readonly config?: ConfigInterface<RestSchema>,
    ) {
      super();

      this.email = userData.email;
      this.avatar = userData.avatar;
      this.name = userData.name;
      this.type = userData.type;
      this.setPassword(userData.password);
    }

    public setPassword(password: string) {
      this.password = createSHA256(password, this.config?.get('SALT') || '');
    }

    public getPassword() {
      return this.password;
    }
}

export const UserModel = getModelForClass(UserEntity);
