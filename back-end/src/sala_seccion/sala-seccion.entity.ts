import { Entity, PrimaryColumn } from 'typeorm';

@Entity('sala_seccion')
export class SalaSeccion {
  @PrimaryColumn({ name: 'ID_Edificio', type: 'int' })
  ID_Edificio!: number;

  @PrimaryColumn({ name: 'Numero_Piso', type: 'int' })
  Numero_Piso: number;

  @PrimaryColumn({ name: 'Numero_Sala', type: 'int' })
  Numero_Sala: number;

  @PrimaryColumn({ name: 'ID_Seccion', type: 'int' })
  ID_Seccion: number;
}
