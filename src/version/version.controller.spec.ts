import { Test, TestingModule } from '@nestjs/testing';
import { VersionController } from './version.controller';
import { ConfigService } from '@nestjs/config';

describe('VersionController', () => {
  let controller: VersionController;

  const mockConfigService = {
    get: () => {
      return 'test';
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
      controllers: [VersionController],
    }).compile();

    controller = module.get<VersionController>(VersionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return info about app version', () => {
    expect(controller.version()).toEqual({
      app: expect.any(String),
      version: expect.any(String),
      env: 'test',
    });
  });
});
