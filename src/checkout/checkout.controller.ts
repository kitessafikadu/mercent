import { Controller, Post, Req, Body, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async checkout(@Req() req, @Body() dto: CheckoutDto) {
    const userId = req.user.id;
    return this.checkoutService.checkout(userId, dto);
  }
}
