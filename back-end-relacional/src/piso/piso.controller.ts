import { Controller, Get } from '@nestjs/common';
import { PisoService } from './piso.service.js';
import { Piso } from './piso.entity.js';

@Controller('pisos')
export class PisoController {
  constructor(private readonly pisoService: PisoService) {}

  @Get()
  findAll(): Piso[] {
    return this.pisoService.findAll();
  }
}
