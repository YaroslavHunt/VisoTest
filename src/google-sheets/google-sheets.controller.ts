import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';

@Controller('sheets')
export class GoogleSheetsController {
    constructor(private readonly googleSheetsService: GoogleSheetsService) {}

    @Get('data')
    async getSheetData(
        @Query('sheetId') sheetId: string,
        @Query('range') range: string,
    ) {
        return await this.googleSheetsService.getSheetData(sheetId, range);
    }

    @Post('append')
    async appendRow(
        @Query('sheetId') sheetId: string,
        @Query('range') range: string,
        @Body() data: { values: any[] },
    ) {
        await this.googleSheetsService.appendRow(sheetId, range, data.values);
        return { message: 'Row added successfully' };
    }
}
