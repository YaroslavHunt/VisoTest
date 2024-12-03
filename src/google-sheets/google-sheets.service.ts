import {Injectable} from '@nestjs/common';
import {google, sheets_v4} from 'googleapis';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import {WebsocketGateway} from '../websocket/websocket.gateway';

@Injectable()
export class GoogleSheetsService {
    private sheets: sheets_v4.Sheets;
    private rowCount = 0;

    constructor(private readonly websocketGateway: WebsocketGateway) {
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(__dirname, '..', 'config', 'service-account-key.json'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth });
    }

    async getSheetData(sheetId: string, range: string): Promise<any[]> {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range,
            });
            return response.data.values || [];
        } catch (error) {
            console.error('Error fetching sheet data:', error);
            throw new Error('Unable to fetch sheet data.');
        }
    }

    async appendRow(sheetId: string, range: string, values: any[]): Promise<void> {
        await this.sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [values] },
        });

        this.rowCount++;
        this.websocketGateway.sendRowUpdate({ sheetId, values });

        if (this.rowCount % 10 === 0) {
            await this.sendEmailNotification(sheetId, this.rowCount);
        }
    }

    private async sendEmailNotification(sheetId: string, rowCount: number): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Google Sheets Bot" <${process.env.EMAIL_USER}>`,
            to: `"Google Sheets Bot" <${process.env.EMAIL_TO}>`,
            subject: `Оновлення таблиці ${sheetId}`,
            html: `<p>У таблиці <b>${sheetId}</b> додано <b>${rowCount}</b> рядків.</p>`,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
