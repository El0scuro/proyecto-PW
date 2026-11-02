import { Controller, Get } from '@nestjs/common';
import { EstudianteService } from './estudiante.service.js';
import { Estudiante } from './estudiante.entity.js';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get()
  findAll(): Estudiante[] {
    return this.estudianteService.findAll();
  }
}