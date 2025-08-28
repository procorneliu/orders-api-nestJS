import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findAllUser(): Promise<users[]> {
    const users = await this.databaseService.users.findMany();

    if (users.length) {
      return users;
    }

    throw new NotFoundException('No user found.');
  }

  async findUser(id: string): Promise<users | null> {
    const user = await this.databaseService.users.findUnique({ where: { id } });

    if (user) return user;
    throw new NotFoundException('User not found');
  }

  async createUser(createUserDto: Prisma.usersCreateInput) {
    try {
      return await this.databaseService.users.create({ data: createUserDto });
    } catch (err) {
      console.log(2);
      console.log(err);
    }
  }

  async updateUser(id: string, updateUserDto: Prisma.usersUpdateInput): Promise<users> {
    return await this.databaseService.users.update({ where: { id }, data: updateUserDto });
  }

  async deleteUser(id: string): Promise<null> {
    await this.databaseService.users.delete({ where: { id } });
    return null;
  }
}
