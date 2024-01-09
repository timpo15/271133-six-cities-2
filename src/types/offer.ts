import {City} from './city.js';
import {Coordinates} from './coordinates.js';
import { LivingType } from './livingType.js';
import { Service } from './service.js';
import { UserEntity } from '../core/users/userEntity.js';


export type Offer = {
    title: string;
    description: string;
    publicationDate: Date;
    city: City;
    previewImage: string;
    propertyImages: string[];
    premium: boolean;
    favorite: boolean;
    rating: number;
    livingType: LivingType;
    numberOfRooms: number;
    numberOfGuests: number;
    rentalCost: number;
    services: Service[];
    author: UserEntity;
    numberOfComments: number;
    coordinates: Coordinates
}
