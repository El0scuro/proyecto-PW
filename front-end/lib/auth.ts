import { ApiError, aulaApi } from './api';
import type { Role, Session } from './types';

const SESSION_KEY = 'aula_uv_session';

export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; message: string };

export type ActionResult = {
  ok: boolean;
  message: string;
};

const demoUsers: Array<{
  correo: string;
  contrasena: string;
  session: Session;
}> = [
  {
    correo: 'estudiante@alumnos.uv.cl',
    contrasena: 'aula123',
    session: {
      nombre: 'Estudiante',
      correo: 'estudiante@alumnos.uv.cl',
      rol: 'estudiante',
    },
  },
  {
    correo: 'secretaria@uv.cl',
    contrasena: 'aula123',
    session: {
      nombre: 'Secretaría',
      correo: 'secretaria@uv.cl',
      rol: 'secretaria',
    },
  },
  {
    correo: 'admin@uv.cl',
    contrasena: 'aula123',
    session: {
      nombre: 'Administrador',
      correo: 'admin@uv.cl',
      rol: 'administrador',
    },
  },
];

function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  return 'No se pudo conectar con el servidor.';
}

function demoSession(
  correo: string,
  contrasena: string,
  allowedRoles: Role[],
): Session | null {
  const user = demoUsers.find(
    (item) =>
      item.correo.toLowerCase() === correo.toLowerCase() &&
      item.contrasena === contrasena &&
      allowedRoles.includes(item.session.rol),
  );

  return user?.session ?? null;
}

export async function loginPublic(
  correo: string,
  contrasena: string,
): Promise<AuthResult> {
  try {
    const session = await aulaApi.iniciarSesion({ correo, contrasena });

    if (session.rol === 'administrador') {
      return {
        ok: false,
        message: 'Esta cuenta utiliza el acceso exclusivo de administración.',
      };
    }

    return { ok: true, session: saveSession(session) };
  } catch (error) {
    if (!(error instanceof ApiError)) {
      const session = demoSession(correo, contrasena, [
        'estudiante',
        'secretaria',
      ]);

      if (session) {
        return { ok: true, session: saveSession(session) };
      }
    }

    return { ok: false, message: errorMessage(error) };
  }
}

export async function loginAdmin(
  correo: string,
  contrasena: string,
): Promise<AuthResult> {
  try {
    const session = await aulaApi.iniciarSesion({ correo, contrasena });

    if (session.rol !== 'administrador') {
      return {
        ok: false,
        message: 'Esta cuenta no tiene permisos de administrador.',
      };
    }

    return { ok: true, session: saveSession(session) };
  } catch (error) {
    if (!(error instanceof ApiError)) {
      const session = demoSession(correo, contrasena, ['administrador']);

      if (session) {
        return { ok: true, session: saveSession(session) };
      }
    }

    return { ok: false, message: errorMessage(error) };
  }
}

export async function registerStudent(data: {
  nombre: string;
  correo: string;
  contrasena: string;
  generacion: number;
}): Promise<ActionResult & { session?: Session }> {
  try {
    const session = await aulaApi.registrarEstudiante(data);
    saveSession(session);
    return {
      ok: true,
      message: 'Cuenta creada correctamente.',
      session,
    };
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }
}

export async function requestPasswordRecovery(
  correo: string,
): Promise<ActionResult> {
  try {
    const response = await aulaApi.recuperarContrasena(correo);
    return {
      ok: true,
      message:
        response.message ??
        'Si el correo está registrado, recibirás instrucciones de recuperación.',
    };
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;

  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as Session | null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
