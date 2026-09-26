import { Controller, Get } from '@nestjs/common';
import { NombresService } from './nombres.service.js';
import { Nombres } from './nombres.entity.js';

@Controller('nombres')
export class NombresController {
  constructor(private readonly nombresService: NombresService) {}

  @Get()
  findAll(): Nombres[] {
    return this.nombresService.findAll();
  }
}
