import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-user.dto';

export class UpdateUsersDto extends PartialType(CreateUsersDto) {}
