import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EdificioDocument = HydratedDocument<Edificio>;

@Schema({
  collection: 'Edificio',
  versionKey: false,
})
export class Edificio {
  @Prop({ required: true })
  _id: number;

  @Prop({ required: true })
  direccion: string;

  @Prop({ required: true })
  nombre: string;
}

export const EdificioSchema = SchemaFactory.createForClass(Edificio);