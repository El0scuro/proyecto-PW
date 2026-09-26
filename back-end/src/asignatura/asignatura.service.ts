import { Injectable } from '@nestjs/common';
import { Asignatura } from './asignatura.entity.js';

@Injectable()
export class AsignaturaService {
  findAll(): Asignatura[] {
    return [];
  }
}
