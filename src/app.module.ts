import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/databases/database.module';

@Module({
  imports: [
    // 1. Cấu hình biến môi trường toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Kết nối Database
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
