import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateExportPriceDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    exportPrice: number;
}
