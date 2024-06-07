import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

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
}