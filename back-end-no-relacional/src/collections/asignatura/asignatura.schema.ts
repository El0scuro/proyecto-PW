import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AsignaturaDocument = HydratedDocument<Asignatura>;

@Schema({
  collection: 'Asignatura',
  versionKey: false,
})
export class Asignatura {
  @Prop({ required: true })
  _id: number;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  generacion: number;
}

export const AsignaturaSchema = SchemaFactory.createForClass(Asignatura);