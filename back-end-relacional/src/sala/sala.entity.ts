import { Entity, PrimaryColumn } from 'typeorm';

@Entity('sala')
export class Sala {
  @PrimaryColumn({ name: 'ID_Edificio', type: 'int' })
  ID_Edificio: number;

  @PrimaryColumn({ name: 'Numero_Piso', type: 'int' })
  Numero_Piso: number;

  @PrimaryColumn({ name: 'Numero_Sala', type: 'int' })
  Numero_Sala: number;
}
