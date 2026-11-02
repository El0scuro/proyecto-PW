import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Horario, HorarioSchema } from './horario.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Horario.name, schema: HorarioSchema }]),
  ],
  exports: [MongooseModule],
})
export class HorarioModule {}