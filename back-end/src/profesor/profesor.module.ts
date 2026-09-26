import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorController } from './profesor.controller.js';
import { Profesor } from './profesor.entity.js';
import { ProfesorService } from './profesor.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Profesor], 'sistema')],
  controllers: [ProfesorController],
  providers: [ProfesorService],
  exports: [ProfesorService],
})
export class ProfesorModule {}
