import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseService } from '../database/database.service';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService, DatabaseService],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(ordersController).toBeDefined();
    expect(databaseService).toBeDefined();
  });
});
