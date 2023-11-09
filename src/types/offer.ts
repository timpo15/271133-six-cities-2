import {User} from './user.js';
import {City} from './city.js';
import {Coordinates} from './coordinates.js';
import { LivingType } from './livingType.js';
import { Service } from './service.js';


export type Offer = {
    name: string;
    description: string;
    publicationDate: Date;
    city: City;
    previewImage: string;
    propertyImages: string[];
    premium: boolean;
    favorite: boolean;
    rating: number;
    housingType: LivingType;
    numberOfRooms: number;
    numberOfGuests: number;
    rentalCost: number;
    amenities: Service[];
    author: User;
    numberOfComments: number;
    coordinates: Coordinates
}
