import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
    constructor(private readonly prismaService: PrismaService) {}

    getAll() {
        return this.prismaService.supplier.findMany({
            orderBy: {
                updateAt: 'desc',
            },
        });
    }

    async getById(id: number) {
        const supplier = await this.prismaService.supplier.findUnique({
            where: {
                id,
            },
        });
        if (!supplier) {
            throw new NotFoundException();
        }
        return supplier;
    }

    async create(supplier: CreateSupplierDto) {
        try {
            return await this.prismaService.supplier.create({
                data: {
                    name: supplier.name,
                    address: supplier.address,
                    phoneNumber: supplier.address,
                    email: supplier.email,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, supplier: UpdateSupplierDto) {
        try {
            return await this.prismaService.supplier.update({
                data: {
                    name: supplier.name,
                    address: supplier.address,
                    phoneNumber: supplier.address,
                    email: supplier.email,
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
            return await this.prismaService.supplier.delete({
                where: {
                    id,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
