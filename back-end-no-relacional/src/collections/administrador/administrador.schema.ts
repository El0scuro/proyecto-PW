import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdministradorDocument = HydratedDocument<Administrador>;

@Schema({
  collection: 'Administrador',
  versionKey: false,
})
export class Administrador {
  @Prop({ required: true })
  _id: number;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  sede: string;

  @Prop({ required: true })
  contrasena: string;
}

export const AdministradorSchema = SchemaFactory.createForClass(Administrador);