import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(private readonly prismaService: PrismaService) {}

    getAll() {
        return this.prismaService.customer.findMany({
            orderBy: {
                updateAt: 'desc',
            },
        });
    }

    async findByPhoneNumber(phoneNumber: string) {
        const customer = await this.prismaService.customer.findFirst({
            where: {
                phoneNumber,
            },
        });
        if (!customer) {
            throw new NotFoundException();
        }
        return customer;
    }

    async create(customer: CreateCustomerDto) {
        try {
            return await this.prismaService.customer.create({
                data: {
                    name: customer.name,
                    phoneNumber: customer.phoneNumber,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, customer: UpdateCustomerDto) {
        try {
            return await this.prismaService.customer.update({
                data: {
                    name: customer.name,
                    phoneNumber: customer.phoneNumber,
                    point: customer.point,
                },
                where: {
                    id,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
