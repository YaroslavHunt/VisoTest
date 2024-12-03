import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Row } from './row.entity';

@Injectable()
export class RowsService {
    constructor(
        @InjectRepository(Row)
        private readonly rowRepository: Repository<Row>,
    ) {}

    async create(content: string): Promise<Row> {
        const newRow = this.rowRepository.create({ content });
        return this.rowRepository.save(newRow);
    }

    async findAll(): Promise<Row[]> {
        return this.rowRepository.find();
    }

    async findOne(id: number): Promise<Row> {
        return this.rowRepository.findOneBy({ id });
    }
}
