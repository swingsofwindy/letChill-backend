import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateExportPriceDto {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}
