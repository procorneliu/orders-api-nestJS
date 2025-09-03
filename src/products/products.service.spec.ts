import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { DatabaseService } from '../database/database.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let mockDB: {
    products: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  const product = {
    id: '1',
    name: 'test',
    description: 'test description',
    price: 1,
    slug: 'test-description',
    onStock: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockDB = {
      products: {
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
        ProductsService,
        {
          provide: DatabaseService,
          useValue: mockDB,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  it('findAllProducts => returns all products data', async () => {
    // arrange
    const products = [product];
    const meta = {
      currentPage: 1,
      lastPage: 1,
      nextPage: null,
      prevPage: null,
      total: 1,
      totalPerPage: 10,
    };
    const query = { page: '1', size: '10' };

    jest.spyOn(mockDB.products, 'findMany').mockResolvedValue(products);
    jest.spyOn(mockDB.products, 'count').mockResolvedValue(1);

    // act
    const result = await productsService.findAllProducts(query);

    // assert

    expect(mockDB.products.count).toHaveBeenCalledTimes(1);
    expect(mockDB.products.findMany).toHaveBeenCalledWith({ skip: 0, take: 10 });

    expect(result).toEqual({ data: products, meta });
  });

  it('findProduct => returns product data', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockDB.products, 'findUnique').mockResolvedValue(product);

    // act
    const result = await productsService.findProduct(id);

    // assert
    expect(mockDB.products.findUnique).toHaveBeenCalledTimes(1);
    expect(mockDB.products.findUnique).toHaveBeenCalledWith({ where: { id } });

    expect(result).toEqual(product);
  });

  it('findProduct => throw if product is missing', async () => {
    jest.spyOn(mockDB.products, 'findUnique').mockResolvedValueOnce(null);

    await expect(productsService.findProduct('no id')).rejects.toThrow(NotFoundException);
  });

  it('createProduct => create and return new product', async () => {
    // arrange
    const createProductDto = {
      name: 'test',
      description: 'test book',
      price: 1,
      onStock: false,
    };

    const slug = createProductDto.name.split(' ').join('-');

    jest.spyOn(mockDB.products, 'create').mockResolvedValue(product);

    // act
    const result = await productsService.createProduct(createProductDto);

    // assert
    expect(mockDB.products.create).toHaveBeenCalledTimes(1);
    expect(mockDB.products.create).toHaveBeenCalledWith({ data: { ...createProductDto, slug } });

    expect(result).toEqual(product);
  });

  it('updateProduct => update and return product', async () => {
    // arrange
    const id = '1';

    const toUpdate = {
      name: 'test 2',
    };

    const updatedProduct = { ...product, ...toUpdate };

    jest.spyOn(mockDB.products, 'update').mockResolvedValue(updatedProduct);

    // act
    const result = await productsService.updateProduct(id, toUpdate);

    // assert
    expect(mockDB.products.update).toHaveBeenCalledTimes(1);
    expect(mockDB.products.update).toHaveBeenCalledWith({ data: toUpdate, where: { id } });

    expect(result).toEqual(updatedProduct);
  });

  it('updateProduct => throw if product is missing', async () => {
    jest.spyOn(mockDB.products, 'update').mockResolvedValueOnce(null);

    await expect(productsService.updateProduct('missing id', {})).rejects.toThrow(NotFoundException);
  });

  it('deleteProduct => delete product and return null', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockDB.products, 'delete').mockResolvedValue(null);

    // act
    const result = await productsService.deleteProduct(id);

    // assert
    expect(mockDB.products.delete).toHaveBeenCalledTimes(1);
    expect(mockDB.products.delete).toHaveBeenCalledWith({ where: { id } });

    expect(result).toBeNull();
  });

  it('deleteProduct => throw if product is missing', async () => {
    jest.spyOn(mockDB.products, 'delete').mockRejectedValue({ code: 'P2025' });
    await expect(productsService.deleteProduct('missing id')).rejects.toBeInstanceOf(NotFoundException);
  });
});
