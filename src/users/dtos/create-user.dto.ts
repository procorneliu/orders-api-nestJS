import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(5)
  passwordConfirm: string;
}
