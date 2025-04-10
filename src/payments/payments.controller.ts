import { Controller, Post, Body, Query } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  async initialize(@Body() body: InitializePaymentDto) {
    const tx_ref = 'tx-' + Date.now();
    const callbackUrl = `${process.env.FRONTEND_URL}/payment/callback?tx_ref=${tx_ref}`;
    return this.paymentService.initializeChapaPayment(
      body.amount,
      body.email,
      tx_ref,
      callbackUrl,
    );
  }

  @Post('verify')
  async verify(@Body() body: VerifyPaymentDto) {
    return this.paymentService.verifyChapa(body.tx_ref);
  }
}
