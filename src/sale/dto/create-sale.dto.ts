import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator';

export class CreateSaleDto {
    @IsNotEmpty()
    @IsNumber()
    employeeId: number;

    @IsOptional()
    @IsNumber()
    customerId?: number;

    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod = 'CASH';

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleDetailDto)
    data: CreateSaleDetailDto[];
}

export class CreateSaleDetailDto {
    @IsNotEmpty()
    @IsNumber()
    barcode: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
