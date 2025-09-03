import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { DatabaseService } from '../database/database.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, DatabaseService],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
    expect(databaseService).toBeDefined();
  });
});
