import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface ChapaResponse {
  status: string;
  data: {
    tx_ref: string;
    checkout_url: string;
  };
}

interface ChapaPaymentResponse {
  tx_ref: string;
  checkout_url: string;
  status: string;
}

@Injectable()
export class ChapaService {
  private readonly baseUrl = 'https://api.chapa.co/v1';

  async initiatePayment(data: {
    amount: number;
    email: string;
    orderId: string;
  }): Promise<ChapaPaymentResponse> {
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      throw new Error('Invalid email format');
    }

    try {
      const response = await axios.post<ChapaResponse>(
        `${this.baseUrl}/transaction/initialize`,
        {
          amount: data.amount,
          currency: 'ETB',
          email: data.email,
          tx_ref: `order_${data.orderId}_${Date.now()}`,
          order_id: data.orderId,
          callback_url: `${process.env.APP_URL}/payments/verify`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          },
        },
      );

      return {
        tx_ref: response.data.data.tx_ref,
        checkout_url: response.data.data.checkout_url,
        status: response.data.status,
      };
    } catch (error: any) {
      console.error(
        'Chapa Init Payment Error:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to initiate Chapa payment.');
    }
  }

  async verifyWebhook(payload: any): Promise<boolean> {
    try {
      const response = await axios.get<ChapaResponse>(
        `${this.baseUrl}/transaction/verify/${payload.tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          },
        },
      );

      return response.data.status === 'success';
    } catch (error: any) {
      console.error(
        'Chapa Webhook Verification Error:',
        error.response?.data || error.message,
      );
      return false;
    }
  }
}
