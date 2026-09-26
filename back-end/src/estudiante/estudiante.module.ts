import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteController } from './estudiante.controller.js';
import { Estudiante } from './estudiante.entity.js';
import { EstudianteService } from './estudiante.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante], 'estudiante')],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}