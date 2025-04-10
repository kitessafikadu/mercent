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
        name: data.name,
        description: data.description || '', // Use empty string if description is missing
        attributes: Array.isArray(data.attributes)
          ? data.attributes
          : data.attributes
            ? data.attributes.split(',').map((item) => item.trim())
            : [], // Make sure attributes is an array
        imageUrl: data.imageUrl || null, // Store imageUrl, null if not provided
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

    return categories.map((category) => {
      let parsedAttributes = {};

      if (typeof category.attributes === 'string') {
        try {
          // First, check if the string is wrapped in extra quotes (like ""color,size"")
          let attributesStr = category.attributes.trim();

          // Remove surrounding quotes if they exist
          if (attributesStr.startsWith('"') && attributesStr.endsWith('"')) {
            attributesStr = attributesStr.slice(1, -1);
          }

          // Try to parse as JSON (in case it's a JSON string without extra quotes)
          try {
            parsedAttributes = JSON.parse(attributesStr);
          } catch {
            // If not JSON, check for comma-separated values
            if (attributesStr.includes(',')) {
              parsedAttributes = {
                options: attributesStr.split(',').map((item) => item.trim()),
              };
            } else {
              parsedAttributes = { value: attributesStr };
            }
          }
        } catch (error) {
          console.error(
            `Failed to parse attributes for category ${category.id}:`,
            error,
          );
          parsedAttributes = {}; // Fallback to empty object
        }
      } else {
        // If it's not a string, assume it's already a valid object
        parsedAttributes = category.attributes || {};
      }

      return {
        ...category,
        attributes: parsedAttributes,
      };
    });
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

    const attributes = Array.isArray(data.attributes)
      ? data.attributes
      : data.attributes
        ? data.attributes.split(',').map((item) => item.trim())
        : existingCategory.attributes;

    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name || existingCategory.name,
        description: data.description ?? existingCategory.description,
        imageUrl: data.imageUrl ?? existingCategory.imageUrl,
        attributes,
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
