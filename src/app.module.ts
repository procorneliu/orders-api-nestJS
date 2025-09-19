import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { CustomCacheInterceptor } from './common/interceptors/custom-cache-interceptor';

import KeyvRedis from '@keyv/redis';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { HealthController } from './health/health.controller';
import { VersionController } from './version/version.controller';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

import * as Joi from 'joi';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: 120 * 1000, // 60 seconds
        stores: [
          new KeyvRedis(`redis://${configService.getOrThrow('REDIS_HOST')}:${configService.getOrThrow('REDIS_PORT')}`),
        ],
      }),
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().port().default(3000),
        JWT_ACCESS_SECRET: Joi.string().min(10),
        JWT_REFRESH_SECRET: Joi.string().min(10),
        REDIS_PORT: Joi.number().port().default(6379),
        REDIS_HOST: Joi.string().hostname().default('localhost'),
        DATABASE_URL: Joi.string().uri().required(),
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
  ],
  controllers: [AppController, HealthController, VersionController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor,
    },
  ],
})
export class AppModule {}
