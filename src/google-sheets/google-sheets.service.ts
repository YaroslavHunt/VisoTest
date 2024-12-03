import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import * as path from 'path';
import {WebsocketGateway} from "../websocket/websocket.gateway";

@Injectable()
export class GoogleSheetsService {
    private sheets: sheets_v4.Sheets;

    constructor(private readonly websocketGateway: WebsocketGateway) {
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(__dirname, '..', 'config', 'service-account-key.json'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth });
    }

    async getSheetData(sheetId: string, range: string): Promise<any[]> {
        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });
        return response.data.values || [];
    }

    async appendRow(sheetId: string, range: string, values: any[]): Promise<void> {
        await this.sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [values] },
        });

        this.websocketGateway.sendRowUpdate({ sheetId, values });
    }
}
