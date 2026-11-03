import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { startMockApi } from './support/mock-api.js';

const frontendPort = 5197;
const apiPort = 5196;
const baseUrl = `http://127.0.0.1:${frontendPort}`;
let frontend;
let mockApi;

async function waitForFrontend() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error('El servidor de prueba no inició.');
}

before(async () => {
  mockApi = await startMockApi(apiPort);

  frontend = spawn(process.execPath, ['server/index.js'], {
    cwd: new URL('../', import.meta.url),
    env: {
      ...process.env,
      PORT: String(frontendPort),
      API_URL: `http://127.0.0.1:${apiPort}`,
    },
    stdio: 'ignore',
  });

  await waitForFrontend();
});

after(() => {
  frontend?.kill();
  mockApi?.close();
});

test('sirve el frontend', async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Aula UV/);
});

test('sirve el logo institucional', async () => {
  const response = await fetch(`${baseUrl}/assets/logo-uv.png`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /image\/png/);
});

test('el frontend reenvía config al backend', async () => {
  const response = await fetch(`${baseUrl}/api/config`);
  assert.deepEqual(await response.json(), { modo: 'mongo' });
});

test('el proxy conserva los filtros de búsqueda', async () => {
  const response = await fetch(`${baseUrl}/api/clases?q=algebra`);
  const data = await response.json();

  assert.equal(data.length, 1);
  assert.equal(data[0].codigo, 'INF-112');
});

test('el proxy entrega salas del backend', async () => {
  const response = await fetch(`${baseUrl}/api/salas`);
  const data = await response.json();

  assert.equal(data.length, 2);
});

test('el proxy entrega la consulta de reportes', async () => {
  const response = await fetch(`${baseUrl}/api/reportes`);
  const data = await response.json();

  assert.equal(data[0].minutos, 90);
});

test('una ruta inexistente conserva el 404 del backend', async () => {
  const response = await fetch(`${baseUrl}/api/no-existe`);
  assert.equal(response.status, 404);
});
