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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    getAll() {
        return this.productService.getAll();
    }

    @Get('info')
    getInfo() {
        return this.productService.getInfo();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.getById(id);
    }

    @UseGuards(RoleGuard([Role.OWNER, Role.MANAGER]))
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @UseGuards(RoleGuard([Role.OWNER, Role.MANAGER]))
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto,
    ) {
        return this.productService.update(id, product);
    }

    @Delete(':id')
    @UseGuards(RoleGuard([Role.OWNER, Role.MANAGER]))
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.productService.delete(id);
    }
}
