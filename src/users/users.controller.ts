import { Controller, Param, Body, Get, Post, Patch, Delete, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { DataLengthInterceptor } from 'src/interceptors/data-length.interceptor';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(DataLengthInterceptor)
  @Get()
  findAll() {
    return this.usersService.findAllUser();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findUser(id);
  }

  @Post()
  createUser(@Body() createUserDto: Prisma.usersCreateInput) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: Prisma.usersUpdateInput) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
