import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { DatabaseService } from '../database/database.service';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let mockDB: {
    orders: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  const order = {
    id: '1',
    status: 'CREATED',
    deliveryLocation: 'Moldova',
    createdAt: new Date(),
    userId: '2',
  };

  beforeEach(async () => {
    mockDB = {
      orders: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: DatabaseService,
          useValue: mockDB,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  it('findAllOrders => return an array of all orders', async () => {
    // arrange
    const orders = [order];

    const meta = {
      currentPage: 1,
      lastPage: 1,
      nextPage: null,
      prevPage: null,
      total: 1,
      totalPerPage: 10,
    };

    const query = { page: '1', size: '10' };

    jest.spyOn(mockDB.orders, 'findMany').mockResolvedValue(orders);
    jest.spyOn(mockDB.orders, 'count').mockResolvedValue(1);

    // act
    const result = await ordersService.findAllOrders(query);

    // assert
    expect(mockDB.orders.count).toHaveBeenCalledTimes(1);
    expect(mockDB.orders.findMany).toHaveBeenCalledWith({ skip: 0, take: 10 });

    expect(result).toEqual({ data: orders, meta });
  });

  it('findOrder => return found order data', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockDB.orders, 'findUnique').mockResolvedValue(order);

    // act
    const result = await ordersService.findOrder(id);

    // assert
    expect(mockDB.orders.findUnique).toHaveBeenCalledTimes(1);
    expect(mockDB.orders.findUnique).toHaveBeenCalledWith({ where: { id } });

    expect(result).toEqual(order);
  });

  it('findOrder => throw if order is missing', async () => {
    jest.spyOn(mockDB.orders, 'findUnique').mockResolvedValueOnce(null);

    await expect(ordersService.findOrder('no id')).rejects.toThrow(NotFoundException);
  });

  it('createOrder => create and return new order', async () => {
    // arrange
    const createOrderDto = {
      deliveryLocation: 'Chisinau',
    };

    jest.spyOn(mockDB.orders, 'create').mockResolvedValue(order);

    // act
    const result = await ordersService.createOrder(createOrderDto);

    // assert
    expect(mockDB.orders.create).toHaveBeenCalledTimes(1);
    expect(mockDB.orders.create).toHaveBeenCalledWith({ data: createOrderDto });

    expect(result).toEqual(order);
  });

  it('updateOrder => update and return updated order', async () => {
    // arrange
    const id = '1';

    const toUpdate = {
      deliveryLocation: 'Moldova',
    };

    const updatedOrder = { ...order, ...toUpdate };

    jest.spyOn(mockDB.orders, 'update').mockResolvedValue(updatedOrder);

    // act
    const result = await ordersService.updateOrder(id, toUpdate);

    // assert
    expect(mockDB.orders.update).toHaveBeenCalledTimes(1);
    expect(mockDB.orders.update).toHaveBeenCalledWith({ where: { id }, data: toUpdate });

    expect(result).toEqual(updatedOrder);
  });

  it('updateOrder => throw if order is missing', async () => {
    jest.spyOn(mockDB.orders, 'update').mockResolvedValueOnce(null);

    await expect(ordersService.updateOrder('missing id', {})).rejects.toThrow(NotFoundException);
  });

  it('deleteOrder => delete and return null', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockDB.orders, 'delete').mockResolvedValue(null);

    // act
    const result = await ordersService.deleteOrder(id);

    // assert
    expect(result).toBeNull();
  });

  it('deleteOrder => throw if order is missing', async () => {
    jest.spyOn(mockDB.orders, 'delete').mockRejectedValueOnce({ code: 'P2025' });

    await expect(ordersService.deleteOrder('missing id')).rejects.toBeInstanceOf(NotFoundException);
  });
});
