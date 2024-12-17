import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SaleService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAll() {
        const bills = await this.prismaService.bill.findMany({
            orderBy: {
                updateAt: 'desc',
            },
            include: {
                employee: {
                    select: {
                        name: true,
                    },
                },
                customer: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return bills.map((bill) => ({
            id: bill.id,
            status: bill.status,
            employee: bill.employee.name,
            customer: bill.customer?.name || 'Walk-in customer',
            paymentMethod: bill.paymentMethod,
            total: bill.total,
            date: bill.updateAt,
        }));
    }

    async getInfo() {
        const archive = await this.prismaService.archive.findMany({
            where: {
                consignment: {
                    product: {
                        price: {
                            not: null,
                        },
                    },
                },
                quantity: {
                    gt: 0,
                },
            },
            select: {
                id: true,
                quantity: true,
                consignment: {
                    select: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                            },
                        },
                    },
                },
                discount: {
                    select: {
                        value: true,
                    },
                },
            },
        });

        return archive.map((item) => ({
            barcode: item.id,
            quantity: item.quantity,
            product: item.consignment.product.name,
            price: item.consignment.product.price - (item.discount?.value || 0),
        }));
    }

    async getById(id: number) {
        const bill = await this.prismaService.bill.findUnique({
            where: {
                id,
            },
            include: {
                employee: {
                    select: {
                        name: true,
                    },
                },
                customer: {
                    select: {
                        name: true,
                    },
                },
                billDetail: {
                    include: {
                        archive: {
                            select: {
                                id: true,
                                consignment: {
                                    select: {
                                        product: {
                                            select: {
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

        if (!bill) {
            throw new NotFoundException();
        }

        const billDetail = bill.billDetail.map((detail) => ({
            barcode: detail.archive.id,
            product: detail.archive.consignment.product.name,
            quantity: detail.quantity,
            price: detail.price,
        }));

        return {
            id: bill.id,
            employee: bill.employee.name,
            customer: bill.customer?.name || 'Walk-in customer',
            paymentMethod: bill.paymentMethod,
            status: bill.status,
            total: bill.total,
            date: bill.updateAt,
            details: billDetail,
        };
    }

    async create(bill: CreateSaleDto) {
        try {
            return this.prismaService.$transaction(async (tx) => {
                let totalPrice = 0;
                const billCreated = await tx.bill.create({
                    data: {
                        employeeId: bill.employeeId,
                        customerId: bill.customerId,
                        paymentMethod: bill.paymentMethod,
                        total: 0,
                    },
                });

                for (const detail of bill.data) {
                    const archive = await tx.archive.findUnique({
                        where: {
                            id: detail.barcode,
                            quantity: {
                                gte: detail.quantity,
                            },
                        },
                        select: {
                            id: true,
                            consignment: {
                                select: {
                                    product: {
                                        select: {
                                            price: true,
                                        },
                                    },
                                },
                            },
                            discount: {
                                select: {
                                    value: true,
                                },
                            },
                        },
                    });

                    if (!archive) {
                        throw new BadRequestException(
                            "Product's quantity is not enough",
                        );
                    }

                    let total =
                        archive.consignment.product.price * detail.quantity;

                    if (archive.discount) {
                        total -= archive.discount.value * detail.quantity;
                    }

                    totalPrice += total;

                    await tx.billDetail.create({
                        data: {
                            billId: billCreated.id,
                            archiveId: archive.id,
                            quantity: detail.quantity,
                            price: total,
                        },
                    });

                    await tx.archive.update({
                        where: {
                            id: archive.id,
                        },
                        data: {
                            quantity: {
                                decrement: detail.quantity,
                            },
                        },
                    });
                }

                const result = await tx.bill.update({
                    where: {
                        id: billCreated.id,
                    },
                    data: {
                        total: totalPrice,
                    },
                });

                return result;
            });
        } catch (error) {
            throw error;
        }
    }

    async payment(payment: CreatePaymentDto) {
        try {
            const bill = await this.prismaService.bill.findUnique({
                where: {
                    id: payment.billId,
                },
            });

            if (!bill) {
                throw new NotFoundException();
            }

            if (bill.total > payment.paid) {
                throw new BadRequestException('Not enough money');
            }

            const change = payment.paid - bill.total;

            return this.prismaService.bill.update({
                where: {
                    id: payment.billId,
                },
                data: {
                    paymentMethod: payment.paymentMethod,
                    paid: payment.paid,
                    change,
                    status: 'SUCCESS',
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async cancel(billId: number) {
        try {
            return this.prismaService.$transaction(async (tx) => {
                const bill = await tx.bill.findUnique({
                    where: {
                        id: billId,
                    },
                    include: {
                        billDetail: {
                            include: {
                                archive: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                });

                if (!bill) {
                    throw new NotFoundException();
                }

                if (bill.status === 'SUCCESS') {
                    throw new BadRequestException(
                        'Cannot cancel a successful bill',
                    );
                }

                for (const detail of bill.billDetail) {
                    await tx.archive.update({
                        where: {
                            id: detail.archive.id,
                        },
                        data: {
                            quantity: {
                                increment: detail.quantity,
                            },
                        },
                    });
                }

                return tx.bill.update({
                    where: {
                        id: billId,
                    },
                    data: {
                        status: 'CANCEL',
                    },
                });
            });
        } catch (error) {
            throw error;
        }
    }
}
