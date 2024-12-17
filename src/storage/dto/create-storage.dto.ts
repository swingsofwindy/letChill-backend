import { Type } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateStorageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNotEmpty()
    @IsNumber()
    total: number;

    @IsNotEmpty()
    @IsEnum(Type)
    type: Type;
}
