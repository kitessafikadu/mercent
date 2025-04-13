export class UpdateProductDto {
  name?: string;
  subcategoryId?: string;
  price?: number;
  listingType?: 'ECOMMERCE' | 'BROKERAGE' | 'SERVICE';
  attributes?: Record<string, any>;
  userId: string;
  imageUrl?: string;
}
