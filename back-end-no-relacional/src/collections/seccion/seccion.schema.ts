import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SeccionDocument = HydratedDocument<Seccion>;

@Schema({
  collection: 'Seccion',
  versionKey: false,
})
export class Seccion {
  @Prop({ required: true })
  _id: number;

  @Prop({
    type: Number,
    ref: 'Asignatura',
    required: true,
  })
  _id_asignatura: number;

  @Prop({ required: true })
  num_seccion: number;

  @Prop({ required: true })
  sede: string;

  @Prop({
    type: [Number],
    ref: 'Horario',
    required: true,
  })
  _id_horarios: number[];

  @Prop({ required: true })
  nombre_profesor: string;
}

export const SeccionSchema = SchemaFactory.createForClass(Seccion);