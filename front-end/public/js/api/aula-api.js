let currentRole = 'estudiante';

export function setApiRole(role) {
  currentRole = role;
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`/api/${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-aula-role': currentRole,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new Error('No se pudo conectar con el backend. Revisa que esté iniciado.');
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('El backend respondió con un formato que el frontend no puede leer.');
  }

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(' ')
      : data.message || `Error ${response.status}`;

    throw new Error(message);
  }

  return data;
}

export function getConfig() {
  return request('config');
}

export function getClasses(filters = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== '' && value !== undefined && value !== null) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return request(`clases${query ? `?${query}` : ''}`);
}

export function createClass(data) {
  return request('clases', { method: 'POST', body: data });
}

export function updateClass(id, data) {
  return request(`clases/${id}`, { method: 'PUT', body: data });
}

export function deleteClass(id) {
  return request(`clases/${id}`, { method: 'DELETE' });
}

export function getRooms() {
  return request('salas');
}

export function createRoom(data) {
  return request('salas', { method: 'POST', body: data });
}

export function updateRoom(id, data) {
  return request(`salas/${id}`, { method: 'PUT', body: data });
}

export function deleteRoom(id) {
  return request(`salas/${id}`, { method: 'DELETE' });
}

export function getReports() {
  return request('reportes');
}
