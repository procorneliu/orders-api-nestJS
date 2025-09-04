import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;

  const createUserDto = {
    name: 'test',
    email: `test${Date.now()}@gmail.com`,
    password: '12345',
    passwordConfirm: '12345',
  };

  const http = () => request(app.getHttpServer());

  const createUser = async () => {
    return await http().post('/users').send(createUserDto).expect(201).expect('Content-Type', /json/);
  };

  const deleteUser = async (id: string) => await http().delete(`/users/${id}`).expect(204);

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

  it('GET /users returns a list of users + meta data', () => {
    return http()
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.meta).toBeDefined();
      });
  });

  it('POST /users -> GET /users/:id -> DELETE /users/:id', async () => {
    const createdUser = await createUser();

    const getUser = await http()
      .get(`/users/${createdUser.body.data?.id ?? createdUser.body.id}`)
      .expect(200);

    const user = getUser.body.data ?? getUser.body;
    expect(user).toMatchObject({
      name: 'test',
      email: createUserDto.email,
      role: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(user.id).toBeDefined();

    await deleteUser(user.id);
  });

  it('PATCH /users/:id updates fields', async () => {
    const toUpdate = { name: 'Grace' };

    const { body } = await createUser();
    const userId = body.data?.id ?? body.id;

    const patch = await http().patch(`/users/${userId}`).send(toUpdate).expect(200).expect('Content-Type', /json/);
    const updatedUser = patch.body.data ?? patch.body;

    expect(updatedUser.name).toBe(toUpdate.name);
    expect(new Date(updatedUser.updatedAt).getTime()).toBeGreaterThan(new Date(updatedUser.createdAt).getTime());

    await deleteUser(userId);
  });

  it('GET /users/:id returns 404 for missing user', async () => {
    const res = await http().get('/users/fakeId').expect(404).expect('Content-Type', /json/);
    expect(res.body.message).toBe('User not found');
  });

  it('PATCH /users/:id returns 404 for missing user', async () => {
    const res = await http().patch('/users/fakeId').send({ name: 'x' }).expect(404).expect('Content-Type', /json/);
    expect(res.body.message).toBe('User not found');
  });

  it('DELETE /users/:id returns 404 for missing user', async () => {
    const res = await http().delete('/users/fakeId').expect(404).expect('Content-Type', /json/);
    expect(res.body.message).toBe('User not found');
  });
});
