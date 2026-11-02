import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Administrador,
  AdministradorSchema,
} from './administrador.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Administrador.name, schema: AdministradorSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class AdministradorModule {}