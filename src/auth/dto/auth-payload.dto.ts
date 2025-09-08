import { IsString } from 'class-validator';

export class AuthPayloadDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
