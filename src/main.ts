import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/config/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/config/prisma-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setDescription('The Orders API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, documentFactory, { jsonDocumentUrl: 'docs-json' });

  // Implementing default data validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  // // global http exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter), new AllExceptionsFilter());

  // global interceptor to format response
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
