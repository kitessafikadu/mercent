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
        attributes: data.attributes ?? {}, // Ensure attributes is always a valid JSON object
      },
    });
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: { subcategories: true },
    });

    return categories.map((category) => ({
      ...category,
      attributes: category.attributes ?? {}, // Replace null with an empty object
    }));
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { subcategories: true },
    });
  }

  async update(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
