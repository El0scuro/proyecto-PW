import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HorarioDocument = HydratedDocument<Horario>;

@Schema({
  collection: 'Horario',
  versionKey: false,
})
export class Horario {
  @Prop({ required: true })
  _id: number;

  @Prop({
    type: Number,
    ref: 'Sala',
    required: true,
  })
  _id_sala: number;

  @Prop({ required: true })
  dia: string;

  @Prop({ required: true })
  inicio: string;

  @Prop({ required: true })
  final: string;
}

export const HorarioSchema = SchemaFactory.createForClass(Horario);