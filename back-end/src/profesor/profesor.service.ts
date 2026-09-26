import { Injectable } from '@nestjs/common';
import { Profesor } from './profesor.entity.js';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ProfesorService {

  constructor(
    @InjectRepository(Profesor, 'sistema')
    private profesorRepository: Repository<Profesor>,

    @InjectDataSource('sistema')
    private dataSource: DataSource
  ) {}

  // SELECT
  async obtenerProfesores() {
    return await this.profesorRepository.find();
  }

  // INSERT
  async agregarProfesor(body: {Correo: string, Nombre: string}) {
    const nuevo = this.profesorRepository.create({
      Correo: body.Correo,
      Nombre: body.Nombre,
    });

    return await this.profesorRepository.save(nuevo);
  }

  // UPDATE
  async modificarProfesor(body: {Correo: string, Nombre: string}) {
    return await this.profesorRepository.update(
      { Correo: body.Correo},
      { Nombre: body.Nombre }
    );
  }

  // DELETE
  async eliminarProfesor(body: {Correo: string}) {
    return await this.profesorRepository.delete({
      Correo: body.Correo
    });
  }

  // ALTER
  async agregarColumna() {
    return await this.dataSource.query(`
      ALTER TABLE profesor
      ADD COLUMN Telefono VARCHAR(20);
    `);
  }
}
