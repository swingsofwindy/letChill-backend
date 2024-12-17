import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import { PrismaError } from 'src/database/prisma-error.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(private readonly prismaService: PrismaService) {}
    getAll() {
        return this.prismaService.product.findMany({
            orderBy: {
                updateAt: 'desc',
            },
            include: {
                category: true,
            },
        });
    }

    async getInfo() {
        return this.prismaService.category.findMany({
            select: {
                id: true,
                name: true,
            },
        });
    }

    async getById(id: number) {
        const product = await this.prismaService.product.findUnique({
            where: {
                id,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!product) {
            throw new NotFoundException();
        }
        return product;
    }

    async create(product: CreateProductDto) {
        try {
            return await this.prismaService.product.create({
                data: {
                    name: product.name,
                    description: product.description,
                    categoryId: product.categoryId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, product: UpdateProductDto) {
        try {
            return await this.prismaService.product.update({
                data: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    categoryId: product.categoryId,
                    imageUrl: product.imageUrl,
                },
                where: {
                    id,
                },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === PrismaError.RecordDoesNotExist
            ) {
                throw new NotFoundException();
            }
            throw error;
        }
    }

    async delete(id: number) {
        try {
            return await this.prismaService.product.delete({
                where: {
                    id,
                },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === PrismaError.RecordDoesNotExist
            ) {
                throw new NotFoundException();
            }
            throw error;
        }
    }
}
