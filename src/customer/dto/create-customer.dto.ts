import { IsDate, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber("VN")
    phoneNumber: string
}
