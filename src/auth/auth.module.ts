import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => {
                return {
                    global: false,
                    secret: config.get<string>('SECRET'),
                    signOptions: { expiresIn: '24h' },
                };
            },
            inject: [ConfigService],
        }),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
