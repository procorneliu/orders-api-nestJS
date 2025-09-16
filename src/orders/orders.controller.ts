import { Controller, Body, Param, Get, Post, Patch, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { QueryPaginationDto } from '../common/dtos/query-pagination.dto';
import { PaginateOutput } from '../common/utils/pagination.utils';
import { orders } from '@prisma/client';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { ApiResponse } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { OrderResponseDto } from './dtos/order-response.dto';

@UseGuards(AccessTokenGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiSuccessResponse(OrderResponseDto, { isArray: true, isPaginate: true })
  @Get()
  findAllOrders(@Query() query?: QueryPaginationDto): Promise<PaginateOutput<orders>> {
    return this.ordersService.findAllOrders(query);
  }

  @ApiSuccessResponse(OrderResponseDto)
  @Get('/:id')
  findOrder(@Param('id') id: string) {
    return this.ordersService.findOrder(id);
  }

  @ApiSuccessResponse(OrderResponseDto)
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @ApiSuccessResponse(OrderResponseDto)
  @Patch('/:id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @ApiResponse({ example: null })
  @HttpCode(204)
  @Delete('/:id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
