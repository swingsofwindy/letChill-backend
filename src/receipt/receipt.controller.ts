import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { ReceiptService } from './receipt.service';

@Controller('receipt')
export class ReceiptController {
    constructor(private readonly receiptService: ReceiptService) {}

    @Get()
    getAll() {
        return this.receiptService.getAll();
    }

    @Get('info')
    getInfo() {
        return this.receiptService.getInfo();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.receiptService.getById(id);
    }

    @Post()
    create(@Body() createReceiptDto: CreateReceiptDto) {
        return this.receiptService.create(createReceiptDto);
    }
}
