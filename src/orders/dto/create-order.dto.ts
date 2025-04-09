import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID of the buyer' })
  @IsString()
  buyerId: string;

  @ApiProperty({ description: 'ID of the product/item' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Total order amount' })
  @IsNumber()
  totalAmount: number;
}
