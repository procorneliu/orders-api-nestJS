import { Controller, Param, Body, Get, Post, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dtos/create-user.dto';
import { UpdateUsersDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAllUser();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findUser(id);
  }

  @Post()
  createUser(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.createUser(createUsersDto);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() updateUsersDto: UpdateUsersDto) {
    return this.usersService.updateUser(id, updateUsersDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
