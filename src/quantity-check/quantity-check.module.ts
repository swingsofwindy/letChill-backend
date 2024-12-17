import { Module } from '@nestjs/common';
import { QuantityCheckService } from './quantity-check.service';
import { QuantityCheckController } from './quantity-check.controller';

@Module({
  controllers: [QuantityCheckController],
  providers: [QuantityCheckService],
})
export class QuantityCheckModule {}
