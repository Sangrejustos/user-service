import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserCredentialsDto } from 'src/dto/userCredentials.dto';
import { comparePassword } from 'src/common/helpers/comparePasswords.helpers';

@Injectable()
export class AuthService {

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) { };

	async login(userCreds: UserCredentialsDto) {
		const user = await this.validateUser(userCreds);
		return this.generateToken(user);
	};

	private async validateUser(userCreds: UserCredentialsDto) {
		const user = await this.userService.getByEmail(userCreds.email);

		if (!user) {
			throw new UnauthorizedException('No user with such email was found')
		}

		if (!await comparePassword(userCreds.password, user.password)) {
			throw new UnauthorizedException('Wrong password')
		}

		return user;
	}

	async registrate(userDto: UserDto) {
		const existingUser = await this.userService.getByEmail(userDto.email);
		if (existingUser) {
			throw new HttpException('user with such email already exists', HttpStatus.BAD_REQUEST);
		}
		const hashedPassword = await bcrypt.hash(userDto.password, 5);
		const user = await this.userService.createUser({
			...userDto, password: hashedPassword
		});
		return this.generateToken(user);
	};

	private async generateToken(user: User) {
		const payload = { email: user.email, id: user.id };

		return {
			token: this.jwtService.sign(payload)
		}
	}
}
