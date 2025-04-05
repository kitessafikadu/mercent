export class UpdateProductDto {
  name?: string;
  subcategoryId?: string;
  price?: number;
  listingType?: 'SALE' | 'RENT' | 'SERVICE';
  attributes?: Record<string, any>;
  userId: string;
}
