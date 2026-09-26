import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('usuario')
export class Administrador {
  @PrimaryColumn({ name: 'Correo', type: 'varchar', length: 100 })
  Correo: string;

  @Column({ name: 'Nombre', type: 'varchar', length: 100 })
  Nombre: string;

  @Column({ name: 'Sede', type: 'varchar', length: 100 })
  Sede: string;
}