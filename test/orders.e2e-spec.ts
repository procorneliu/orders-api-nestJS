import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('OrdersController (e2e)', () => {
  let app: INestApplication<App>;

  const createOrderDto = {
    deliveryLocation: 'Moldova',
  };

  const http = () => request(app.getHttpServer());

  const createOrder = async () => {
    return await http().post('/orders').send(createOrderDto).expect(201).expect('Content-Type', /json/);
  };

  const deleteOrder = async (id: string) => {
    return await http().delete(`/orders/${id}`).expect(204);
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /orders returns a list of orders + meta data', () => {
    return http()
      .get('/orders')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.meta).toBeDefined();
      });
  });

  it('POST /orders -> GET /orders/:id -> DELETE /orders/:id', async () => {
    const createdOrder = await createOrder();
    const orderId = createdOrder.body.data?.id ?? createdOrder.body.id;

    const getOrder = await http().get(`/orders/${orderId}`).expect(200);
    const order = getOrder.body.data ?? getOrder.body;

    expect(order).toMatchObject({
      ...createOrderDto,
      status: expect.any(String),
      createdAt: expect.any(String),
    });
    expect(order.id).toBeDefined();

    await deleteOrder(order.id);
  });

  it('PATCH /orders/:id updates fields', async () => {
    const toUpdate = { deliveryLocation: 'Chișinău' };

    const { body } = await createOrder();
    const orderId = body.data?.id ?? body.id;

    const patch = await http().patch(`/orders/${orderId}`).send(toUpdate).expect(200).expect('Content-Type', /json/);
    const updatedOrder = patch.body.data ?? patch.body;

    expect(updatedOrder.deliveryLocation).toBe(toUpdate.deliveryLocation);

    await deleteOrder(orderId);
  });

  it('GET /orders/:id return 404 for missing order', async () => {
    const res = await http().get('/orders/fakeId').expect(404).expect('Content-Type', /json/);
    expect(res.body.message).toBe('Order not found');
  });

  it('PATCH /orders/:id return 404 for missing order', async () => {
    const res = await http()
      .patch('/orders/fakeId')
      .send({ deliveryLocation: 'x' })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body.message).toBe('Order not found');
  });

  it('DELETE /orders/:id return 404 for missing order', async () => {
    const res = await http().delete('/orders/fakeId').expect(404).expect('Content-Type', /json/);
    expect(res.body.message).toBe('Order not found');
  });
});
