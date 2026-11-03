import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDirectory = path.join(root, 'public');
const apiUrl = (process.env.API_URL || 'http://127.0.0.1:4002').replace(/\/$/, '');
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function json(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

async function proxyApi(request, response, url) {
  try {
    let body;

    if (!['GET', 'HEAD'].includes(request.method)) {
      let raw = '';
      for await (const chunk of request) raw += chunk;
      body = raw || undefined;
    }

    const upstream = await fetch(`${apiUrl}${url.pathname}${url.search}`, {
      method: request.method,
      body,
      headers: {
        'Content-Type': request.headers['content-type'] || 'application/json',
        'x-aula-role': request.headers['x-aula-role'] || 'estudiante',
      },
      signal: AbortSignal.timeout(10000),
    });

    response.writeHead(upstream.status, {
      'Content-Type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    response.end(await upstream.text());
  } catch {
    json(response, 503, {
      message: `No se pudo conectar con el backend en ${apiUrl}.`,
    });
  }
}

async function serveStatic(request, response, url) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return json(response, 405, { message: 'Método no permitido.' });
  }

  const requestPath = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const filePath = path.resolve(publicDirectory, `.${requestPath}`);

  if (!filePath.startsWith(`${publicDirectory}${path.sep}`)) {
    return json(response, 403, { message: 'Acceso no permitido.' });
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return json(response, 404, { message: 'Archivo no encontrado.' });
    }

    return json(response, 500, { message: 'No se pudo leer el archivo.' });
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');

  if (url.pathname.startsWith('/api/')) {
    return proxyApi(request, response, url);
  }

  return serveStatic(request, response, url);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Aula UV: http://localhost:${port} -> ${apiUrl}`);
});
