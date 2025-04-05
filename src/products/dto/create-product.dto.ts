import { ListingType } from '@prisma/client';
export class CreateProductDto {
  name: string;
  subcategoryId: string;
  price: number;
  listingType: ListingType; // Use the Prisma enum type
  attributes: Record<string, any>;
  userId: string;
}
