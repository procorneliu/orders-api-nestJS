import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { HealthController } from './health/health.controller';
import { VersionController } from './version/version.controller';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().port().default(3000),
        DATABASE_URL: Joi.string().uri().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController, HealthController, VersionController],
  providers: [AppService],
})
export class AppModule {}
