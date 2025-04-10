import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class InitializePaymentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
