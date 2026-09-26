import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('asignatura')
export class Asignatura {
  @PrimaryColumn({ name: 'Codigo', type: 'varchar', length: 100 })
  Codigo: string;

  @Column({ name: 'Nombre', type: 'varchar', length: 100 })
  Nombre: string;
}
