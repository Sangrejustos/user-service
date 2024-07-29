import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UserModule),
        JwtModule.register({
            global: false,
            secret: process.env.SECRET,
            signOptions: { expiresIn: '24h' },
        }),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
