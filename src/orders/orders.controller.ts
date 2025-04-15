import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Req } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async checkout(@Req() req: AuthenticatedRequest) {
    return this.ordersService.createOrderFromCart(req.user.userId);
  }
  // @Get('buyer/:buyerId')
  // getByUser(@Param('buyerId') userId: string) {
  //   return this.orderService.getOrdersByUser(userId);
  // }

  // @Patch(':orderId/status')
  // updateStatus(
  //   @Param('orderId') orderId: string,
  //   @Body('status') status: OrderStatus,
  // ) {
  //   return this.orderService.updateOrderStatus(orderId, status);
  // }
}
