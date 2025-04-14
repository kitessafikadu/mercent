import { PartialType } from '@nestjs/swagger';
import { CheckoutDto } from './checkout.dto';

export class UpdateCheckoutDto extends PartialType(CheckoutDto) {}
