import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { CreateQuantityCheckDto } from './dto/create-quantity-check.dto';
import { DiscountDto } from './dto/discount.dto';
import { QuantityCheckService } from './quantity-check.service';

@Controller('quantity-check')
export class QuantityCheckController {
    constructor(private readonly quantityCheckService: QuantityCheckService) {}

    @Get()
    getAll() {
        return this.quantityCheckService.getAll();
    }

    @Get('info')
    getInfo() {
        return this.quantityCheckService.getInfo();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.quantityCheckService.getById(id);
    }

    @Post()
    create(@Body() createQuantityCheckDto: CreateQuantityCheckDto) {
        return this.quantityCheckService.create(createQuantityCheckDto);
    }

    @Post('discount')
    discount(@Body() discount: DiscountDto) {
        return this.quantityCheckService.discount(discount);
    }
}
