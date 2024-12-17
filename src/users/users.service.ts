import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/database/database.service';

import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaError } from 'src/database/prisma-error.enum';
import { CreateUserDto } from './dto/create-user.dto';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async getByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    async getById(id: number) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const user = await this.getById(userId);

        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );

        if (isRefreshTokenMatching) {
            return user;
        }
    }

    private handlePrismaError(error: any) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error?.code === PrismaError.UniqueConstraintFailed
        ) {
            throw new ConflictException('User with that email already exists');
        }

        throw error;
    }

    async create(user: CreateUserDto) {
        try {
            return await this.prismaService.user.create({
                data: {
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    profile: {
                        create: user.profile,
                    },
                },
                include: {
                    profile: true,
                },
            });
        } catch (err) {
            this.handlePrismaError(err);
        }
    }

    async update(user: UpdateUserDto) {
        try {
            return await this.prismaService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    refreshToken: user.refreshToken,
                    profile: {
                        update: user.profile,
                    },
                },
            });
        } catch (err) {
            this.handlePrismaError(err);
        }
    }
}
