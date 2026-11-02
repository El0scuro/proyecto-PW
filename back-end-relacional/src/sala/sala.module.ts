import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaController } from './sala.controller.js';
import { Sala } from './sala.entity.js';
import { SalaService } from './sala.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Sala], 'sistema')],
  controllers: [SalaController],
  providers: [SalaService],
  exports: [SalaService],
})
export class SalaModule {}
