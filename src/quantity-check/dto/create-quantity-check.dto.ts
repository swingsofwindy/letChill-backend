import { Decision } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from 'class-validator';

export class CreateQuantityCheckDto {
    @IsNumber()
    @IsNotEmpty()
    employeeId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuantityCheckDetailDto)
    data: CreateQuantityCheckDetailDto[];
}

export class CreateQuantityCheckDetailDto {
    @IsNumber()
    @IsNotEmpty()
    barcode: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsEnum(Decision)
    decision: Decision;
}
