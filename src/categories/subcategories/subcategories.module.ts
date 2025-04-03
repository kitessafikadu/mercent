import { Module } from '@nestjs/common';
import { SubCategoriesService } from './subcategories.service';
import { SubCategoriesController } from './subcategories.controller';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Module({
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService, PrismaService],
  exports: [SubCategoriesService],
})
export class SubCategoriesModule {}
