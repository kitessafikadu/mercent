import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { ChapaService } from './chapa/chapa.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [ChapaService],
  exports: [ChapaService],
})
export class PaymentsModule {}
