import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Row } from './row.entity';
import { RowsService } from './rows.service';
import { RowsController } from './rows.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Row])],
    providers: [RowsService],
    controllers: [RowsController],
})
export class RowsModule {}
