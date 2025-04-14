import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cart items for a user' })
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a product to the cart' })
  @ApiBody({
    description: 'Data to add item to cart',
    type: CreateCartDto,
    examples: {
      example1: {
        summary: 'Add product to cart',
        value: {
          productId: '660fd2f93c5f5f7e9eebdfd5',
          quantity: 3,
        },
      },
    },
  })
  addToCart(@Req() req, @Body() dto: CreateCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Patch(':cartItemId')
  @ApiOperation({ summary: 'Update quantity of a cart item' })
  @ApiParam({
    name: 'cartItemId',
    description: 'ID of the cart item to update',
  })
  updateItem(@Param('cartItemId') id: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateQuantity(id, dto);
  }

  @Delete(':cartItemId')
  @ApiOperation({ summary: 'Remove a specific item from the cart' })
  @ApiParam({
    name: 'cartItemId',
    description: 'ID of the cart item to remove',
  })
  removeItem(@Param('cartItemId') id: string) {
    return this.cartService.removeItem(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all items from the cart' })
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
