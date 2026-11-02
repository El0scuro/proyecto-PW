import { Controller, Get } from '@nestjs/common';
import { SecretariaService } from './secretaria.service.js';
import { Secretaria } from './secretaria.entity.js';

@Controller('secretarias')
export class SecretariaController {
  constructor(private readonly secretariaService: SecretariaService) {}

  @Get()
  findAll(): Secretaria[] {
    return this.secretariaService.findAll();
  }
}
