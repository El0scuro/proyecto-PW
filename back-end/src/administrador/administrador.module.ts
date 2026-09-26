import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorController } from './administrador.controller.js';
import { Administrador } from './administrador.entity.js';
import { AdministradorService } from './administrador.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Administrador], 'administrador')],
  controllers: [AdministradorController],
  providers: [AdministradorService],
  exports: [AdministradorService],
})
export class AdministradorModule {}