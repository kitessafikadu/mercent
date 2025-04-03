import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...data,
        attributes: data.attributes ? JSON.stringify(data.attributes) : '{}',
      },
    });
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        subcategories: {
          include: { subSubcategories: true },
        },
      },
    });

    return categories.map((category) => ({
      ...category,
      attributes:
        typeof category.attributes === 'string'
          ? JSON.parse(category.attributes)
          : category.attributes || {},
    }));
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: {
          include: { subSubcategories: true },
        },
      },
    });

    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name || existingCategory.name,
        attributes: data.attributes
          ? data.attributes
          : existingCategory.attributes,
      },
    });
  }

  async remove(id: string) {
    console.log('Deleting Category ID:', id);

    await this.prisma.subSubCategory.deleteMany({
      where: { subCategory: { categoryId: id } },
    });
    await this.prisma.subCategory.deleteMany({ where: { categoryId: id } });

    return this.prisma.category.delete({ where: { id } });
  }
}
