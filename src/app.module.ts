import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/databases/database.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    // 1. Cấu hình biến môi trường toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Kết nối Database
    DatabaseModule,

    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
