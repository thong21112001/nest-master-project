import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Kích hoạt Validation Pipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field không khai báo trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu gửi thừa field
      transform: true, // Tự động convert data theo type của DTO
    }),
  );

  // 2. Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Master Project')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth() // Để sau này test JWT
    .build();

  //http://localhost:3000/api/docs
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
