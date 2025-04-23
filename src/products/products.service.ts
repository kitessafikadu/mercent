import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListingType } from '@prisma/client';
import { ObjectId } from 'bson';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto & { imageUrl?: string }, userId: string) {
    data.price = Number(data.price);
    data.quantity = Number(data.quantity);
    console.log('Incoming data:', data);

    if (!data.subCategoryId) {
      throw new BadRequestException('Missing subCategoryId');
    }

    if (!ObjectId.isValid(data.subCategoryId)) {
      throw new BadRequestException('Invalid subCategoryId format');
    }

    const subSubcategory = await this.prisma.subCategory.findUnique({
      where: { id: data.subCategoryId },
    });

    if (!subSubcategory) {
      throw new BadRequestException('Subcategory not found');
    }

    let attributes = {};
    try {
      attributes =
        data.attributes && typeof data.attributes === 'string'
          ? JSON.parse(data.attributes)
          : (data.attributes ?? {});
    } catch (err) {
      throw new BadRequestException('Invalid attributes format (must be JSON)');
    }

    console.log('Parsed attributes:', attributes);

    try {
      const product = await this.prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          listingType: data.listingType as ListingType,
          quantity: data.quantity,
          attributes,
          subcategory: {
            connect: { id: data.subCategoryId },
          },
          description: data.description || '',
          imageUrl: data.imageUrl || null,
          user: {
            connect: { id: userId },
          },
        },
      });

      console.log('Saved product:', product);

      return await this.prisma.product.findUnique({
        where: { id: product.id },
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
          description: true,
          imageUrl: true,
          listingType: true,
          brokerageType: true,
          attributes: true,
          subcategoryId: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          subcategory: {
            select: {
              id: true,
              name: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  attributes: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Product creation failed:', error);
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async findAll() {
    return await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageUrl: true,
        listingType: true,
        brokerageType: true,
        attributes: true,
        subcategoryId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        subcategory: {
          select: {
            id: true,
            name: true,
            category: {
              select: {
                id: true,
                name: true,
                attributes: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageUrl: true,
        listingType: true,
        brokerageType: true,
        attributes: true,
        subcategoryId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        subcategory: {
          select: {
            id: true,
            name: true,
            category: {
              select: {
                id: true,
                name: true,
                attributes: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, data: UpdateProductDto & { imageUrl?: string }) {
    if (
      data.listingType &&
      !Object.values(ListingType).includes(data.listingType as ListingType)
    ) {
      throw new BadRequestException(
        `Invalid listing type: ${data.listingType}`,
      );
    }

    let attributes = {};
    if (data.attributes) {
      try {
        attributes =
          typeof data.attributes === 'object'
            ? data.attributes
            : JSON.parse(data.attributes);
      } catch (error) {
        throw new BadRequestException('Invalid attributes format');
      }
    }
    let price: number | undefined;
    if (data.price) {
      price =
        typeof data.price === 'string' ? parseFloat(data.price) : data.price;
      if (isNaN(price)) {
        throw new BadRequestException(
          'Invalid price format. Price must be a valid number.',
        );
      }
    }

    const updateData: any = {
      name: data.name,
      subCategoryId: data.subCategoryId,
      price,
      listingType: data.listingType as ListingType,
      attributes: Object.keys(attributes).length ? attributes : undefined,
      description: data.description || undefined,
      imageUrl: data.imageUrl || undefined,
    };

    try {
      const updated = await this.prisma.product.update({
        where: { id },
        data: updateData,
      });

      return await this.prisma.product.findUnique({
        where: { id: updated.id },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          imageUrl: true,
          listingType: true,
          brokerageType: true,
          attributes: true,
          subcategoryId: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          subcategory: {
            select: {
              id: true,
              name: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  attributes: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating product: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    try {
      return this.prisma.product.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting product: ${error.message}`,
      );
    }
  }
}
