import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaError } from 'src/database/prisma-error.enum';

import { PrismaService } from 'src/database/database.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prismaService: PrismaService) {}

    // async getAll({ limit, lastItemId }: PaginationParamsDto, name?: string) {
    //     const [categories, total] = await this.prismaService.$transaction([
    //         this.prismaService.category.findMany({
    //             orderBy: { updateAt: 'desc' },
    //             where: {
    //                 name: {
    //                     contains: name,
    //                     mode: 'insensitive',
    //                 },
    //             },
    //             take: limit,
    //             skip: lastItemId ? 1 : 0,
    //             cursor: lastItemId ? { id: lastItemId } : undefined,
    //         }),
    //         this.prismaService.category.count(),
    //     ]);

    //     return {
    //         data: categories,
    //         pagination: {
    //             pageCount: Math.ceil(total / limit),
    //             rowCount: total,
    //             lastItemId: categories.at(-1)?.id || null,
    //         },
    //     };
    // }

    async getAll() {
        return this.prismaService.category.findMany({
            orderBy: {
                updateAt: 'desc',
            },
            select: {
                id: true,
                name: true,
            },
        });
    }

    async getById(id: number) {
        const category = await this.prismaService.category.findUnique({
            where: {
                id,
            },
        });
        if (!category) {
            throw new NotFoundException();
        }
        return category;
    }

    async create(category: CreateCategoryDto) {
        try {
            return await this.prismaService.category.create({
                data: {
                    name: category.name,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, category: UpdateCategoryDto) {
        try {
            return await this.prismaService.category.update({
                data: {
                    name: category.name,
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
            return await this.prismaService.category.delete({
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

            if (error.code === 'P2003') {
                throw new ForbiddenException();
            }
            throw error;
        }
    }
}
