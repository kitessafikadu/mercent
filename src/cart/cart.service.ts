import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(dto: AddToCartDto & { buyerId: string }) {
    const { buyerId, productId, quantity } = dto;

    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, price: true }, // Only get needed fields
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check for existing cart item
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { buyerId, productId },
    });

    if (existingItem) {
      // Update quantity if already in cart
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }, // Return full product details
      });
    }

    // Create new cart item
    return this.prisma.cartItem.create({
      data: {
        buyerId,
        productId,
        quantity,
      },
      include: { product: true }, // Return full product details
    });
  }

  async getCart(buyerId: string) {
    return this.prisma.cartItem.findMany({
      where: { buyerId },
      include: {
        product: true,
      },
    });
  }

  async removeFromCart(buyerId: string, productId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        buyerId, // Ensures users can only delete their own items
        productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in your cart');
    }

    // 2. Delete the item
    return this.prisma.cartItem.delete({
      where: { id: cartItem.id },
      include: { product: true }, // Return deleted item + product details
    });
  }

  async clearCart(buyerId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { buyerId },
    });

    return { message: 'Cart cleared successfully' };
  }

  async checkout(buyerId: string) {
    return this.prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { buyerId },
        include: { product: true },
      });

      if (!cartItems.length) {
        throw new BadRequestException('Cart is empty');
      }

      // 1. Create the order with items
      const order = await tx.order.create({
        data: {
          buyerId,
          totalAmount: cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
          ),
          status: 'PENDING',
          items: {
            create: cartItems.map((item) => ({
              product: { connect: { id: item.productId } },
              quantity: item.quantity,
              priceAtOrder: item.product.price,
            })),
          },
        },
      });

      // 2. Clear cart
      await tx.cartItem.deleteMany({ where: { buyerId } });

      return {
        message: 'Order placed successfully',
        order,
      };
    });
  }
  async updateCartItem(dto: UpdateCartDto & { buyerId: string }) {
    // 1. Check if item exists in user's cart
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        buyerId: dto.buyerId,
        productId: dto.productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in your cart');
    }

    // 2. Update quantity
    return this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: dto.quantity },
      include: { product: true }, // Return product details
    });
  }
}
