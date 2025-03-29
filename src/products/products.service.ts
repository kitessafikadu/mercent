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
    console.log('Method called with data:', data);

    try {
      const product = await this.prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          listingType: data.listingType as ListingType, // Cast to ListingType
          attributes: data.attributes || {},

          // Corrected Relation: Connect existing subSubcategory
          subSubcategory: { connect: { id: data.subSubcategoryId } },
        },
      });

      console.log('Created Product:', product);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
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
