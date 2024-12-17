import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Injectable()
export class ReceiptService {
    constructor(private readonly prismaService: PrismaService) {}

    getAll() {
        return this.prismaService.receipt.findMany({
            orderBy: {
                updateAt: 'desc',
            },
            include: {
                storage: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    async getInfo() {
        const [products, suppliers] = await Promise.all([
            this.prismaService.product.findMany({
                select: {
                    id: true,
                    name: true,
                },
            }),
            this.prismaService.supplier.findMany({
                select: {
                    id: true,
                    name: true,
                },
            }),
        ]);

        return {
            products,
            suppliers,
        };
    }

    async getById(id: number) {
        const receipt = await this.prismaService.receipt.findUnique({
            where: {
                id,
            },
            include: {
                storage: {
                    select: {
                        name: true,
                    },
                },
                consignment: {
                    include: {
                        product: {
                            select: {
                                name: true,
                            },
                        },
                        supplier: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!receipt) {
            throw new NotFoundException();
        }

        const consignment = receipt.consignment.map((consignment) => {
            return {
                id: consignment.id,
                supplier: consignment.supplier.name,
                product: consignment.product.name,
                quantity: consignment.quantity,
                price: consignment.price,
                expired: consignment.expired,
            };
        });

        return {
            ...receipt,
            storage: receipt.storage.name,
            consignment,
        };
    }

    async create(receipt: CreateReceiptDto) {
        try {
            const result = await this.prismaService.receipt.create({
                data: {
                    total: receipt.total,
                    totalPrice: receipt.totalPrice,
                    storageId: receipt.storageId,
                },
            });

            const consignments =
                await this.prismaService.consignment.createManyAndReturn({
                    data: receipt.data.map((item) => ({
                        supplierId: item.supplierId,
                        productId: item.productId,
                        receiptId: result.id,
                        quantity: item.quantity,
                        price: item.price,
                        expired: item.expired,
                    })),
                });

            return this.prismaService.archive.createMany({
                data: consignments.map((consignment) => ({
                    consignmentId: consignment.id,
                    storageId: receipt.storageId,
                    quantity: consignment.quantity,
                })),
            });
        } catch (error) {
            throw error;
        }
    }
}
