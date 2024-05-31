import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { IUserCredentials } from 'src/interface/user.credentials';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService) { };

	@Post('login')
	login(@Body() userCreds: IUserCredentials) {
		return this.authService.login(userCreds);
	};

	@Post('registration')
	registrate(@Body() userDto: UserDto) {
		return this.authService.registrate(userDto);
	};
}
