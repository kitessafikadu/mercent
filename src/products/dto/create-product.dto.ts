import { ListingType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product A',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The ID of the subcategory the product belongs to',
    example: 'subcategory-id',
  })
  @IsString()
  subcategoryId: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 100.0,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The listing type of the product',
    enum: ListingType,
    example: 'ECOMMERCE',
  })
  @IsEnum(ListingType)
  listingType: ListingType;

  @ApiProperty({
    description: 'Additional attributes of the product',
    example: { color: 'red', size: 'M' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  attributes: Record<string, any>;

  @ApiProperty({
    description: 'The ID of the user who owns the product',
    example: 'user-id',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Image URL of the product stored in Cloudinary',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/products/productA.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
