import { InjectQueue } from '@nestjs/bull';
import { Controller, Post } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('balance')
export class BalanceController {
    constructor(@InjectQueue('balance') private readonly balanceQueue: Queue) {}

    @Post('/reset')
    async resetBalance() {
        await this.balanceQueue.add('reset-balance', { delay: 0 });
        return {
            response: 'balance reset operation added to queue',
        };
    }

    @Post('/thousand')
    async setThousand() {
        await this.balanceQueue.add('set-thousand', { delay: 0 });
    }
}
