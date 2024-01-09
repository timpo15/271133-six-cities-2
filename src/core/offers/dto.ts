import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum, IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';
import { City } from '../../types/city.js';
import { Service } from '../../types/service.js';
import { Coordinates } from '../../types/coordinates.js';
import { LivingType } from '../../types/livingType.js';
import { Expose, Type } from 'class-transformer';
import { UserResponse } from '../users/dto.js';

export class CreateOfferRequest {
  @MinLength(10, { message: 'Min length for title is 10' })
  @MaxLength(100, { message: 'Max length for title is 100' })
  public title!: string;

  @MinLength(20, { message: 'Min length for description is 20' })
  @MaxLength(1024, { message: 'Max length for description is 1024' })
  public description!: string;

  @IsEnum(City, { message: 'type must be one of the city' })
  public city!: City;

  @IsString({ message: 'preview path is required.' })
  public previewImage!: string;

  // @IsArray({ message: 'field images must be an array' })
  // @IsString({ each: true, message: 'image path should be string' })
  public images!: string[];

  @IsBoolean({ message: 'field isPremium must be boolean' })
  public isPremium!: boolean;

  @IsEnum(LivingType, { message: 'type must be one of the housing types' })
  public type!: LivingType;

  @Min(1, { message: 'Min count of rooms is 1' })
  @Max(8, { message: 'Max count of rooms is 8' })
  public bedrooms!: number;

  @Min(1, { message: 'Min count of guests is 1' })
  @Max(10, { message: 'Max count of guests is 10' })
  public maxAdults!: number;

  @Min(100, { message: 'Min price is 100' })
  @Max(100000, { message: 'Max price is 100000' })
  public price!: number;

  @IsArray({ message: 'field goods must be an array' })
  @IsEnum(Service, { each: true, message: 'type must be one of the goods' })
  @ArrayNotEmpty({ message: 'There should be at least 1 facility' })
  public goods!: Service[];

  public host!: string;

  @IsObject({ message: 'There should be object CoordinatesType' })
  public location!: Coordinates;
}


export class UpdateOfferRequest {
    @IsOptional()
    @MinLength(10, { message: 'Min length for title is 10' })
    @MaxLength(100, { message: 'Max length for title is 100' })
  public title?: string;

    @IsOptional()
    @MinLength(20, { message: 'Min length for description is 20' })
    @MaxLength(1024, { message: 'Max length for description is 1024' })
    public description?: string;

    @IsOptional()
    @IsEnum(City, { message: 'type must be one of the city' })
    public city?: City;

    @IsOptional()
    @IsString({ message: 'preview path is required.' })
    public previewImage?: string;

    @IsOptional()
    @IsArray({ message: 'field images must be an array' })
    @IsString({ each: true, message: 'image path should be string' })
    public images?: string[];

    @IsOptional()
    @IsBoolean({ message: 'field isPremium must be boolean' })
    public isPremium?: boolean;

    @IsOptional()
    @IsEnum(LivingType, { message: 'type must be one of the housing types' })
    public type?: LivingType;

    @IsOptional()
    @Min(1, { message: 'Min count of rooms is 1' })
    @Max(8, { message: 'Max count of rooms is 8' })
    public bedrooms?: number;

    @IsOptional()
    @Min(1, { message: 'Min count of guests is 1' })
    @Max(10, { message: 'Max count of guests is 10' })
    public maxAdults?: number;

    @IsOptional()
    @Min(100, { message: 'Min price is 100' })
    @Max(100000, { message: 'Max price is 100000' })
    public price?: number;

    @IsOptional()
    @IsArray({ message: 'field goods must be an array' })
    @IsEnum(Service, { each: true, message: 'type must be one of the goods' })
    @ArrayNotEmpty({ message: 'There should be at least 1 facility' })
    public goods?: Service[];

    @IsOptional()
    @IsObject({ message: 'There should be object CoordinatesType' })
    public location?: Coordinates;

    @IsOptional()
    @IsString({ message: 'host should be string' })
    public host?: string;
}


export class OfferResponse {
  @Expose()
  public id!: string;

  @Expose()
    title!: string;

  @Expose({ name: 'createdAt' })
    publicationDate!: Date;

  @Expose()
    description!: string;

  @Expose()
    city!: City;

  @Expose()
    previewImage!: string;

  @Expose()
    images!: string[];

  @Expose()
    isPremium!: boolean;

  @Expose()
    isFavorite!: boolean;

  @Expose()
    rating!: number;

  @Expose()
    type!: LivingType;

  @Expose()
    price!: number;

  @Expose()
    commentsCount!: number;

  @Expose()
    bedrooms!: number;

  @Expose()
    maxAdults!: number;

  @Expose()
    goods!: Service[];

  @Expose({ name: 'host' })
  @Type(() => UserResponse)
    host!: UserResponse;

  @Expose()
    location!: Coordinates;
}

export class FavoriteOfferShortResponse {
  @Expose()
  public id!: string;

  @Expose()
    title!: string;

  @Expose()
    publicationDate!: Date;

  @Expose()
    city!: City;

  @Expose()
    previewImage!: string;

  @Expose()
    isPremium!: boolean;

  isFavourite = true;

  @Expose()
    rating!: number;

  @Expose()
    type!: LivingType;

  @Expose()
    price!: number;

  @Expose()
    commentsCount!: number;
}
