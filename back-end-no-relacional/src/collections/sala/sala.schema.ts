import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SalaDocument = HydratedDocument<Sala>;

@Schema({
  collection: 'Sala',
  versionKey: false,
})
export class Sala {
  @Prop({ required: true })
  _id: number;

  @Prop({
    type: Number,
    ref: 'Edificio',
    required: true,
  })
  _id_edificio: number;

  @Prop({ required: true })
  num_sala: number;

  @Prop({ required: true })
  piso: number;
}

export const SalaSchema = SchemaFactory.createForClass(Sala);