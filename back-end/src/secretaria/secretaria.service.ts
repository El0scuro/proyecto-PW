import { Injectable } from '@nestjs/common';
import { Secretaria } from './secretaria.entity.js';

@Injectable()
export class SecretariaService {
  findAll(): Secretaria[] {
    return [];
  }
}
