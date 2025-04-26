import { ListingType } from '@prisma/client';
<<<<<<< HEAD
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
    example: 'SELL',
  })
  @IsEnum(ListingType)
  listingType: ListingType; // Use the Prisma enum type

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
=======
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEnum,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(ListingType, { message: 'Invalid listing type' })
  listingType: ListingType;

  @IsObject()
  attributes: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
>>>>>>> order
}
