import { PaymentMethod } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
    @IsNumber()
    billId: number;

    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod = 'CASH';

    @IsNumber()
    paid: number;
}
