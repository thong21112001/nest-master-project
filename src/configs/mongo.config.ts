import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

/**
 * Factory function để tạo cấu hình kết nối MongoDB
 * Giúp tách biệt logic cấu hình ra khỏi Module chính
 */
export const getMongoConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => {
  return {
    uri: configService.get<string>('MONGO_URI'),
  };
};
