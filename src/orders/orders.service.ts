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

  async createOrder(buyerId: string, productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');
    if (product.listingType !== 'ECOMMERCE') {
      throw new BadRequestException('Only ecommerce products can be ordered');
    }

    // Calculate the total amount based on the quantity
    const totalAmount = product.price * quantity;

    return this.prisma.order.create({
      data: {
        buyerId,
        productId,
        totalAmount,
        quantity, // Include the quantity in the order data
      },
    });
  }

  async getOrdersByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      include: { product: true },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
