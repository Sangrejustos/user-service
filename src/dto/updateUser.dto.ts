import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
	@ApiProperty()
	@IsEmail()
	email?: string;

	@ApiProperty()
	login?: string;

	@ApiProperty()
	@IsNotEmpty()
	password?: string;

	@ApiProperty()
	@IsInt()
	age?: number;

	@ApiProperty()
	@IsString()
	description?: string;
}