import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { AppComponents } from '../../types/appComponents.js';
import { UserServiceInterface } from './userServiceInterface.js';
import { LoggerInterface } from '../logger.js';
import { ConfigInterface } from '../../rest/config.js';
import { RestSchema } from '../../rest/schema.js';
import { UserEntity } from './userEntity.js';
import { CreateUserRequest, LoginUserRequest } from './dto.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
        @inject(AppComponents.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateUserRequest): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto });
    user.setPassword(dto.password, this.config.get('SALT'));

    const result = await this.userModel.create(user);
    this.logger.info(`New user was created: ${user.email}`);

    return result;
  }

  public async findFavorites(userId: string): Promise<string[]> {
    const offers = await this.userModel.findById(userId);
    if (!offers) {
      return [];
    }

    return offers.favorite.map((x) => x.toString());
  }

  public async checkFavorite(userId: string, offerId: string): Promise<boolean> {
    const offers = await this.userModel.findById(userId).select('favorite');
    if (!offers) {
      return false;
    }

    return offers.favorite.map((x) => x.toString()).includes(offerId);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserRequest): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto);
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ _id: userId });
  }

  public async addToFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { $addToSet: { favorite: offerId }, new: true });
  }

  public async removeFromFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { $pull: { favorite: offerId }, new: true });
  }

  public async verifyUser(dto: LoginUserRequest): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.password, this.config.get('SALT'))) {
      return user;
    }

    return null;
  }

  public async saveAvatar(userId: string, avatarUrl: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (user) {
      user.avatar = avatarUrl;
      await user.save();
    }
  }
}
