import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Seccion, SeccionSchema } from './seccion.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Seccion.name, schema: SeccionSchema }]),
  ],
  exports: [MongooseModule],
})
export class SeccionModule {}