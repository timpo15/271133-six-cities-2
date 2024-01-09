import { City } from '../../types/city.js';
import { UserType } from '../../types/user.js';
import { Service } from '../../types/service.js';
import { LivingType } from '../../types/livingType.js';
import { Offer } from '../../types/offer.js';
import { MockData } from '../../types/mockData.js';
import dayjs from 'dayjs';
import { UserEntity } from '../../core/users/userEntity.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const MIN_RATING = 0;
const MAX_RATING = 5;
const MIN_COUNT_ROOM = 1;
const MAX_COUNT_ROOM = 5;
const MIN_GUESTS_NUMBER = 1;
const MAX_GUESTS_NUMBER = 10;
const MIN_RENTAL_COST = 1000;
const MAX_RENTAL_COST = 1000000;

function generateRandomNumber(min: number, max: number, numAfterDigit = 0): number {
  return +(Math.random() * (max - min) + min).toFixed(numAfterDigit);
}

function getRandomItems<T>(items: T[]): T[] {
  const randomStartIndex = generateRandomNumber(0, items.length - 1);
  const randomEndIndex = randomStartIndex + generateRandomNumber(0, items.length - randomStartIndex);
  return items.slice(randomStartIndex, randomEndIndex + 1);
}

function getRandomItem<T>(items: T[]): T {
  const randomIndex = generateRandomNumber(0, items.length - 1);
  return items[randomIndex];
}

export function parseOffer(offerRaw: string): Offer {
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
    offerAuthorEmail,
    commentsCount,
    latitude,
    longitude,] = offer;
  return {
    title: name,
    description: description,
    publicationDate: new Date(publicationDate),
    city: city as unknown as City,
    previewImage: previewImage,
    propertyImages: images.split(','),
    premium: premium as unknown as boolean,
    favorite: favorite as unknown as boolean,
    rating: parseFloat(rating),
    livingType: livingType as unknown as LivingType,
    numberOfRooms: parseInt(roomCount, 10),
    numberOfGuests: parseInt(guestCount, 10),
    rentalCost: parseInt(price, 10),
    services: service.split(',').map((x) => x as unknown as Service),
    author: new UserEntity({
      name: offerAuthorName,
      avatar: offerAuthorAvatar,
      isPro: false,
      email: offerAuthorEmail
    }),
    numberOfComments: parseInt(commentsCount, 10),
    coordinates: {latitude: parseFloat(latitude), longitude: parseFloat(longitude)}
  };
}

export const generateOffer = (mockData: MockData): string => {
  const name = getRandomItem<string>(mockData.names);
  const description = getRandomItem<string>(mockData.descriptions);
  const publicationDate = dayjs().subtract(generateRandomNumber(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
  const city = getRandomItem(Object.values(City).filter((value) => isNaN(Number(value))));
  const previewImage = getRandomItem<string>(mockData.previewImages);
  const images = getRandomItems<string>(mockData.propertyImages);
  const premium = getRandomItem<string>(['true', 'false']);
  const favorite = getRandomItem<string>(['true', 'false']);
  const rating = generateRandomNumber(MIN_RATING, MAX_RATING, 1);
  const livingType = getRandomItem(Object.values(LivingType).filter((value) => isNaN(Number(value))));
  const roomCount = generateRandomNumber(MIN_COUNT_ROOM, MAX_COUNT_ROOM);
  const guestCount = generateRandomNumber(MIN_GUESTS_NUMBER, MAX_GUESTS_NUMBER);
  const price = generateRandomNumber(MIN_RENTAL_COST, MAX_RENTAL_COST);
  const service = getRandomItems(Object.values(Service).filter((value) => isNaN(Number(value))));
  const offerAuthorName = getRandomItem<string>(mockData.users.names);
  const offerAuthorAvatar = getRandomItem<string>(mockData.users.avatars);
  const offerAuthorType = getRandomItem(Object.values(UserType).filter((value) => isNaN(Number(value))));
  const offerAuthorNameEmail = getRandomItem<string>(mockData.users.emails);
  const offerAuthorNamePassword = getRandomItem<string>(mockData.users.passwords);
  const commentsCount = generateRandomNumber(1, 10);
  const latitude = getRandomItem<number>(mockData.coordinates.latitude);
  const longitude = getRandomItem<number>(mockData.coordinates.longitude);

  return [
    name,
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
    offerAuthorNameEmail,
    offerAuthorNamePassword,
    commentsCount,
    latitude,
    longitude,
  ].join('\t');
};

