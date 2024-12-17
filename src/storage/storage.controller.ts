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
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateExportPriceDto } from './dto/update-price.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { StorageService } from './storage.service';

@Controller('storages')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Get()
    getAll() {
        return this.storageService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.storageService.getById(id);
    }

    @UseGuards(RoleGuard([Role.OWNER, Role.MANAGER]))
    @Post()
    create(@Body() createStorageDto: CreateStorageDto) {
        return this.storageService.create(createStorageDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() storage: UpdateStorageDto,
    ) {
        return this.storageService.update(id, storage);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.storageService.delete(id);
    }

    @Post('export-price')
    exportPrice(@Body() product: UpdateExportPriceDto) {
        return this.storageService.exportPrice(product);
    }
}
