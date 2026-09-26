import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { SeccionService } from './seccion.service.js';

@Controller('secciones')
export class SeccionController {
  constructor(private readonly seccionService: SeccionService) {}

  @Get('todas')
  findAll() {
    return this.seccionService.findAll();
  }

  @Get('con-profesor/:Correo')
  obtenerSeccionesConProfesor(@Param('Correo') Correo: string) {
    return this.seccionService.obtenerSeccionesConProfesor(Correo);
  }

  @Get('con-asignatura/:Codigo')
  obtenerSeccionesConAsignatura(@Param('Codigo') Codigo: string) {
    return this.seccionService.obtenerSeccionesConAsignatura(Codigo);
  }

  @Patch('sede')
  modificarSedeSeccion(@Body() body: { ID_Seccion: number; Sede: string }) {
    return this.seccionService.modificarSedeSeccion(body);
  }
}
