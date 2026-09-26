import { Injectable } from '@nestjs/common';
import { SalaSeccion } from './sala-seccion.entity.js';

@Injectable()
export class SalaSeccionService {
  findAll(): SalaSeccion[] {
    return [];
  }
}
