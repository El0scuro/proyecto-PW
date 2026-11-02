import { Controller, Get } from '@nestjs/common';
import { SalaService } from './sala.service.js';
import { Sala } from './sala.entity.js';

@Controller('salas')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Get()
  findAll(): Sala[] {
    return this.salaService.findAll();
  }
}
