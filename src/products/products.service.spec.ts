import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { DatabaseService } from '../database/database.service';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, DatabaseService],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
    expect(databaseService).toBeDefined();
  });
});
