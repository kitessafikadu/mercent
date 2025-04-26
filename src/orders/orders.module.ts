import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { ChapaService } from 'src/payments/chapa/chapa.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, ChapaService],
  exports: [OrdersModule, OrdersService],
})
export class OrdersModule {}
