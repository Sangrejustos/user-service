import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from './user.repository';
import { FilesModule } from 'src/providers/files/files.module';

@Module({
    controllers: [UserController],
    providers: [UserService, UsersRepository],
    imports: [
        DatabaseModule,
        forwardRef(() => AuthModule),
        JwtModule,
        FilesModule,
    ],
    exports: [UserService, UsersRepository],
})
export class UserModule {}
