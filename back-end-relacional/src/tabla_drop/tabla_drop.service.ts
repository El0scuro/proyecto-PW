import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class EdificioService {

    constructor(
        @InjectDataSource('sistema')
        private dataSource: DataSource
    ) {}

    async eliminarTablaPrueba(nombre_Tabla: string) {
        return await this.dataSource.query(`
            DROP TABLE ${nombre_Tabla};
        `);
    }
}