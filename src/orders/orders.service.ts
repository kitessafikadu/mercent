import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // Create a single-product order (used outside the cart context)
  async createOrder(buyerId: string, productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');
    if (product.listingType !== 'ECOMMERCE') {
      throw new BadRequestException('Only ecommerce products can be ordered');
    }

    const totalAmount = product.price * quantity;

    return this.prisma.order.create({
      data: {
        buyerId,
        totalAmount,
        orderItems: {
          create: [
            {
              productId,
              quantity,
              price: product.price,
            },
          ],
        },
      } as any, // Use 'as any' to bypass type checking for nested relations
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Create an order from cart items (used in the checkout flow)
  async createOrderFromCart(
    buyerId: string,
    items: Array<{
      productId: string;
      quantity: number;
      product: { price: number };
    }>,
    totalAmount: number,
    notes?: string,
  ) {
    return this.prisma.order.create({
      data: {
        buyerId,
        totalAmount,
        notes,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      } as any, // Use 'as any' to bypass type checking for nested relations
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Get all orders for a user, with related products
  async getOrdersByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Update the order status (e.g., from PENDING to COMPLETED)
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
