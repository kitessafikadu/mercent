import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CloudinaryService],
})
export class UsersModule {}
