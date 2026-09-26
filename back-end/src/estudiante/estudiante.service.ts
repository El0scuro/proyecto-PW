import { Injectable } from '@nestjs/common';
import { Estudiante } from './estudiante.entity.js';

@Injectable()
export class EstudianteService {
  findAll(): Estudiante[] {
    return [];
  }
}