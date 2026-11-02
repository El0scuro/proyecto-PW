import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdificioController } from './edificio.controller.js';
import { Edificio } from './edificio.entity.js';
import { EdificioService } from './edificio.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Edificio], 'sistema')],
  controllers: [EdificioController],
  providers: [EdificioService],
  exports: [EdificioService],
})
export class EdificioModule {}
