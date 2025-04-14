import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ListingType, BrokerageType } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 14 Pro',
    description: 'The name of the product',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1299.99,
    description: 'Price of the product in USD',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'Latest Apple smartphone with advanced features.',
    description: 'Detailed product description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ListingType,
    example: ListingType.ECOMMERCE,
    description:
      'Defines whether the product is for direct sale, brokerage, or service.',
  })
  @IsEnum(ListingType)
  listingType: ListingType;

  @ApiProperty({
    enum: BrokerageType,
    example: BrokerageType.SALE,
    description:
      'Defines whether brokerage product is for SALE or RENT. Only required if listingType is BROKERAGE.',
    required: false,
  })
  @IsOptional()
  @IsEnum(BrokerageType)
  brokerageType?: BrokerageType;

  @ApiProperty({
    example: '661c43efba6f3f13b93821b7',
    description: 'Subcategory ID this product belongs to',
  })
  @IsString()
  subcategoryId: string;

  @ApiProperty({
    example: '661c43efba6f3f13b93821b8',
    description: 'ID of the user who created this product',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: { color: 'black', warranty: '1 year' },
    description: 'Custom key-value attributes of the product',
    required: false,
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product image file (JPG/PNG)',
    required: false,
  })
  @IsOptional()
  imageUrl?: any;
}
