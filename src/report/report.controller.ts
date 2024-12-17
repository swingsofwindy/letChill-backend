import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { GetRevenuesDto } from './dto/get-revenues.dto';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get()
    async getRevenues(@Query() query: GetRevenuesDto) {
        const { from, to } = query;

        if (from && to && new Date(from) > new Date(to)) {
            throw new BadRequestException(
                'The "from" date cannot be after the "to" date.',
            );
        }

        return this.reportService.getRevenues(from, to);
    }
}
