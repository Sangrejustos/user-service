import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

export class UserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    login?: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsInt()
    age: number;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber({ maxDecimalPlaces: 2 })
    balance: Decimal;
}
