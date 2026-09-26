import { Controller, Get } from '@nestjs/common';
import { AsignaturaService } from './asignatura.service.js';
import { Asignatura } from './asignatura.entity.js';

@Controller('asignaturas')
export class AsignaturaController {
  constructor(private readonly asignaturaService: AsignaturaService) {}

  @Get()
  findAll(): Asignatura[] {
    return this.asignaturaService.findAll();
  }
}
