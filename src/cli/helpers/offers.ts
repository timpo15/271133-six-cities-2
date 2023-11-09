import { City } from '../../types/city.js';
import { UserType } from '../../types/user.js';
import { Service } from '../../types/service.js';
import { LivingType } from '../../types/livingType.js';
import { Offer } from '../../types/offer.js';

export function parseOffer(offerRaw: string): Offer{
  const offer = offerRaw.trim().replace('\n', '').split('\t');
  const [name,
    description,
    publicationDate,
    city,
    previewImage,
    images,
    premium,
    favorite,
    rating,
    livingType,
    roomCount,
    guestCount,
    price,
    service,
    offerAuthorName,
    offerAuthorAvatar,
    offerAuthorType,
    offerAuthorEmail,
    offerAuthorPassword,
    commentsCount,
    latitude,
    longitude,] = offer;
  return {
    name: name,
    description: description,
    publicationDate: new Date(publicationDate),
    city: city as unknown as City,
    previewImage: previewImage,
    propertyImages: images.split(','),
    premium: premium as unknown as boolean,
    favorite: favorite as unknown as boolean,
    rating: parseFloat(rating),
    housingType: livingType as unknown as LivingType,
    numberOfRooms: parseInt(roomCount, 10),
    numberOfGuests: parseInt(guestCount, 10),
    rentalCost: parseInt(price, 10),
    amenities: service.split(',').map((x) => x as unknown as Service),
    author: {
      name: offerAuthorName,
      avatar: offerAuthorAvatar,
      type: offerAuthorType as unknown as UserType,
      email: offerAuthorEmail,
      password: offerAuthorPassword
    },
    numberOfComments: parseInt(commentsCount, 10),
    coordinates: {latitude: parseFloat(latitude), longitude: parseFloat(longitude)}
  };
}
