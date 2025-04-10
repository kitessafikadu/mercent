import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CloudinaryModule } from 'src/config/cloudinary.module';
@Module({
  imports: [CloudinaryModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
