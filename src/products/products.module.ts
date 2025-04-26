import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CloudinaryService } from 'src/config/cloudinary.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, CloudinaryService],
  exports: [ProductsService],
})
export class ProductsModule {}
