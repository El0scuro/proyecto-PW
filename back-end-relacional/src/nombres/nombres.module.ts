import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NombresController } from './nombres.controller.js';
import { Nombres } from './nombres.entity.js';
import { NombresService } from './nombres.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Nombres], 'sistema')],
  controllers: [NombresController],
  providers: [NombresService],
  exports: [NombresService],
})
export class NombresModule {}
