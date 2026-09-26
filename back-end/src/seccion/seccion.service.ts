import { Injectable } from '@nestjs/common';
import { Seccion } from './seccion.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from '../profesor/profesor.entity.js';
import { Asignatura } from '../asignatura/asignatura.entity.js';
import { Nombres } from '../nombres/nombres.entity.js';

@Injectable()
export class SeccionService {

  constructor(
    @InjectRepository(Seccion, 'sistema')
    private seccionRepository: Repository<Seccion>
  ) {}

    async obtenerSeccionesConProfesor(Correo: string) {
    return await this.seccionRepository
        .createQueryBuilder('seccion')
        .innerJoin(
            Profesor,
            'profesor',
            'seccion.Correo = profesor.Correo'
        )
        .select([
            'seccion.ID_Seccion AS ID_Seccion',
            'seccion.Codigo AS Codigo',
            'seccion.Sede AS Sede',
            'profesor.Correo AS Profesor'
        ])
        .where('seccion.Correo = :Correo', { Correo })
        .getRawMany();
}

    async obtenerSeccionesConAsignatura(Codigo: string) {
        return await this.seccionRepository
            .createQueryBuilder('seccion')

            .innerJoin(
                Asignatura,
                'asignatura',
                'seccion.Codigo = asignatura.Codigo'
            )

            .innerJoin(
                Nombres,
                'nombres',
                'asignatura.Codigo = nombres.Codigo'
            )

            .innerJoin(
                Profesor,
                'profesor',
                'seccion.Correo = profesor.Correo'
            )

            .select([
                'seccion.ID_Seccion AS ID_Seccion',
                'seccion.Codigo AS Codigo',
                'nombres.Nombre AS Asignatura',
                'profesor.Correo AS Profesor',
                'seccion.Sede AS Sede'
            ])

            .where('asignatura.Codigo = :Codigo', { Codigo })

            .getRawMany();
    }

    async modificarSedeSeccion(body: {ID_Seccion: number, Sede: string}) {
        return await this.seccionRepository.update(
            { ID_Seccion: body.ID_Seccion },
            { Sede: body.Sede }
        );
    }
  findAll(){
    return this.seccionRepository.find();
  }
}
