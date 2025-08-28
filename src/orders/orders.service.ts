import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrdersService {
  constructor(private databaseService: DatabaseService) {}

  async findAllOrders() {
    const orders = await this.databaseService.orders.findMany({ take: 10 });

    if (orders.length) return orders;

    throw new NotFoundException('Orders not found');
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
