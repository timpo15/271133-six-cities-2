import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './userEntity.js';
import { CreateUserRequest, LoginUserRequest } from './dto.js';


export interface UserServiceInterface {
    create(dto: CreateUserRequest): Promise<DocumentType<UserEntity>>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findOrCreate(dto: CreateUserRequest): Promise<DocumentType<UserEntity>>;
    findById(userId: string): Promise<DocumentType<UserEntity> | null>;
    findFavorites(userId: string): Promise<string[]>;
    checkFavorite(userId: string, offerId: string): Promise<boolean>;
    addToFavoritesById(userId: string, offerId: string): Promise<void>;
    removeFromFavoritesById(userId: string, offerId: string): Promise<void>;
    verifyUser(dto: LoginUserRequest): Promise<DocumentType<UserEntity> | null>;
    saveAvatar(userId: string, avatarUrl: string): Promise<void>;
}
