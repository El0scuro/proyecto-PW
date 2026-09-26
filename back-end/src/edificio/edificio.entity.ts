import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('edificio')
export class Edificio {
  @PrimaryGeneratedColumn({ name: 'ID_Edificio', type: 'int' })
  ID_Edificio: number;

  @Column({ name: 'Direccion', type: 'varchar', length: 100 })
  Direccion: string;

  @Column({ name: 'Nombre', type: 'varchar', length: 100})
  Nombre: string;
}
