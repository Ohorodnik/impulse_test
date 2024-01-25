import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, ConfigModule.forRoot({ validate })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
