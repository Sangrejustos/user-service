import { Process, Processor } from '@nestjs/bull';
import { DatabaseService } from 'src/database/database.service';

@Processor('balance')
export class BalanceProcessor {
    constructor(private readonly databaseService: DatabaseService) {}

    @Process('reset-balance')
    async handleBalanceReset() {
        await this.databaseService.user.updateMany({
            data: { balance: 0 },
        });
    }
}
