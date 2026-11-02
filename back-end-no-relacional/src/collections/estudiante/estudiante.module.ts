import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Estudiante, EstudianteSchema } from './estudiante.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Estudiante.name, schema: EstudianteSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class EstudianteModule {}