import {
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsPhoneNumber('VN')
    phone: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    imageUrl?: string;
}
