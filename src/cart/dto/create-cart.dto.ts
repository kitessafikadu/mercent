// src/cart/dto/create-cart.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    example: '660fd12c3c5f5f7e9eebdfc4',
    description: 'The ID of the buyer (User)',
  })
  userId: string;

  @ApiProperty({
    example: '660fd2f93c5f5f7e9eebdfd5',
    description: 'The ID of the product to add to cart',
  })
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product to add to the cart',
  })
  quantity: number;
}
