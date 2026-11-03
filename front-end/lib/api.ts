import type { ClassBlock, Room, SecretaryAccount, Session } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4002/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Error ${response.status} al consultar el servidor.`;

    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(' ');
      if (typeof body.message === 'string') message = body.message;
    } catch {}

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const aulaApi = {
  iniciarSesion: (data: { correo: string; contrasena: string }) =>
    request<Session>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registrarEstudiante: (data: {
    nombre: string;
    correo: string;
    contrasena: string;
    generacion: number;
  }) =>
    request<Session>('/auth/registro/estudiante', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  recuperarContrasena: (correo: string) =>
    request<{ message?: string }>('/auth/recuperar-contrasena', {
      method: 'POST',
      body: JSON.stringify({ correo }),
    }),

  clases: () => request<ClassBlock[]>('/clases'),
  crearClase: (data: Partial<ClassBlock>) =>
    request<ClassBlock>('/clases', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  eliminarClase: (id: string) =>
    request<void>(`/clases/${id}`, { method: 'DELETE' }),

  salas: () => request<Room[]>('/salas'),
  crearSala: (data: Omit<Room, 'id'>) =>
    request<Room>('/salas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  eliminarSala: (id: string) =>
    request<void>(`/salas/${id}`, { method: 'DELETE' }),

  secretarias: () => request<SecretaryAccount[]>('/secretarias'),
  crearSecretaria: (data: {
    nombre: string;
    correo: string;
    contrasena: string;
  }) =>
    request<SecretaryAccount>('/secretarias', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
