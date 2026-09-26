import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('profesor')
export class Profesor {
  @PrimaryColumn({ name: 'Correo', type: 'varchar', length: 100 })
  Correo: string;

  @Column({ name: 'Nombre', type: 'varchar', length: 100 })
  Nombre: string;
}
