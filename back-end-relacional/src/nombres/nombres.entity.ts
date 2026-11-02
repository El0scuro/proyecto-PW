import { Entity, PrimaryColumn } from 'typeorm';

@Entity('nombres')
export class Nombres {
  @PrimaryColumn({ name: 'Codigo', type: 'varchar', length: 100 })
  Codigo: string;

  @PrimaryColumn({ name: 'Nombre', type: 'varchar', length: 100 })
  Nombre: string;
}
