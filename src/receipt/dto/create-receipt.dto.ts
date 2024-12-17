import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from 'class-validator';

export class CreateReceiptDto {
    @IsNumber()
    total: number;

    @IsNumber()
    totalPrice: number;

    @IsNumber()
    @IsNotEmpty()
    storageId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateReceiptDetailDto)
    data: CreateReceiptDetailDto[];
}

export class CreateReceiptDetailDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsNumber()
    @IsNotEmpty()
    supplierId: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsDate()
    @Type(() => Date)
    expired: Date;
}
