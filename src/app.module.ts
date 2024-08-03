import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FilesModule } from './providers/files/files.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '../.env',
        }),
        CacheModule.registerAsync<RedisClientOptions>({
            isGlobal: true,
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                store: await redisStore({
                    ttl: 30000,
                    socket: {
                        host: config.get<string>('REDIS_HOST'),
                        port: parseInt(
                            config.get<string>('REDIS_PORT') || '6379',
                        ),
                    },
                    password: config.get<string>('REDIS_PASSWORD'),
                }),
            }),
        }),
        DatabaseModule,
        AuthModule,
        UserModule,
        FilesModule,
    ],
})
export class AppModule {}
