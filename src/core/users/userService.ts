import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { AppComponents } from '../../types/appComponents.js';
import { UserServiceInterface } from './userServiceInterface.js';
import { LoggerInterface } from '../logger.js';
import { ConfigInterface } from '../../rest/config.js';
import { RestSchema } from '../../rest/schema.js';
import { UserEntity } from './userEntity.js';
import { UserType } from '../../types/user.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
        @inject(AppComponents.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: UserEntity): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, type: UserType.simple }, this.config);
    user.setPassword(dto.password);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: UserEntity): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto);
  }
}
