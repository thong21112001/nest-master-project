import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // MongooseModule.forFeatureAsync({
    //   name: User.name,
    //   useFactory: () => UserSchema,
    // }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
