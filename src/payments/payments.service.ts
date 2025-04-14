import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  async initializeChapaPayment(
    amount: number,
    email: string,
    tx_ref: string,
    callbackUrl: string,
  ) {
    const payload = {
      amount,
      currency: 'ETB',
      email,
      tx_ref,
      return_url: callbackUrl,
      callback_url: callbackUrl,
      public_key: process.env.CHAPA_PUBLIC_KEY,
    };

    const { data } = await firstValueFrom(
      this.http.post(
        'https://api.chapa.co/v1/transaction/initialize',
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          },
        },
      ),
    );

    return data;
  }

  async verifyChapa(tx_ref: string) {
    const { data } = await firstValueFrom(
      this.http.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }),
    );

    return data;
  }

  async initiatePayment({
    userId,
    amount,
    orderId,
  }: {
    userId: string;
    amount: number;
    orderId: string;
  }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.email) {
      throw new NotFoundException('User email not found for payment');
    }

    const tx_ref = `ORDER_${orderId}_${Date.now()}`;
    const callbackUrl = `${process.env.CALLBACK_BASE_URL}/payments/verify?orderId=${orderId}&tx_ref=${tx_ref}`;

    const chapaResponse = await this.initializeChapaPayment(
      amount,
      user.email,
      tx_ref,
      callbackUrl,
    );

    if (chapaResponse.status !== 'success') {
      throw new Error('Failed to initialize Chapa payment');
    }

    // Store payment in DB
    await this.prisma.payment.create({
      data: {
        orderId,
        userId,
        txRef: tx_ref,
        amount,
        status: 'PENDING',
      },
    });

    return chapaResponse.data.checkout_url;
  }
}
