import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretariaController } from './secretaria.controller.js';
import { Secretaria } from './secretaria.entity.js';
import { SecretariaService } from './secretaria.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Secretaria], 'secretaria')],
  controllers: [SecretariaController],
  providers: [SecretariaService],
  exports: [SecretariaService],
})
export class SecretariaModule {}
