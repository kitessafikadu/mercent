<<<<<<< HEAD
export class UpdateProductDto {
  name?: string;
  subcategoryId?: string;
  price?: number;
  listingType?: 'SALE' | 'RENT' | 'SERVICE';
  attributes?: Record<string, any>;
  userId: string;
}
=======
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
>>>>>>> order
