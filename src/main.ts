import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { configSwagger } from './configs/swagger.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 1. Kích hoạt Validation Pipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field không khai báo trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu gửi thừa field
      transform: true, // Tự động convert data theo type của DTO
    }),
  );

  // 2. Cấu hình Swagger
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  //Set up swagger
  configSwagger(app);
  //Start Server
  //http://localhost:3000/api-docs
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  const url = await app.getUrl();
  logger.log(`Application is running on: ${url}`);
  logger.log(`Swagger is running on: ${url}/api-docs`);
}
void bootstrap();
