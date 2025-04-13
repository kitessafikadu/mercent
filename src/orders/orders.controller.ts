import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { OrderService } from './orders.service';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Updated create method with quantity parameter
  @Post(':productId')
  create(
    @Param('productId') productId: string,
    @Body('buyerId') buyerId: string,
    @Body('quantity') quantity: number, // Accepting quantity from the request body
  ) {
    return this.orderService.createOrder(buyerId, productId, quantity);
  }

  @Get('buyer/:buyerId')
  getByUser(@Param('buyerId') userId: string) {
    return this.orderService.getOrdersByUser(userId);
  }

  @Patch(':orderId/status')
  updateStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatus(orderId, status);
  }
}
