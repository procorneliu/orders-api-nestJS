import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatabaseService } from '../database/database.service';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService, DatabaseService],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
    expect(databaseService).toBeDefined();
  });
});
