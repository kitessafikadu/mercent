import { Module } from '@nestjs/common';
import { SubSubCategoriesService } from './subsubcategories.service';
import { SubSubCategoriesController } from './subsubcategories.controller';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Module({
  controllers: [SubSubCategoriesController],
  providers: [SubSubCategoriesService, PrismaService],
})
export class SubSubCategoriesModule {}
