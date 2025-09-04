import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication<App>;

  const createProductDto = {
    name: `some new book here`,
    description: 'Test book',
    price: 1,
    onStock: true,
  };

  const http = () => request(app.getHttpServer());

  const createProduct = async () => {
    return await http().post('/products').send(createProductDto).expect(201).expect('Content-Type', /json/);
  };

  const deleteProduct = async (id: string) => {
    return await http().delete(`/products/${id}`).expect(204);
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /products return a list of products + meta data', () => {
    return http()
      .get('/products')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.meta).toBeDefined();
      });
  });

  it('POST /products -> GET /products/:id -> DELETE /products/:id', async () => {
    const createdProduct = await createProduct();
    const productId = createdProduct.body.data?.id ?? createdProduct.body.id;

    const getProduct = await http().get(`/products/${productId}`).expect(200);
    const product = getProduct.body.data ?? getProduct.body;

    expect(product).toMatchObject({
      ...createProductDto,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(product.id).toBeDefined();

    await deleteProduct(product.id);
  });

  it('PATCH /products/:id updates fields', async () => {
    const toUpdate = { name: `new book` };

    const { body } = await createProduct();
    const productId = body.data?.id ?? body.id;

    const patch = await http()
      .patch(`/products/${productId}`)
      .send(toUpdate)
      .expect(200)
      .expect('Content-Type', /json/);
    const updatedProduct = patch.body.data ?? patch.body;

    expect(updatedProduct.name).toBe(toUpdate.name);
    expect(new Date(updatedProduct.updatedAt).getTime()).toBeGreaterThan(new Date(updatedProduct.createdAt).getTime());

    await deleteProduct(productId);
  });

  it('GET /products/:id return 404 for missing product', async () => {
    const res = await http().get('/products/fakeId').expect(404).expect('Content-Type', /json/);
    expect(res.body.message).toBe('Product not found');
  });

  it('PATCH /products/:id return 404 for missing product', async () => {
    const res = await http().patch('/products/fakeId').send({ name: 'y' }).expect(404).expect('Content-Type', /json/);
    expect(res.body.message).toBe('Product not found');
  });

  it('DELETE /products/:id return 404 for missing product', async () => {
    const res = await http().delete('/products/fakeId').expect(404).expect('Content-Type', /json/);
    expect(res.body.message).toBe('Product not found');
  });
});
