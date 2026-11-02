import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaSeccionController } from './sala-seccion.controller.js';
import { SalaSeccion } from './sala-seccion.entity.js';
import { SalaSeccionService } from './sala-seccion.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SalaSeccion], 'sistema')],
  controllers: [SalaSeccionController],
  providers: [SalaSeccionService],
  exports: [SalaSeccionService],
})
export class SalaSeccionModule {}
