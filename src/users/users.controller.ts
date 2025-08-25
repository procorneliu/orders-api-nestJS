import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return 'Find All Users... ';
  }
}
