import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    MinLength,
    ValidateNested,
} from 'class-validator';

import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    @IsOptional()
    role: Role;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateProfileDto)
    @IsObject()
    profile?: CreateProfileDto;
}
