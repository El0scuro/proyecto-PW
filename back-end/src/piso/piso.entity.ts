import { Entity, PrimaryColumn } from 'typeorm';

@Entity('piso')
export class Piso {
  @PrimaryColumn({ name: 'Numero_Piso', type: 'int' })
  Numero_Piso: number;

  @PrimaryColumn({ name: 'ID_Edificio', type: 'int' })
  ID_Edificio: number;
}
