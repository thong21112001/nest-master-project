import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Cấu hình Swagger cho dự án
 * @param app NestJS Application Instance
 */
export const configSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('NestJS Master Project')
    .setDescription('API Documentation cho hệ thống Enterprise')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập JWT token vào đây',
        in: 'header',
      },
      'JWT-auth', // Tên reference cho @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Giữ phiên đăng nhập khi F5 trình duyệt
    },
  });
};
