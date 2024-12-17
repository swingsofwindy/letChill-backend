import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class GetRevenuesDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    from?: Date = new Date();

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    to?: Date;
}
