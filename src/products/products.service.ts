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

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    if (
      !data.name ||
      !data.price ||
      !data.listingType ||
      !data.subSubcategoryId
    ) {
      throw new BadRequestException('Missing required fields');
    }

    if (!Object.values(ListingType).includes(data.listingType as ListingType)) {
      throw new BadRequestException(
        `Invalid listing type: ${data.listingType}`,
      );
    }

    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new BadRequestException('Price must be a positive number');
    }

    let subSubcategory;
    try {
      subSubcategory = await this.prisma.subSubCategory.findUnique({
        where: { id: data.subSubcategoryId },
        select: { id: true },
      });

      if (!subSubcategory) {
        throw new NotFoundException(
          `SubSubcategory with ID ${data.subSubcategoryId} not found`,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Invalid subSubcategoryId format');
    }

    const attributes =
      data.attributes && typeof data.attributes === 'object'
        ? data.attributes
        : {};

    try {
      const product = await this.prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          listingType: data.listingType as ListingType,
          attributes,
          subSubcategoryId: data.subSubcategoryId,
        },
      });

      return await this.prisma.product.findUnique({
        where: { id: product.id },
        include: {
          subSubcategory: {
            select: {
              id: true,
              name: true,
              subCategory: {
                select: {
                  id: true,
                  name: true,
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
    return this.prisma.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    if (
      data.listingType &&
      !Object.values(ListingType).includes(data.listingType as ListingType)
    ) {
      throw new BadRequestException(
        `Invalid listing type: ${data.listingType}`,
      );
    }

    try {
      return this.prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          subSubcategoryId: data.subSubcategoryId,
          price: data.price,
          listingType: data.listingType as ListingType,
          attributes: data.attributes ? { ...data.attributes } : undefined,
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
