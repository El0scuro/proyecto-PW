import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tabla_drop')
export class TablaDrop {
  @PrimaryGeneratedColumn({ name: 'ID_Drop', type: 'int' })
  ID_Drop: number;
}