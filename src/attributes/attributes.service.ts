import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';

@Injectable()
export class AttributesService {
  constructor(private prisma: PrismaService) {}

  // ✅ Set attributes for a Main Category
  async setCategoryAttributes(categoryId: string, data: CreateAttributeDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.category.update({
      where: { id: categoryId },
      data: { attributes: data.attributes },
    });
  }

  // ✅ Get attributes of a Main Category
  async getCategoryAttributes(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { attributes: true },
    });
    if (!category) throw new NotFoundException('Category not found');

    return category.attributes;
  }

  // ✅ Set attributes for a Sub-Subcategory
  async setSubSubcategoryAttributes(
    subSubcategoryId: string,
    data: CreateAttributeDto,
  ) {
    const subSubcategory = await this.prisma.subSubCategory.findUnique({
      where: { id: subSubcategoryId },
    });
    if (!subSubcategory)
      throw new NotFoundException('Sub-subcategory not found');

    return this.prisma.subSubCategory.update({
      where: { id: subSubcategoryId },
      data: { attributes: data.attributes },
    });
  }

  // ✅ Get combined attributes (Main Category + SubSubCategory)
  // async getCombinedAttributes(subSubcategoryId: string) {
  //   const subSubcategory = await this.prisma.subSubCategory.findUnique({
  //     where: { id: subSubcategoryId },
  //     include: { subCategory: { include: { category: true } } },
  //   });

  //   if (!subSubcategory)
  //     throw new NotFoundException('Sub-subcategory not found');

  //   // Get attributes from the main category and sub-subcategory
  //   const mainCategoryAttributes =
  //     subSubcategory.subCategory.category.attributes || {};
  //   const subSubCategoryAttributes = subSubcategory.attributes || {};

  //   return {
  //     ...(typeof mainCategoryAttributes === 'object'
  //       ? mainCategoryAttributes
  //       : {}),
  //     ...(typeof subSubCategoryAttributes === 'object'
  //       ? subSubCategoryAttributes
  //       : {}),
  //   };
  // }
}
