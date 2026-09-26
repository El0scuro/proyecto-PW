import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PisoController } from './piso.controller.js';
import { Piso } from './piso.entity.js';
import { PisoService } from './piso.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Piso], 'sistema')],
  controllers: [PisoController],
  providers: [PisoService],
  exports: [PisoService],
})
export class PisoModule {}
