import { IsNumber } from 'class-validator';

export class DiscountDto {
    @IsNumber()
    reportDetailId: number;

    @IsNumber()
    discount: number;
}
