import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EstudianteDocument = HydratedDocument<Estudiante>;

@Schema({
  collection: 'Estudiante',
  versionKey: false,
})
export class Estudiante {
  @Prop({ required: true })
  _id: number;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  contrasena: string;
}

export const EstudianteSchema = SchemaFactory.createForClass(Estudiante);