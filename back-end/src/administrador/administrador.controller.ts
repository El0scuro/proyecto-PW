import { Controller, Get } from '@nestjs/common';
import { AdministradorService } from './administrador.service.js';
import { Administrador } from './administrador.entity.js';

@Controller('administradores')
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  @Get()
  findAll(): Administrador[] {
    return this.administradorService.findAll();
  }
}