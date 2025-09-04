import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users } from '@prisma/client';
import { CreateUsersDto } from './dtos/create-user.dto';
import { UpdateUsersDto } from './dtos/update-user.dto';
import { QueryPaginationDto } from '../common/dtos/query-pagination.dto';
import { PaginateOutput, paginateOutput, paginate } from '../common/utils/pagination.utils';

export type UsersPublic = Omit<users, 'password'>;

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findAllUser(query?: QueryPaginationDto): Promise<PaginateOutput<UsersPublic>> {
    const [data, total] = await Promise.all([
      await this.databaseService.users.findMany({
        ...paginate(query!),
        omit: {
          password: true,
        },
      }),
      await this.databaseService.users.count(),
    ]);
    return paginateOutput<UsersPublic>(data, total, query!);
  }

  async findUser(id: string): Promise<UsersPublic | null> {
    const user = await this.databaseService.users.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });

    if (user) return user;

    throw new NotFoundException('User not found');
  }

  async createUser(createUsersDto: CreateUsersDto) {
    // here extraxting passwordConfirm, because it's only used for validation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordConfirm, ...data } = createUsersDto;

    return await this.databaseService.users.create({
      data,
      omit: {
        password: true,
      },
    });
  }

  async updateUser(id: string, updateUsersDto: UpdateUsersDto): Promise<UsersPublic> {
    try {
      const updatedUser = await this.databaseService.users.update({
        where: { id },
        data: updateUsersDto,
        omit: {
          password: true,
        },
      });

      return updatedUser;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }

  async deleteUser(id: string) {
    try {
      await this.databaseService.users.delete({ where: { id } });

      return null;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }

      throw err;
    }
  }
}
