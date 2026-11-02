import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ProfesorService } from './profesor.service.js';

@Controller('profesores')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Get('todos')
  obtenerProfesores() {
    return this.profesorService.obtenerProfesores();
  }

  @Post('crear')
  agregarProfesor(@Body() body: { Correo: string; Nombre: string }) {
    return this.profesorService.agregarProfesor(body);
  }

  @Patch('actualizar')
  modificarProfesor(@Body() body: { Correo: string; Nombre: string }) {
    return this.profesorService.modificarProfesor(body);
  }

  @Delete('eliminar')
  eliminarProfesor(@Body() body: { Correo: string }) {
    return this.profesorService.eliminarProfesor(body);
  }

  @Post('columna/telefono')
  agregarColumnaTelefono() {
    return this.profesorService.agregarColumna();
  }
}
