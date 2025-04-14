import { PartialType } from '@nestjs/swagger';
import { CreateCheckoutDto } from './checkout.dto';

export class UpdateCheckoutDto extends PartialType(CreateCheckoutDto) {}
