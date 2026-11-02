import { Body, Controller, Get, Post } from '@nestjs/common';
import { EdificioService } from './edificio.service.js';
import { Edificio } from './edificio.entity.js';

@Controller('edificios')
export class EdificioController {
  constructor(private readonly edificioService: EdificioService) {}

  @Get('todos')
  findAll() {
    return this.edificioService.findAll();
  }

  @Post('agregar')
  agregarEdificio(@Body() body: { Nombre: string; Direccion: string }) {
    return this.edificioService.agregarEdificio(body);
  }
}
