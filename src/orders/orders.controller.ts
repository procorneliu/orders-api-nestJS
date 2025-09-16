import { Controller, Body, Param, Get, Post, Patch, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { QueryPaginationDto } from '../common/dtos/query-pagination.dto';
import { PaginateOutput } from '../common/utils/pagination.utils';
import { orders } from '@prisma/client';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAllOrders(@Query() query?: QueryPaginationDto): Promise<PaginateOutput<orders>> {
    return this.ordersService.findAllOrders(query);
  }

  @Get('/:id')
  findOrder(@Param('id') id: string) {
    return this.ordersService.findOrder(id);
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Patch('/:id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @HttpCode(204)
  @Delete('/:id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
