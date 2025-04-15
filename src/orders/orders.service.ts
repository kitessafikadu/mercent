import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { ChapaService } from 'src/payments/chapa/chapa.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private chapaService: ChapaService,
  ) {}

  async createOrderFromCart(buyerId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get user and cart items
      const [user, cartItems] = await Promise.all([
        tx.user.findUnique({
          where: { id: buyerId },
          select: { email: true },
        }),
        tx.cartItem.findMany({
          where: { buyerId },
          include: { product: true },
        }),
      ]);

      if (!user) throw new Error('User not found');
      if (cartItems.length === 0) throw new Error('Cart is empty');

      if (!user.email) {
        throw new Error('User email not found.');
      }

      console.log('User email:', user.email); // Log user email for debugging

      // 2. Create order
      const order = await tx.order.create({
        data: {
          buyerId,
          totalAmount: cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
          ),
          status: OrderStatus.PENDING,
          items: {
            create: cartItems.map((item) => ({
              product: { connect: { id: item.productId } },
              quantity: item.quantity,
              priceAtOrder: item.product.price,
            })),
          },
        },
      });

      console.log('Order created:', order); // Log order details for debugging

      // 3. Process payment
      try {
        const payment = await this.chapaService.initiatePayment({
          amount: order.totalAmount,
          email: user.email,
          orderId: order.id,
        });

        console.log('Payment response:', payment); // Log the payment response

        if (!payment?.checkout_url) {
          throw new Error(
            'Payment initialization failed, missing checkout_url',
          );
        }

        // If tx_ref is not available, generate a unique identifier for the payment
        const tx_ref = payment.tx_ref || `order_${order.id}_${Date.now()}`;

        // Update order with payment details
        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentId: tx_ref,
            paymentUrl: payment.checkout_url,
            currency: 'ETB',
            status:
              payment.status === 'success'
                ? OrderStatus.PAID
                : OrderStatus.PENDING, // Update order status here
          },
        });

        // Clear the cart items
        await tx.cartItem.deleteMany({ where: { buyerId } });

        return {
          order,
          paymentUrl: payment.checkout_url,
        };
      } catch (error) {
        console.error('Error during payment initialization:', error); // Log detailed error
        throw new Error('Payment initialization failed');
      }
    });
  }

  async updateOrderStatus(paymentId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { paymentId },
      data: { status },
    });
  }
}
