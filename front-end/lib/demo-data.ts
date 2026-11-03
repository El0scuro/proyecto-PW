import type { ClassBlock, Room } from './types';

export const rooms: Room[] = [
  { id: 's101', numero: '101', piso: 1, edificio: 'Hucke', direccion: 'Valparaíso' },
  { id: 's204', numero: '204', piso: 2, edificio: 'Hucke', direccion: 'Valparaíso' },
  { id: 's305', numero: '305', piso: 3, edificio: 'Facultad de Ingeniería', direccion: 'Valparaíso' },
];

export const classes: ClassBlock[] = [
  {
    id: 'c1', codigo: 'ICI-324', asignatura: 'Bases de Datos y Programación Web', seccion: 1,
    profesor: 'Benjamín Serrano', dia: 'Lunes', inicio: '10:10', fin: '11:40', salaId: 's204', sede: 'Valparaíso', sala: rooms[1],
  },
  {
    id: 'c2', codigo: 'MAT-120', asignatura: 'Álgebra', seccion: 2,
    profesor: 'María González', dia: 'Martes', inicio: '08:30', fin: '10:00', salaId: 's101', sede: 'Valparaíso', sala: rooms[0],
  },
  {
    id: 'c3', codigo: 'ICI-221', asignatura: 'Estructuras de Datos', seccion: 1,
    profesor: 'Carlos Muñoz', dia: 'Miércoles', inicio: '14:30', fin: '16:00', salaId: 's305', sede: 'Valparaíso', sala: rooms[2],
  },
];
