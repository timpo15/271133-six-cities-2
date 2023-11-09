import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './userEntity.js';


export interface UserServiceInterface {
    create(dto: UserEntity, salt: string): Promise<DocumentType<UserEntity>>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findOrCreate(dto: UserEntity): Promise<DocumentType<UserEntity>>;
}
