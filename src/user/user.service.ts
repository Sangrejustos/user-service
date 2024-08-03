import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { UserDto } from 'src/dto/user.dto';
import { UsersPaginated } from 'src/dto/usersPaginated.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DecodedTokenDto } from 'src/dto/decodedToken.dto';
import { UsersRepository } from './user.repository';
import { DescriptionEntity } from './entities/description.entity';
import { IFileService } from 'src/providers/files/files.adapter';
import { IUploadedMulterFile } from 'src/providers/files/s3/interfaces/upload-file.interface';

@Injectable()
export class UserService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
        private readonly filesService: IFileService,
    ) {}

    async getThisUserDescription(
        authorization: string,
    ): Promise<DescriptionEntity> {
        const [bearer, token] = authorization.split(' ');
        if (bearer !== 'Bearer')
            throw new BadRequestException('bad authorization header');
        if (!token) throw new BadRequestException('no token was provided');

        const decodedToken: DecodedTokenDto =
            await this.jwtService.decode(token);

        const user = await this.usersRepository.findUserByEmailOrId(
            decodedToken.id,
        );

        if (user) return { description: user.description };
        else throw new NotFoundException('user not found');
    }

    async uploadThisUserAvatar(
        authorization: string,
        file: IUploadedMulterFile,
    ) {
        const [, token] = authorization.split(' ');
        const decodedToken: DecodedTokenDto =
            await this.jwtService.decode(token);
        const userId = decodedToken.id;

        const isAvatarLimitExceeded =
            await this.usersRepository.checkAvatarLimit(userId);
        if (isAvatarLimitExceeded)
            throw new UnprocessableEntityException('avatar limit was exceeded');

        //to MinIO
        const fileUuid = uuidv4();
        const result = await this.filesService.uploadFile({
            file,
            folder: '/users',
            name: fileUuid,
        });
        if (result instanceof Error) throw result;

        const avatar = await this.usersRepository.createUserAvatar(
            userId,
            fileUuid,
        );

        return {
            avatar,
            result,
        };
    }

    async softDeleteThisUserAvatar(authorization: string, uuid: string) {
        const [, token] = authorization.split(' ');
        const decodedToken: DecodedTokenDto =
            await this.jwtService.decode(token);
        const userId = decodedToken.id;

        return await this.usersRepository.softDeleteThisUserAvatar(
            userId,
            uuid,
        );
    }

    async updateUserById(
        id: number,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        if (updateUserDto.email) {
            const isEmailExisting =
                await this.usersRepository.findUserByEmailOrId(
                    updateUserDto.email,
                );
            if (isEmailExisting && isEmailExisting.id !== id)
                throw new BadRequestException(
                    'user with such email already exists',
                );
        }

        if (updateUserDto.password) {
            const hashedPassword = await bcrypt.hash(updateUserDto.password, 5);
            updateUserDto = { ...updateUserDto, password: hashedPassword };
        }

        const updatedUser = await this.usersRepository.updateUser(
            id,
            updateUserDto,
        );
        return updatedUser;
    }

    async deleteUserById(idString: string): Promise<User> {
        const id = Number(idString);

        try {
            const deletedUser = this.usersRepository.deleteUserById(id);
            return deletedUser;
        } catch (e) {
            throw new BadRequestException('user with such id not found');
        }
    }

    async createUser(dto: UserDto): Promise<User> {
        return await this.usersRepository.createUser(dto);
    }

    async getByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findUserByEmailOrId(email);
    }

    async getAllUsers(query: PaginationDto): Promise<UsersPaginated> {
        const page = Number(query.page);
        const perPage = Number(query.perPage);

        if (!page || !perPage)
            throw new BadRequestException(
                'page and perPage queryParams should be provided and not be equal to zero',
            );

        const userAmount = await this.usersRepository.countUsers(query.email);

        if (userAmount === 0)
            throw new NotFoundException(
                'no users were found by these parameters',
            );

        const pagesAmount = Math.ceil(userAmount / perPage);

        if (page > pagesAmount)
            throw new BadRequestException(
                `page amount (${pagesAmount}) was exceeded`,
            );

        const skip = (page - 1) * perPage;
        const users = await this.usersRepository.findAllUsersPaginated(
            skip,
            perPage,
            query.email,
        );

        return {
            users,
            page,
            pagesAmount,
        };
    }
}
