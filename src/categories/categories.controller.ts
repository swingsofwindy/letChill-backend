import { Role } from '@prisma/client';

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

import RoleGuard from 'src/auth/guard/role.guard';

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    // @Get()
    // getAll(
    //     @Query() paginationParams: PaginationParamsDto,
    //     @Query('name') name?: string,
    // ) {
    //     return this.categoriesService.getAll(paginationParams, name);
    // }

    @Get()
    getAll() {
        return this.categoriesService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.getById(id);
    }

    @UseGuards(RoleGuard([Role.OWNER]))
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @UseGuards(RoleGuard([Role.OWNER]))
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() category: UpdateCategoryDto,
    ) {
        return this.categoriesService.update(id, category);
    }

    @Delete(':id')
    @UseGuards(RoleGuard([Role.OWNER]))
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.categoriesService.delete(id);
    }
}
