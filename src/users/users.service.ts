import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { users } from '@prisma/client';
import { CreateUsersDto } from './dtos/create-user.dto';
import { UpdateUsersDto } from './dtos/update-user.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { PaginateOutput, paginateOutput, paginate } from 'src/common/utils/pagination.utils';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findAllUser(query?: QueryPaginationDto): Promise<PaginateOutput<users>> {
    const [data, total] = await Promise.all([
      await this.databaseService.users.findMany({
        ...paginate(query!),
      }),
      await this.databaseService.users.count(),
    ]);
    return paginateOutput<users>(data, total, query!);
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
