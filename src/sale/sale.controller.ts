import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleService } from './sale.service';

@Controller('sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

    @Get()
    getAll() {
        return this.saleService.getAll();
    }

    @Get('info')
    getInfo() {
        return this.saleService.getInfo();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.saleService.getById(id);
    }

    @Post()
    create(@Body() createSaleDto: CreateSaleDto) {
        return this.saleService.create(createSaleDto);
    }

    @Post('payment')
    payment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.saleService.payment(createPaymentDto);
    }

    @Post('cancel')
    cancel(@Body('id', ParseIntPipe) id: number) {
        return this.saleService.cancel(id);
    }
}
