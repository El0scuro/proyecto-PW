import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SecretariaDocument = HydratedDocument<Secretaria>;

@Schema({
  collection: 'Secretaria',
  versionKey: false,
})
export class Secretaria {
  @Prop({ required: true })
  _id: number;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  sede: string;

  @Prop({ required: true })
  contrasena: string;
}

export const SecretariaSchema = SchemaFactory.createForClass(Secretaria);