import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seccion')
export class Seccion {
  @PrimaryGeneratedColumn({ name: 'ID_Seccion', type: 'int' })
  ID_Seccion: number;

  @Column({ name: 'Codigo', type: 'varchar', length: 100 })
  Codigo: string;

  @Column({ name: 'Correo', type: 'varchar', length: 100 })
  Correo: string;

  @Column({ name: 'Sede', type: 'varchar', length: 100 })
  Sede: string;
}
