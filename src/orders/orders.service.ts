import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { DatabaseService } from '../database/database.service';
import { QueryPaginationDto } from '../common/dtos/query-pagination.dto';
import { PaginateOutput, paginateOutput, paginate } from '../common/utils/pagination.utils';
import { orders } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private databaseService: DatabaseService) {}

  async findAllOrders(query?: QueryPaginationDto): Promise<PaginateOutput<orders>> {
    const [data, total] = await Promise.all([
      await this.databaseService.orders.findMany({
        ...paginate(query!),
      }),
      await this.databaseService.orders.count(),
    ]);
    return paginateOutput<orders>(data, total, query!);
  }

  async findOrder(id: string) {
    const order = await this.databaseService.orders.findUnique({ where: { id } });

    if (order) return order;
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    return await this.databaseService.orders.create({ data: createOrderDto });
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    return await this.databaseService.orders.update({ where: { id }, data: updateOrderDto });
  }

  async deleteOrder(id: string) {
    await this.databaseService.orders.delete({ where: { id } });
  }
}
