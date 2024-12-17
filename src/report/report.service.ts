import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class ReportService {
    constructor(private readonly prismaService: PrismaService) {}

    async getRevenues(from: Date, to?: Date) {
        // return this.prismaService.bill.aggregate({
        //     _sum: {
        //         total: true,
        //     },
        //     where: {
        //         status: 'SUCCESS',
        //     },
        // });
    }
}
