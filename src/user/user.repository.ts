import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Avatar, User } from '@prisma/client';
import { checkPrecision } from 'src/common/helpers/checkPrecision';
import { DatabaseService } from 'src/database/database.service';
import { TransferDto } from 'src/dto/transfer.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class UsersRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async transfer(query: TransferDto) {
        if (!checkPrecision(query.amount, 2))
            throw new BadRequestException(
                'maximum 2 numbers after decimal point is allowed',
            );

        const from = Number(query.from);
        const to = Number(query.to);
        const amount = Number(query.amount);

        return this.databaseService.$transaction(async (tx) => {
            const sender = await tx.user.update({
                where: {
                    id: from,
                },
                data: {
                    balance: {
                        decrement: amount,
                    },
                },
            });

            if (Number(sender.balance) < 0) {
                throw new ForbiddenException(
                    'insufficient funds for transaction',
                );
            }

            const recipient = await tx.user.update({
                where: {
                    id: to,
                },
                data: {
                    balance: {
                        increment: amount,
                    },
                },
            });

            return recipient;
        });
    }

    async softDeleteThisUserAvatar(
        userId: number,
        uuid: string,
    ): Promise<Avatar> {
        return await this.databaseService.avatar.update({
            where: {
                uuid,
                userId,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async checkAvatarLimit(userId: number): Promise<boolean> {
        const avatarAmount = await this.databaseService.avatar.count({
            where: { userId, deletedAt: null },
        });
        return new Promise((resolve, reject) => {
            if (avatarAmount)
                avatarAmount >= 5 ? resolve(true) : resolve(false);
            else
                reject(
                    new BadRequestException(
                        'something went wrong while counting user avatars amount',
                    ),
                );
        });
    }

    async createUserAvatar(userId: number, uuid: string): Promise<Avatar> {
        return await this.databaseService.avatar.create({
            data: {
                uuid,
                user: {
                    connect: { id: userId },
                },
            },
        });
    }

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
