import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateSupplierDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
