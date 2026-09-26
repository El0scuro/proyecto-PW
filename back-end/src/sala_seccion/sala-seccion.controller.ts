import { Controller, Get } from '@nestjs/common';
import { SalaSeccionService } from './sala-seccion.service.js';
import { SalaSeccion } from './sala-seccion.entity.js';

@Controller('sala-secciones')
export class SalaSeccionController {
  constructor(private readonly salaSeccionService: SalaSeccionService) {}

  @Get()
  findAll(): SalaSeccion[] {
    return this.salaSeccionService.findAll();
  }
}
