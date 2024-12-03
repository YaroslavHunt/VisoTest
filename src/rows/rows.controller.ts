import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RowsService } from './rows.service';

@Controller('rows')
export class RowsController {
    constructor(private readonly rowsService: RowsService) {}

    @Post()
    async create(@Body('content') content: string) {
        return this.rowsService.create(content);
    }

    @Get()
    async findAll() {
        return this.rowsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.rowsService.findOne(id);
    }
}
