import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

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

  @IsString()
  @IsOptional()
  refresh_token?: string | null;
}
