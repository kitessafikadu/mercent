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

  async create(data: CreateProductDto & { imageUrl?: string }) {
    // Force conversion to number in case it comes as string
    data.price = Number(data.price);

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

    if (isNaN(data.price) || data.price <= 0) {
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
          description: data.description || '',
          imageUrl: data.imageUrl || null,
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

  async update(id: string, data: UpdateProductDto & { imageUrl?: string }) {
    // Validate listing type if provided
    if (
      data.listingType &&
      !Object.values(ListingType).includes(data.listingType as ListingType)
    ) {
      throw new BadRequestException(
        `Invalid listing type: ${data.listingType}`,
      );
    }

    // Validate attributes if provided
    let attributes = {};
    if (data.attributes) {
      try {
        // Ensure attributes is a valid object
        attributes =
          typeof data.attributes === 'object'
            ? data.attributes
            : JSON.parse(data.attributes);
      } catch (error) {
        throw new BadRequestException('Invalid attributes format');
      }
    }

    // Ensure price is a valid float number (if provided)
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

    // Prepare the data object for updating the product
    const updateData: any = {
      name: data.name,
      subSubcategoryId: data.subSubcategoryId,
      price: price,
      listingType: data.listingType as ListingType,
      attributes: Object.keys(attributes).length ? attributes : undefined, // Only set if attributes are provided
      description: data.description || undefined, // Keep existing description if not provided
      imageUrl: data.imageUrl || undefined, // Keep existing image URL if not provided
    };

    try {
      // Perform the update operation
      return this.prisma.product.update({
        where: { id },
        data: updateData,
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
