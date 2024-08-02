import * as AWS from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';

import { S3Lib } from './constants/do-spaces-service-lib.constant';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [
        S3Service,
        {
            provide: S3Lib,
            useFactory: async (config: ConfigService) => {
                // TODO: укажи только accessKeyId, secretAccessKey
                return new AWS.S3({
                    endpoint: config.get<string>('MINIO_ENDPOINT'),
                    region: 'ru-central1',
                    credentials: {
                        accessKeyId: config.get<string>(
                            'MINIO_ACCESS_KEY',
                        ) as string,
                        secretAccessKey: config.get<string>(
                            'MINIO_SECRET_KEY',
                        ) as string,
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: [S3Service, S3Lib],
})
export class S3Module {}
