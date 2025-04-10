import { Injectable } from '@nestjs/common';
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
}
