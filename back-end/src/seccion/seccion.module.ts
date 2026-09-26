import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeccionController } from './seccion.controller.js';
import { Seccion } from './seccion.entity.js';
import { SeccionService } from './seccion.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Seccion], 'sistema')],
  controllers: [SeccionController],
  providers: [SeccionService],
  exports: [SeccionService],
})
export class SeccionModule {}
