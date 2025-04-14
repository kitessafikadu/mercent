import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListingType, BrokerageType } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto & { imageUrl?: string }) {
    console.log('Method called with data:', data);

    // Validate and parse price
    const parsedPrice = parseFloat(data.price as any);
    if (isNaN(parsedPrice)) {
      throw new BadRequestException('Price must be a valid number');
    }

    // Parse attributes JSON if needed
    let parsedAttributes = {};
    try {
      parsedAttributes =
        typeof data.attributes === 'string'
          ? JSON.parse(data.attributes)
          : data.attributes || {};
    } catch {
      throw new BadRequestException('Invalid JSON for attributes');
    }

    // Validate brokerageType if listingType is BROKERAGE
    if (data.listingType === ListingType.BROKERAGE && !data.brokerageType) {
      throw new BadRequestException(
        'brokerageType is required when listingType is BROKERAGE',
      );
    }

    try {
      const product = await this.prisma.product.create({
        data: {
          name: data.name,
          price: parsedPrice,
          imageUrl: data.imageUrl,
          description: data.description,
          listingType: data.listingType as ListingType,
          brokerageType: data.brokerageType as BrokerageType | undefined,
          attributes: parsedAttributes,

          subcategory: { connect: { id: data.subcategoryId } },
          user: { connect: { id: data.userId } },
        },
      });

      console.log('Created Product:', product);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException(
        `Error creating product: ${error.message}`,
      );
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        subcategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        subcategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        user: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
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

    if (data.listingType === ListingType.BROKERAGE && !data.brokerageType) {
      throw new BadRequestException(
        'brokerageType is required when listingType is BROKERAGE',
      );
    }

    const parsedPrice =
      typeof data.price === 'string' ? parseFloat(data.price) : data.price;
    if (parsedPrice !== undefined && isNaN(parsedPrice)) {
      throw new BadRequestException('Price must be a valid number');
    }

    let parsedAttributes = {};
    try {
      parsedAttributes =
        typeof data.attributes === 'string'
          ? JSON.parse(data.attributes)
          : data.attributes || {};
    } catch {
      throw new BadRequestException('Invalid JSON for attributes');
    }

    try {
      return this.prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          price: parsedPrice,
          imageUrl: data.imageUrl,
          description: data.description,
          listingType: data.listingType as ListingType,
          brokerageType: data.brokerageType as BrokerageType | undefined,
          attributes: parsedAttributes,

          subcategory: data.subcategoryId
            ? { connect: { id: data.subcategoryId } }
            : undefined,
          user: data.userId ? { connect: { id: data.userId } } : undefined,
        },
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw new InternalServerErrorException(
        `Error updating product: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    try {
      return this.prisma.product.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new InternalServerErrorException(
        `Error deleting product: ${error.message}`,
      );
    }
  }
}
