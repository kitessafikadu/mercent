import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateSubSubCategoryDto } from './dto/create-subsub-category.dto';
import { UpdateSubSubCategoryDto } from './dto/update-subsub-category.dto';

@Injectable()
export class SubSubCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(
    categoryId: string,
    subcategoryId: string,
    data: CreateSubSubCategoryDto,
  ) {
    return this.prisma.subSubCategory.create({
      data: {
        ...data,
        attributes: data.attributes
          ? (data.attributes as unknown as Prisma.JsonArray)
          : [],
        subCategoryId: subcategoryId,
      },
    });
  }

  async findAll(categoryId: string, subcategoryId: string) {
    const subSubCategories = await this.prisma.subSubCategory.findMany({
      where: {
        subCategoryId: subcategoryId,
        subCategory: { categoryId },
      },
      include: {
        subCategory: {
          select: {
            id: true,
            name: true,
            categoryId: true,
          },
        },
      },
    });

    return subSubCategories.map((subSubCategory) => {
      try {
        return {
          ...subSubCategory,
          attributes: subSubCategory.attributes || [],
        };
      } catch (error) {
        console.error(
          `Failed to process attributes for subSubCategory ${subSubCategory.id}:`,
          subSubCategory.attributes,
        );
        return {
          ...subSubCategory,
          attributes: [],
        };
      }
    });
  }

  async findOne(categoryId: string, subcategoryId: string, id: string) {
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

  async update(
    categoryId: string,
    subcategoryId: string,
    id: string,
    data: UpdateSubSubCategoryDto,
  ) {
    await this.validateCategoryRelationship(categoryId, subcategoryId);

    const updated = await this.prisma.subSubCategory.update({
      where: { id },
      data: {
        name: data.name,
        attributes: this.serializeAttributes(data.attributes),
        subCategoryId: subcategoryId,
      },
      include: { subCategory: true },
    });

    return {
      ...updated,
      attributes: this.parseAttributes(updated.attributes),
    };
  }

  private serializeAttributes(attributes: any): string {
    if (!attributes) return '[]';
    return typeof attributes === 'string'
      ? attributes
      : JSON.stringify(attributes);
  }

  private parseAttributes(attributes: any): any[] {
    try {
      if (!attributes) return [];
      const str =
        typeof attributes === 'string'
          ? attributes
          : JSON.stringify(attributes);
      return JSON.parse(str);
    } catch {
      return [];
    }
  }

  private async validateCategoryRelationship(
    categoryId: string,
    subcategoryId: string,
  ) {
    const exists = await this.prisma.subCategory.count({
      where: { id: subcategoryId, categoryId },
    });
    if (!exists)
      throw new NotFoundException('Subcategory not found in category');
  }
  async remove(categoryId: string, subcategoryId: string, id: string) {
    return this.prisma.subSubCategory.delete({ where: { id } });
  }
}
