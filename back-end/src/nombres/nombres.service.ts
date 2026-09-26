import { Injectable } from '@nestjs/common';
import { Nombres } from './nombres.entity.js';

@Injectable()
export class NombresService {
  findAll(): Nombres[] {
    return [];
  }
}
