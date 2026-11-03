import http from 'node:http';

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function minutesBetween(start, end) {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
}

const rooms = [
  { id: 'sala-111', numero: '111', piso: 1, edificio: 'Hucke', direccion: 'General Cruz 222' },
  { id: 'sala-113', numero: '113', piso: 1, edificio: 'Hucke', direccion: 'General Cruz 222' },
];

const classes = [
  {
    id: 'clase-1',
    codigo: 'INF-112',
    asignatura: 'Álgebra',
    seccion: 1,
    profesor: 'Profesor 2',
    dia: 'Miércoles',
    inicio: '10:00',
    fin: '11:30',
    sede: 'Valparaíso',
    salaId: 'sala-113',
  },
];

function writeJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

export function startMockApi(port) {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');

    if (url.pathname === '/api/config') {
      return writeJson(response, 200, { modo: 'mongo' });
    }

    if (url.pathname === '/api/salas') {
      return writeJson(response, 200, rooms);
    }

    if (url.pathname === '/api/clases') {
      const q = normalize(url.searchParams.get('q'));
      const result = classes
        .map((item) => ({
          ...item,
          sala: rooms.find((room) => room.id === item.salaId),
        }))
        .filter((item) => !q || normalize(item.asignatura).includes(q));

      return writeJson(response, 200, result);
    }

    if (url.pathname === '/api/reportes') {
      return writeJson(response, 200, [
        { edificio: 'Hucke', numero: '113', piso: 1, clases: 1, minutos: 90 },
      ]);
    }

    return writeJson(response, 404, { message: 'No existe.' });
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

export { normalize, minutesBetween };
