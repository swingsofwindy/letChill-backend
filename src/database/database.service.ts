import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor(private readonly loggerService: LoggerService) {
        super({
            log: ['error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.loggerService.debug('Database connected');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.loggerService.debug('Database disconnected');
    }
}
