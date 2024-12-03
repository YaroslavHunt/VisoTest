import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {RowsModule} from "./rows/rows.module";
import { GoogleSheetsModule } from './google-sheets/google-sheets.module';
import { WebsocketGateway } from './websocket/websocket.gateway';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        RowsModule,
        GoogleSheetsModule,
    ],
    providers: [WebsocketGateway]
})
export class AppModule {
}


