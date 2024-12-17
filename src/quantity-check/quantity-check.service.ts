import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreateQuantityCheckDto } from './dto/create-quantity-check.dto';
import { DiscountDto } from './dto/discount.dto';

@Injectable()
export class QuantityCheckService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAll() {
        const reports = await this.prismaService.report.findMany({
            orderBy: {
                updateAt: 'desc',
            },
            where: {
                reportDetail: {
                    some: {},
                },
            },

            select: {
                id: true,
                createAt: true,
                employee: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return reports.map((report) => ({
            id: report.id,
            date: report.createAt,
            employee: report.employee.name,
        }));
    }

    async getInfo() {
        const archives = await this.prismaService.archive.findMany({
            select: {
                id: true,
                quantity: true,
                consignment: {
                    select: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return archives.map(({ id, quantity, consignment }) => ({
            barcode: id,
            product: consignment.product,
            quantity: quantity,
        }));
    }

    async getById(id: number) {
        const report = await this.prismaService.report.findUnique({
            where: {
                id,
            },
            include: {
                employee: {
                    select: {
                        name: true,
                    },
                },
                reportDetail: {
                    select: {
                        id: true,
                        quantity: true,
                        decision: true,
                        discount: {
                            select: {
                                value: true,
                            },
                        },
                        archive: {
                            select: {
                                id: true,
                                consignment: {
                                    select: {
                                        product: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!report) {
            throw new NotFoundException();
        }

        const reportDetails = report.reportDetail.map((detail) => ({
            id: detail.id,
            barcode: detail.archive.id,
            product: detail.archive.consignment.product,
            quantity: detail.quantity,
            decision: detail.decision,
            discount: detail.discount?.value || 0,
        }));

        return {
            id: report.id,
            date: report.createAt,
            employee: report.employee.name,
            reportDetails,
        };
    }

    async create(report: CreateQuantityCheckDto) {
        try {
            return this.prismaService.$transaction(async (tx) => {
                const result = await tx.report.create({
                    data: {
                        employeeId: report.employeeId,
                    },
                });

                for (const detail of report.data) {
                    const archive = await tx.archive.findUnique({
                        where: {
                            id: detail.barcode,
                        },
                        select: {
                            quantity: true,
                        },
                    });

                    if (archive.quantity < detail.quantity) {
                        throw new BadRequestException(
                            `${detail.barcode} is not enough`,
                        );
                    }

                    const reportDetail = await tx.reportDetail.create({
                        data: {
                            reportId: result.id,
                            quantity: detail.quantity,
                            decision: detail.decision,
                            archiveId: detail.barcode,
                        },
                    });

                    if (detail.decision === 'DESTROY') {
                        await tx.archive.update({
                            where: {
                                id: detail.barcode,
                            },
                            data: {
                                quantity: {
                                    decrement: detail.quantity,
                                },
                            },
                        });
                    }

                    if (detail.decision === 'DISCOUNT') {
                        await tx.discount.upsert({
                            where: {
                                archiveId: detail.barcode,
                            },
                            update: {},
                            create: {
                                reportDetailId: reportDetail.id,
                                archiveId: detail.barcode,
                            },
                        });
                    }
                }

                return result;
            });
        } catch (error) {
            throw error;
        }
    }

    async discount(discount: DiscountDto) {
        try {
            if (discount.discount < 0) {
                throw new BadRequestException(
                    'Discount must be greater than 0',
                );
            }

            return this.prismaService.discount.update({
                where: {
                    reportDetailId: discount.reportDetailId,
                },
                data: {
                    value: discount.discount,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
