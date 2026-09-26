import { Module } from '@nestjs/common';
import { TablaDropController } from './tabla_drop.controller.js';
import { TablaDrop } from './tabla_drop.entity.js';
import { EdificioService } from './tabla_drop.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TablaDrop], 'sistema')],
  controllers: [TablaDropController],
  providers: [EdificioService],
})
export class TablaDropModule {}