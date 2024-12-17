import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateExportPriceDto } from './dto/update-price.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class StorageService {
    constructor(private readonly prismaService: PrismaService) {}

    getAll() {
        return this.prismaService.storage.findMany({
            orderBy: {
                updateAt: 'desc',
            },
        });
    }

    async getById(id: number) {
        const storage = await this.prismaService.storage.findUnique({
            where: {
                id,
            },
            include: {
                archive: {
                    select: {
                        id: true,
                        quantity: true,
                        consignment: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        price: true,
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
                },
            },
        });

        const archive = storage.archive.map(({ consignment, id, quantity }) => {
            return {
                barcode: id,
                supplier: consignment.supplier.name,
                product: consignment.product,
                quantity: quantity,
                expired: consignment.expired,
                importPrice: consignment.price,
            };
        });

        if (!storage) {
            throw new NotFoundException();
        }
        return {
            ...storage,
            archive,
        };
    }

    async create(storage: CreateStorageDto) {
        try {
            return this.prismaService.storage.create({
                data: {
                    name: storage.name,
                    location: storage.location,
                    total: storage.total,
                    type: storage.type,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, storage: UpdateStorageDto) {
        try {
            return this.prismaService.storage.update({
                data: {
                    name: storage.name,
                    location: storage.location,
                    total: storage.total,
                    type: storage.type,
                },
                where: {
                    id,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number) {
        try {
            return this.prismaService.storage.delete({
                where: {
                    id,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async exportPrice(product: UpdateExportPriceDto) {
        try {
            return this.prismaService.product.update({
                data: {
                    price: product.price,
                },
                where: {
                    id: product.productId,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
