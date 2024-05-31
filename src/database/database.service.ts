import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
	async onModuleInit() {
		this.$connect();
	}

	async onModuleDestroy() {
		this.$disconnect();
	}

	async enableShutdownHooks(app: INestApplication) {
		process.on('beforeExit', async () => {
			await app.close();
		})
	}
}
