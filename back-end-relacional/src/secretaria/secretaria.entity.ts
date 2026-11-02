import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('secretaria')
export class Secretaria {
  @PrimaryColumn({ name: 'Correo', type: 'varchar', length: 100 })
  Correo: string;

  @Column({ name: 'Sede', type: 'varchar', length: 100 })
  Sede: string;

  @Column({ name: 'Contrasena', type: 'varchar', length: 255 })
  Contrasena: string;
}
