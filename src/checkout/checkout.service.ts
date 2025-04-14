import { Injectable, NotFoundException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { OrderService } from '../orders/orders.service';
import { PaymentService } from '../payments/payments.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.length === 0) {
      throw new NotFoundException('Your cart is empty');
    }

    const totalAmount = cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    const order = await this.orderService.createOrderFromCart(
      userId,
      cart,
      totalAmount,
      dto.notes,
    );

    const paymentUrl = await this.paymentService.initiatePayment({
      userId,
      amount: totalAmount,
      orderId: order.id,
    });

    return {
      message: 'Redirect to payment',
      paymentUrl,
      orderId: order.id,
    };
  }
}
