import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(categoryId: string, data: CreateSubCategoryDto) {
    return this.prisma.subCategory.create({
      data: {
        ...data,
        categoryId,
      },
    });
  }

  async findAll() {
    return this.prisma.subCategory.findMany({
      include: {
        subSubcategories: true,
      },
    });
  }

  async findOne(categoryId: string, id: string) {
    return this.prisma.subCategory.findFirst({
      where: { id, categoryId },
      include: { category: true },
    });
  }

  async update(categoryId: string, id: string, data: UpdateSubCategoryDto) {
    return this.prisma.subCategory.update({
      where: { id },
      data,
    });
  }

  async remove(categoryId: string, id: string) {
    return this.prisma.subCategory.delete({
      where: { id },
    });
  }
}
