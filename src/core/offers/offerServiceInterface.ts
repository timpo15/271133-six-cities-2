import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offerEntity.js';
import { UpdateOfferRequest } from './dto.js';

class CreateOfferDto {
}

export interface OfferServiceInterface {
    create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
    findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    findByIds(offerIds: string[]): Promise<DocumentType<OfferEntity>[]>;
    find(count: number | undefined): Promise<DocumentType<OfferEntity>[]>;
    deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    updateById(offerId: string, dto: UpdateOfferRequest): Promise<DocumentType<OfferEntity> | null>;
    findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
    incComment(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    exists(documentId: string): Promise<boolean>;
    updateRating(offerId: string, rating: number): Promise<void>;
}
