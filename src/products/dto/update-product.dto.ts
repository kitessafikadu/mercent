import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ListingType, BrokerageType } from '@prisma/client';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Updated iPhone 14 Pro',
    description: 'Updated name of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '661c43efba6f3f13b93821b7',
    description: 'Updated subcategory ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @ApiProperty({
    example: 999.99,
    description: 'Updated price',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: '',
    description: 'Update description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ListingType,
    description: 'Updated listing type',
    required: false,
  })
  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @ApiProperty({
    enum: BrokerageType,
    description:
      'Updated brokerage type (only applies if listingType is BROKERAGE)',
    required: false,
  })
  @IsOptional()
  @IsEnum(BrokerageType)
  brokerageType?: BrokerageType;

  @ApiProperty({
    example: { warranty: '2 years', brand: 'Apple' },
    description: 'Updated key-value product attributes',
    required: false,
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @ApiProperty({
    example: '661c43efba6f3f13b93821b8',
    description: 'User ID of the owner',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product image file (JPG/PNG)',
    required: false,
  })
  @IsOptional()
  imageUrl?: any;
}
