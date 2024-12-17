import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import RoleGuard from 'src/auth/guard/role.guard';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierService } from './supplier.service';

@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) {}

    @Get()
    getAll() {
        return this.supplierService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.supplierService.getById(id);
    }

    @Post()
    @UseGuards(RoleGuard([Role.OWNER]))
    create(@Body() createSupplierDto: CreateSupplierDto) {
        return this.supplierService.create(createSupplierDto);
    }

    @Patch(':id')
    @UseGuards(RoleGuard([Role.OWNER]))
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() supplier: UpdateSupplierDto,
    ) {
        return this.supplierService.update(id, supplier);
    }

    @Delete(':id')
    @UseGuards(RoleGuard([Role.OWNER]))
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.supplierService.delete(id);
    }
}
