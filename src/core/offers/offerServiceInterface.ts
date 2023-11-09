import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offerEntity.js';

class CreateOfferDto {
}

export interface OfferServiceInterface {
    create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

    findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
