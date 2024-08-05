import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Processor('balance')
export class BalanceThousandProcessor {
    constructor(private readonly databaseService: DatabaseService) {}

    @Process('set-thousand')
    async handleBalanceReset() {
        Logger.log('21414');

        await this.databaseService.user.updateMany({
            data: { balance: 1000 },
        });

        Logger.log('jopich');
    }
}
