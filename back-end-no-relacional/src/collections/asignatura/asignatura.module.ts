import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Asignatura, AsignaturaSchema } from './asignatura.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asignatura.name, schema: AsignaturaSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class AsignaturaModule {}