export type Role = 'estudiante' | 'secretaria' | 'administrador';

export interface Session {
  nombre: string;
  correo: string;
  rol: Role;
  generacion?: number;
}

export interface SecretaryAccount {
  nombre: string;
  correo: string;
  rol: 'secretaria';
}

export interface Room {
  id: string;
  numero: string;
  piso: number;
  edificio: string;
  direccion: string;
}

export interface ClassBlock {
  id: string;
  codigo: string;
  asignatura: string;
  seccion: number;
  profesor: string;
  dia: string;
  inicio: string;
  fin: string;
  salaId: string;
  sede: string;
  sala: Room;
}
