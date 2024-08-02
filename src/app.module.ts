import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FilesModule } from './providers/files/files.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '../.env',
        }),
        DatabaseModule,
        AuthModule,
        UserModule,
        FilesModule,
    ],
})
export class AppModule {}
