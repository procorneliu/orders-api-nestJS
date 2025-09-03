import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  let mockUserService: jest.Mocked<
    Pick<UsersService, 'findAllUser' | 'findUser' | 'createUser' | 'updateUser' | 'deleteUser'>
  >;

  const user = {
    id: 1,
    name: 'test',
    email: 'test@gmail.com',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  beforeEach(async () => {
    mockUserService = {
      findAllUser: jest.fn(),
      findUser: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUser => return array of all users', async () => {
    // arrange
    const users = [user];

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

    jest.spyOn(mockUserService, 'findAllUser').mockResolvedValue({ data: users, meta });

    // act
    const result = await controller.findAll(query);

    // assert
    expect(mockUserService.findAllUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.findAllUser).toHaveBeenCalledWith(query);

    expect(result).toEqual({ data: users, meta });
  });

  it('findUser => return user data', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockUserService, 'findUser').mockResolvedValue(user);

    // act
    const result = await controller.findOne(id);

    // assert
    expect(mockUserService.findUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.findUser).toHaveBeenCalledWith(id);

    expect(result).toEqual(user);
  });

  it('createUser => create and return new user', async () => {
    // arrange
    const createUserDto = {
      name: 'test',
      email: 'test@gmail.com',
      password: '12345',
      passwordConfirm: '12345',
    };

    jest.spyOn(mockUserService, 'createUser').mockResolvedValue(user);

    // act
    const result = await controller.createUser(createUserDto);

    // assert
    expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);

    expect(result).toEqual(user);
  });

  it('updateUser => update and return user data', async () => {
    // arrange
    const id = '1';

    const toUpdate = {
      name: 'test2',
    };

    const updatedUser = { ...user, ...toUpdate };

    jest.spyOn(mockUserService, 'updateUser').mockResolvedValue(updatedUser);

    // act
    const result = await controller.updateUser(id, toUpdate);

    // assert
    expect(mockUserService.updateUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.updateUser).toHaveBeenCalledWith(id, toUpdate);

    expect(result).toEqual(updatedUser);
  });

  it('deleteUser => delete user and return null', async () => {
    // arrange
    const id = '1';

    jest.spyOn(mockUserService, 'deleteUser').mockResolvedValue(null);
    // act
    const result = await controller.deleteUser(id);

    // assert
    expect(mockUserService.deleteUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(id);

    expect(result).toBeNull();
  });
});
