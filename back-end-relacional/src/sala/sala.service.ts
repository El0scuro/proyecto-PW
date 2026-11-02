import { Injectable } from '@nestjs/common';
import { Sala } from './sala.entity.js';

@Injectable()
export class SalaService {
  findAll(): Sala[] {
    return [];
  }
}
