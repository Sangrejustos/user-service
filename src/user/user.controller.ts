import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    Headers,
    UseInterceptors,
    UploadedFile,
    UsePipes,
} from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { DescriptionEntity } from './entities/description.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUploadedMulterFile } from 'src/providers/files/s3/interfaces/upload-file.interface';
import { UploadFileValidationPipe } from 'src/pipes/upload-file.pipe';
import { TransferDto } from 'src/dto/transfer.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('create')
    @ApiCreatedResponse({ type: UserEntity })
    async create(@Body() dto: UserDto) {
        return await this.userService.createUser(dto);
    }

    @Get('')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: UserEntity, isArray: true })
    async getAll(@Query() query: PaginationDto) {
        return await this.userService.getAllUsers(query);
    }

    @Patch('/update-user/:id')
    @ApiOkResponse({ type: UserEntity })
    async update(
        @Param('id') idString: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.userService.updateUserById(
            Number(idString),
            updateUserDto,
        );
    }

    @Delete('/delete-user/:id')
    @ApiOkResponse({ type: UserEntity })
    async delete(@Param('id') idString: string) {
        return await this.userService.deleteUserById(idString);
    }

    @Get('description')
    @ApiResponse({
        status: 200,
        description: 'the found description',
        type: DescriptionEntity,
    })
    @UseGuards(AuthGuard)
    async getUserDescription(@Headers('authorization') authorization: string) {
        return await this.userService.getThisUserDescription(authorization);
    }

    @UseGuards(AuthGuard)
    @Post('/upload-avatar')
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(new UploadFileValidationPipe())
    async uploadUserAvatar(
        @Headers('authorization') authorization: string,
        @UploadedFile() file: IUploadedMulterFile,
    ) {
        return await this.userService.uploadThisUserAvatar(authorization, file);
    }

    @UseGuards(AuthGuard)
    @Delete('/soft-delete-avatar/:uuid')
    async softDeleteUserAvatar(
        @Headers('authorization') authorization: string,
        @Param('uuid') uuid: string,
    ) {
        return await this.userService.softDeleteThisUserAvatar(
            authorization,
            uuid,
        );
    }

    @Patch('/transfer')
    async transfer(@Query() query: TransferDto) {
        return await this.userService.transfer(query);
    }
}
