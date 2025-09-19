import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { DatabaseService } from '../database/database.service';
import { QueryPaginationDto } from '../common/dtos/query-pagination.dto';
import { PaginateOutput, paginateOutput, paginate } from '../common/utils/pagination.utils';
import { orders } from '@prisma/client';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class OrdersService {
  constructor(
    private databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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

    throw new NotFoundException('Order not found');
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    return await this.databaseService.orders.create({ data: createOrderDto });
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.databaseService.orders.update({ where: { id }, data: updateOrderDto });

      // Cache invalidation, lazy reload
      await this.cacheManager.del(`/orders/${id}`);

      return order;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('Order not found');
      }
      throw err;
    }
  }

  async deleteOrder(id: string) {
    try {
      await this.databaseService.orders.delete({ where: { id } });

      // Cache invalidation, lazy reload
      await this.cacheManager.del(`/orders/${id}`);

      return null;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('Order not found');
      }
      throw err;
    }
  }
}
