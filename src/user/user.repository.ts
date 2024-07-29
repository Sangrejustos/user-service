import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class UsersRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async findUserByEmailOrId(email: string): Promise<User | null>;
    async findUserByEmailOrId(id: number): Promise<User | null>;
    async findUserByEmailOrId(
        emailOrId: string | number,
    ): Promise<User | null> {
        if (typeof emailOrId === 'string') {
            return await this.databaseService.user.findUnique({
                where: {
                    email: emailOrId,
                },
            });
        } else
            return await this.databaseService.user.findUnique({
                where: {
                    id: emailOrId,
                },
            });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        return await this.databaseService.user.update({
            where: {
                id,
            },
            data: updateUserDto,
        });
    }

    async deleteUserById(id: number): Promise<User> {
        return await this.databaseService.user.delete({
            where: {
                id,
            },
        });
    }

    async createUser(dto: UserDto): Promise<User> {
        return await this.databaseService.user.create({
            data: dto,
        });
    }

    async countUsers(email: string | undefined): Promise<number> {
        return await this.databaseService.user.count({
            where: {
                email: {
                    contains: email,
                },
            },
        });
    }

    async findAllUsersPaginated(
        skip: number,
        take: number,
        email: string | undefined,
    ) {
        return await this.databaseService.user.findMany({
            skip,
            take,
            where: {
                email: {
                    contains: email,
                },
            },
        });
    }
}
