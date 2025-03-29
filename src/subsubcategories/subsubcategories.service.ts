import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CreateSubSubCategoryDto } from './dto/create-subsub-category.dto';
import { UpdateSubSubCategoryDto } from './dto/update-subsub-category.dto';

@Injectable()
export class SubSubCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSubSubCategoryDto) {
    return this.prisma.subSubCategory.create({
      data: {
        ...data,
        attributes: data.attributes ? JSON.stringify(data.attributes) : '[]', // Store as JSON string
      },
    });
  }

  async update(id: string, data: UpdateSubSubCategoryDto) {
    return this.prisma.subSubCategory.update({
      where: { id },
      data: {
        name: data.name,
        attributes: data.attributes
          ? JSON.stringify(data.attributes) // Ensure it's stored as a JSON string
          : '[]', // Default to an empty JSON array
        subCategory: data.subCategoryId
          ? { connect: { id: data.subCategoryId } }
          : undefined,
      },
    });
  }

  async findOne(id: string) {
    const subSubCategory = await this.prisma.subSubCategory.findUnique({
      where: { id },
      include: { subCategory: true },
    });

    return {
      ...subSubCategory,
      attributes: subSubCategory?.attributes
        ? JSON.parse(subSubCategory.attributes as string)
        : [],
    };
  }

  async findAll() {
    const categories = await this.prisma.subSubCategory.findMany({
      include: {
        subCategory: true, // Ensure subCategory is included
      },
    });

    return categories.map((category) => ({
      ...category,
      attributes: JSON.parse(category.attributes as string),
      subCategory: category.subCategory ?? {}, // Ensure it's not null
    }));
  }

  async remove(id: string) {
    return this.prisma.subSubCategory.delete({ where: { id } });
  }
}
