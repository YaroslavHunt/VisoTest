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

    @Post('add-row')
    async addRow(@Body() rowData: string[]) {
        const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
        const range = 'Sheet1!A1:D1';
        await this.googleSheetsService.appendRow(sheetId, range, rowData);
    }
}
