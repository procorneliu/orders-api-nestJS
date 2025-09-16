import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';
import { RolesGuard } from '../src/auth/guards/roles.guard';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

class AllowAllRoles implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('Authentication (e2e)', () => {
  let app: INestApplication<App>;
  let user: User;
  let cookies: string;
  let tokens: Tokens;

  const createUserDto = {
    name: 'test-auth26',
    email: 'test-auth26@gmail.com',
    password: '12345',
    passwordConfirm: '12345',
  };

  const checkResponseMatch = (userData: User, tokens: Tokens) => {
    expect(userData).toBeDefined();
    expect(tokens).toBeDefined();

    expect(userData).toMatchObject({
      id: expect.any(String),
      name: createUserDto.name,
      email: createUserDto.email,
      role: 'USER',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    expect(tokens).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  };

  const http = () => request(app.getHttpServer());

  const createUser = async () => {
    return http().post('/auth/signup').send(createUserDto).expect(201).expect('Content-Type', /json/);
  };

  const deleteUser = async (id: string, cookies: string) => {
    return http().delete(`/users/${id}`).set('Cookie', cookies).expect(204);
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(RolesGuard)
      .useValue(AllowAllRoles)
      .compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    await app.init();

    const result = await createUser();
    user = result.body.userData;
    tokens = result.body.tokens;

    checkResponseMatch(user, tokens);

    cookies = result.headers['set-cookie'];
  });

  afterAll(async () => {
    await deleteUser(user.id, cookies);

    await app.close();
  });

  it('POST /auth/signin', async () => {
    const authDto = {
      email: createUserDto.email,
      password: createUserDto.password,
    };

    const result = await http().post('/auth/signin').send(authDto).expect(200);
    const { userData, tokens } = result.body;

    checkResponseMatch(userData, tokens);
  });

  it('POST /auth/refresh', async () => {
    const result = await http()
      .get('/auth/refresh')
      .set('Authorization', `Bearer ${tokens.refreshToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(result.body.refreshToken).not.toEqual(tokens.refreshToken);
    expect(result.body.accessToken).not.toEqual(tokens.accessToken);
  });

  it('POST /auth/logout', async () => {
    const result = await http()
      .get('/auth/logout')
      .set('Cookie', cookies)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect('set-cookie', /accessToken=;/);

    expect(result.body.refresh_token).toBeNull();
  });
});
