import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignaturaController } from './asignatura.controller.js';
import { Asignatura } from './asignatura.entity.js';
import { AsignaturaService } from './asignatura.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Asignatura], 'sistema')],
  controllers: [AsignaturaController],
  providers: [AsignaturaService],
  exports: [AsignaturaService],
})
export class AsignaturaModule {}
