import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class UserEntity implements User {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    login: string | null;

    @ApiProperty()
    password: string;

    @ApiProperty()
    age: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    balance: Decimal;
}
