export class UpdateProductDto {
  name?: string;
  subSubcategoryId?: string;
  price?: number;
  listingType?: 'SALE' | 'RENT' | 'SERVICE';
  attributes?: Record<string, any>;
}
