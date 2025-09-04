import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let mockOrdersService: jest.Mocked<
    Pick<OrdersService, 'findAllOrders' | 'findOrder' | 'createOrder' | 'updateOrder' | 'deleteOrder'>
  >;

  const order = {
    id: '1',
    status: expect.any(String),
    deliveryLocation: 'Moldova',
    createdAt: new Date(),
    userId: '2',
  };

  beforeEach(async () => {
    mockOrdersService = {
      findAllOrders: jest.fn(),
      findOrder: jest.fn(),
      createOrder: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(ordersController).toBeDefined();
  });

  it('findAllOrders => return an array of all orders data', async () => {
    // arrange
    const orders = [order];

    const meta = {
      total: 1,
      lastPage: 1,
      currentPage: 1,
      totalPerPage: 5,
      prevPage: null,
      nextPage: null,
    };

    const query = {
      page: '1',
      size: '10',
    };

    jest.spyOn(mockOrdersService, 'findAllOrders').mockResolvedValue({ data: orders, meta });

    // acts
    const result = await ordersController.findAllOrders(query);

    // assert
    expect(mockOrdersService.findAllOrders).toHaveBeenCalledTimes(1);
    expect(mockOrdersService.findAllOrders).toHaveBeenCalledWith(query);

    expect(result).toEqual({ data: orders, meta });
  });

  it('findOrder => return order data', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockOrdersService, 'findOrder').mockResolvedValue(order);

    // act
    const result = await ordersController.findOrder(id);

    // assert
    expect(mockOrdersService.findOrder).toHaveBeenCalledTimes(1);
    expect(mockOrdersService.findOrder).toHaveBeenCalledWith(id);

    expect(result).toEqual(order);
  });
  it('createOrder => create and return order data', async () => {
    // arrange
    const createOrderDto = {
      deliveryLocation: 'Chisinau',
    };

    jest.spyOn(mockOrdersService, 'createOrder').mockResolvedValue(order);

    // act
    const result = await ordersController.createOrder(createOrderDto);

    // assert
    expect(mockOrdersService.createOrder).toHaveBeenCalledTimes(1);
    expect(mockOrdersService.createOrder).toHaveBeenCalledWith(createOrderDto);

    expect(result).toEqual(order);
  });

  it('updateOrder => update and return order data', async () => {
    // arrange
    const id = '1';

    const toUpdate = {
      deliveryLocation: 'London',
    };

    const updatedOrder = { ...order, ...toUpdate };

    jest.spyOn(mockOrdersService, 'updateOrder').mockResolvedValue(updatedOrder);

    // act
    const result = await ordersController.updateOrder(id, toUpdate);

    // assert
    expect(mockOrdersService.updateOrder).toHaveBeenCalledTimes(1);
    expect(mockOrdersService.updateOrder).toHaveBeenCalledWith(id, toUpdate);

    expect(result).toEqual(updatedOrder);
  });

  it('deleteOrder => delete and return null', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockOrdersService, 'deleteOrder').mockResolvedValue(null);

    // act
    const result = await ordersController.deleteOrder(id);

    // assert
    expect(mockOrdersService.deleteOrder).toHaveBeenCalledTimes(1);
    expect(mockOrdersService.deleteOrder).toHaveBeenCalledWith(id);

    expect(result).toBeNull();
  });
});
