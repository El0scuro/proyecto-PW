import { Injectable } from '@nestjs/common';
import { Administrador } from './administrador.entity.js';

@Injectable()
export class AdministradorService {
  findAll(): Administrador[] {
    return [];
  }
}
