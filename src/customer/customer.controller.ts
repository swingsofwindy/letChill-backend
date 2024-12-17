import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get()
    findByPhoneNumber(@Query('phoneNumber') phoneNumber: string) {
        return this.customerService.findByPhoneNumber(phoneNumber);
    }

    @Get()
    getAll() {
        return this.customerService.getAll();
    }

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customerService.create(createCustomerDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() customer: UpdateCustomerDto,
    ) {
        return this.customerService.update(id, customer);
    }
}
