import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Headers } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Post('create')
	async create(@Body() dto: UserDto) {
		return await this.userService.createUser(dto);
	}

	@Get('')
	@UseGuards(AuthGuard)
	async getAll(@Query() query: PaginationDto) {
		return await this.userService.getAllUsers(query);
	}

	@Patch(':id')
	async update(@Param('id') idString: string, @Body() updateUserDto: UpdateUserDto) {
		return await this.userService.updateUserById(idString, updateUserDto);
	}

	@Delete(':id')
	async delete(@Param('id') idString: string) {
		return await this.userService.deleteUserById(idString);
	}

	@Get('description')
	@UseGuards(AuthGuard)
	async getUserDescription(@Headers('authorization') authorization: string) {
		return await this.userService.getThisUserDescription(authorization);
	}

}
