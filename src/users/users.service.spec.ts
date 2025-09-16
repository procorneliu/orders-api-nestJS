import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let dbMock: {
    users: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  const createUserDto = {
    name: 'test',
    email: 'test@gmail.com',
    password: '12345',
    passwordConfirm: '12345',
  };

  const userEntity = {
    id: '1',
    name: 'Test',
    email: 'test@gmail.com',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    dbMock = {
      users: {
        findMany: jest.fn(),
        findUnique: jest.fn().mockResolvedValue(userEntity),
        create: jest.fn().mockResolvedValue(userEntity),
        update: jest.fn().mockResolvedValue(userEntity),
        delete: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(1),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: dbMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('findAllUser => should return all users data', async () => {
    const users = [userEntity];
    const spyFindMany = jest.spyOn(dbMock.users, 'findMany').mockResolvedValue(users as any);
    const spyCount = jest.spyOn(dbMock.users, 'count').mockResolvedValue(1);

    const result = await usersService.findAllUser({ page: '1', size: '5' });

    expect(spyFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 5,
        omit: {
          password: true,
        },
      }),
    );
    expect(spyFindMany).toHaveBeenCalledTimes(1);
    expect(spyCount).toHaveBeenCalledWith();
    expect(result.data).toEqual(users);
    expect(result.meta).toMatchObject({
      total: 1,
      lastPage: 1,
      currentPage: 1,
      totalPerPage: 5,
      prevPage: null,
      nextPage: null,
    });
  });

  it('findUser => should find and return user data', async () => {
    const spyFindUnique = jest.spyOn(dbMock.users, 'findUnique');
    const result = await usersService.findUser('10');

    expect(spyFindUnique).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      omit: { password: true },
    });
    expect(spyFindUnique).toHaveBeenCalledTimes(1);
    expect(result).toEqual(userEntity);
  });

  it('findUser => throw NotFound when user missing', async () => {
    jest.spyOn(dbMock.users, 'findUnique').mockResolvedValueOnce(null);

    await expect(usersService.findUser('missing id')).rejects.toThrow(NotFoundException);
  });

  it('createUser => should create and return user data', async () => {
    const spyCreate = jest.spyOn(dbMock.users, 'create');
    const result = await usersService.createUser(createUserDto);

    expect(spyCreate).toHaveBeenCalledTimes(1);
    expect(result).toEqual(userEntity);
  });

  it('updateUser => should update and return user data', async () => {
    const spyUpdate = jest.spyOn(dbMock.users, 'update');
    const result = await usersService.updateUser('10', { name: 'John' });

    expect(spyUpdate).toHaveBeenCalledWith({
      where: { id: '10' },
      data: { name: 'John' },
      omit: {
        password: true,
      },
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ...userEntity });
  });

  it('updateUser => throw NotFound when user missing', async () => {
    jest.spyOn(dbMock.users, 'update').mockRejectedValueOnce({ code: 'P2025' });

    await expect(usersService.updateUser('missing id', {})).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deleteUser => should delete user and return null', async () => {
    const spyDelete = jest.spyOn(dbMock.users, 'delete');
    const result = await usersService.deleteUser('10');

    expect(spyDelete).toHaveBeenCalledWith({ where: { id: '10' } });
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it('deleteUser => throw NotFound when user missing', async () => {
    jest.spyOn(dbMock.users, 'delete').mockRejectedValueOnce({ code: 'P2025' });
    await expect(usersService.deleteUser('missing id')).rejects.toBeInstanceOf(NotFoundException);
  });
});
