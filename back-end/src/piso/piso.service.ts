import { Injectable } from '@nestjs/common';
import { Piso } from './piso.entity.js';

@Injectable()
export class PisoService {
  findAll(): Piso[] {
    return [];
  }
}
