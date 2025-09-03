import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let mockProductsService: jest.Mocked<
    Pick<ProductsService, 'findAllProducts' | 'findProduct' | 'createProduct' | 'updateProduct' | 'deleteProduct'>
  >;

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
    mockProductsService = {
      findAllProducts: jest.fn(),
      findProduct: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  it('findAllProducts => return all products data', async () => {
    // arrange
    const products = [product];

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

    jest.spyOn(mockProductsService, 'findAllProducts').mockResolvedValue({ data: products, meta });

    // act
    const result = await productsController.findAllProducts(query);

    // assert
    expect(mockProductsService.findAllProducts).toHaveBeenCalledTimes(1);
    expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(query);

    expect(result).toEqual({ data: products, meta });
  });

  it('findProduct => return product data', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockProductsService, 'findProduct').mockResolvedValue(product);

    // act
    const result = await productsController.findProduct(id);

    // assert
    expect(mockProductsService.findProduct).toHaveBeenCalledTimes(1);
    expect(mockProductsService.findProduct).toHaveBeenCalledWith(id);

    expect(result).toEqual(product);
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

    jest.spyOn(mockProductsService, 'createProduct').mockResolvedValue({ ...product, slug });

    // act
    const result = await productsController.createProduct(createProductDto);

    // assert
    expect(mockProductsService.createProduct).toHaveBeenCalledTimes(1);
    expect(mockProductsService.createProduct).toHaveBeenCalledWith(createProductDto);

    expect(result).toEqual({ ...product, slug });
  });

  it('updateProduct => update and return product', async () => {
    // arrange
    const id = '1';

    const toUpdate = {
      name: 'newBook',
    };

    const updatedProduct = { ...product, ...toUpdate };

    jest.spyOn(mockProductsService, 'updateProduct').mockResolvedValue(updatedProduct);

    // act
    const result = await productsController.updateProduct(id, toUpdate);

    // assert
    expect(mockProductsService.updateProduct).toHaveBeenCalledTimes(1);
    expect(mockProductsService.updateProduct).toHaveBeenCalledWith(id, toUpdate);

    expect(result).toEqual(updatedProduct);
  });

  it('deleteProduct => delete and return null', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockProductsService, 'deleteProduct').mockResolvedValue(null);

    // act
    const result = await productsController.deleteProduct(id);

    // assert
    expect(mockProductsService.deleteProduct).toHaveBeenCalledTimes(1);
    expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(id);

    expect(result).toBeNull();
  });
});
