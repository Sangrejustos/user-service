import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceProcessor } from './balance.processor';
import { BullModule } from '@nestjs/bull';
import { DatabaseModule } from 'src/database/database.module';
import { BalanceThousandProcessor } from './balanceThousand.proccessor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'balance',
        }),
        DatabaseModule,
    ],
    controllers: [BalanceController],
    providers: [BalanceProcessor, BalanceThousandProcessor],
})
export class BalanceModule {}
