import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateUserRequest {
  @IsEmail({}, { message: 'Email must be valid.' })
  @IsString({ message: 'Email is required.' })
  public email!: string;

  @Length(1, 15, { message: 'Username length should be from 1 to 15.' })
  @IsString({ message: 'Username is required.' })
  public name!: string;

  @IsBoolean({ message: 'type must be boolean' })
  public isPro!: boolean;

  @Length(6, 12, { message: 'Password length should be from 6 to 12.' })
  @IsString({ message: 'Password is required.' })
  public password!: string;
}

export class LoginUserRequest {
  @IsEmail({}, { message: 'Email must be valid.' })
  public email!: string;

  @IsString({ message: 'Password is required.' })
  public password!: string;
}

export class LoginUserResponse {
  @Expose()
  public token!: string;

  @Expose()
  public refreshToken!: string;

  @Expose()
  public email!: string;

  @Expose()
  public name!: string;

  @Expose()
  public avatarUrl!: string;

  @Expose()
  public isPro!: boolean;
}

export class UserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl!: string;

  @Expose()
  public isPro!: boolean;
}
