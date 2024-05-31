import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { UserDto } from 'src/dto/user.dto';
import { UsersPaginated } from 'src/dto/usersPaginated.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DecodedTokenDto } from 'src/dto/decodedToken.dto';

@Injectable()
export class UserService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly jwtService: JwtService
	) { }

	async getThisUserDescription(authorization: string): Promise<User['description']> {

		const [bearer, token] = authorization.split(' ');
		if (bearer !== 'Bearer') throw new BadRequestException('bad authorization header');
		if (!token) throw new BadRequestException('no token was provided');

		const decodedToken: DecodedTokenDto = await this.jwtService.decode(token);

		const user = await this.databaseService.user.findFirst({
			where: {
				id: decodedToken.id
			}
		})

		if (user) return user.description;
		else throw new NotFoundException('user not found');

	}

	async updateUserById(idString: string, updateUserDto: UpdateUserDto): Promise<User> {
		const id = Number(idString);

		if (updateUserDto.email) {
			const isEmailExisting = await this.databaseService.user.findFirst({
				where: {
					email: updateUserDto.email
				}
			})
			if (isEmailExisting && isEmailExisting.id !== id) throw new BadRequestException('user with such email already exists');
		}

		if (updateUserDto.password) {
			const hashedPassword = await bcrypt.hash(updateUserDto.password, 5);
			updateUserDto = { ...updateUserDto, password: hashedPassword }
		}

		const updateUser = await this.databaseService.user.update({
			where: {
				id
			},
			data: updateUserDto,
		})

		return updateUser;
	};

	async deleteUserById(idString: string): Promise<User> {
		const id = Number(idString);

		try {
			const deletedUser = await this.databaseService.user.delete({
				where: {
					id
				}
			})
			return deletedUser;
		} catch (e) {
			throw new BadRequestException('user with such id not found');
		}
	}

	async createUser(dto: UserDto): Promise<User> {
		return await this.databaseService.user.create({
			data: dto,
		})
	};

	async getByEmail(email: string): Promise<User | null> {
		return await this.databaseService.user.findUnique({
			where: {
				email
			}
		})
	};

	async getAllUsers(query: PaginationDto): Promise<UsersPaginated> {
		const page = Number(query.page);
		const perPage = Number(query.perPage);

		if (!page || !perPage) throw new BadRequestException('page and perPage queryParams should be provided');

		const userAmount = await this.databaseService.user.count({
			where: {
				email: {
					contains: query.email,
				}
			}
		});

		if (userAmount === 0) throw new NotFoundException('no users were found by these parameters');

		const pagesAmount = Math.ceil(userAmount / perPage);

		if (page > pagesAmount) throw new BadRequestException(`page amount (${pagesAmount}) was exceeded`);

		const users = await this.databaseService.user.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			where: {
				email: {
					contains: query.email,
				}
			}
		})

		return {
			users,
			page,
			pagesAmount,
		};
	};
}
