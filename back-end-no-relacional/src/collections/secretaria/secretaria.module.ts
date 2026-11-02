import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Secretaria, SecretariaSchema } from './secretaria.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Secretaria.name, schema: SecretariaSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SecretariaModule {}