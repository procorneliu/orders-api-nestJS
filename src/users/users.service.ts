import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { users } from '@prisma/client';
import { CreateUsersDto } from './dtos/create-user.dto';
import { UpdateUsersDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findAllUser(): Promise<users[]> {
    const users = await this.databaseService.users.findMany();

    if (users.length) return users;

    throw new NotFoundException('No user found.');
  }

  async findUser(id: string): Promise<users | null> {
    const user = await this.databaseService.users.findUnique({ where: { id } });

    if (user) return user;

    throw new NotFoundException('User not found');
  }

  async createUser(createUsersDto: CreateUsersDto) {
    return await this.databaseService.users.create({ data: createUsersDto });
  }

  async updateUser(id: string, updateUsersDto: UpdateUsersDto): Promise<users> {
    return await this.databaseService.users.update({ where: { id }, data: updateUsersDto });
  }

  async deleteUser(id: string) {
    await this.databaseService.users.delete({ where: { id } });
  }
}
