import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import { PrismaError } from 'src/database/prisma-error.enum';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly prismaService: PrismaService) {}

    getAll() {
        return this.prismaService.profile.findMany({
            orderBy: {
                updateAt: 'desc',
            },
        });
    }

    async getById(id: number) {
        const profile = await this.prismaService.profile.findUnique({
            where: {
                id,
            },
        });
        if (!profile) {
            throw new NotFoundException();
        }
        return profile;
    }

    async create(profile: CreateProfileDto) {
        try {
            // return await this.prismaService.profile.create({
            //     data: {
            //         name: profile.name,
            //         address: profile.address,
            //         birthDay: profile.birthDay,
            //         gender: profile.gender,
            //         idNumber: profile.idNumber,
            //         phone: profile.phone,
            //         salary: profile.salary,
            //         startDate: profile.startDate
            //     },
            // });
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, profile: UpdateProfileDto) {
        try {
            // return await this.prismaService.profile.update({
            //     data: {
            //         name: profile.name,
            //         address: profile.address,
            //         birthDay: profile.birthDay,
            //         gender: profile.gender,
            //         phone: profile.phone,
            //         salary: profile.salary,
            //     },
            //     where: {
            //         id,
            //     },
            // });
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
            return await this.prismaService.profile.delete({
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
