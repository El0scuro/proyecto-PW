'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {
  loginPublic,
  registerStudent,
  requestPasswordRecovery,
} from '@/lib/auth';

type View = 'login' | 'register' | 'recover';

export default function AuthScreen() {
  const router = useRouter();
  const [view, setView] = useState<View>('login');
  const [feedback, setFeedback] = useState('');
  const [kind, setKind] = useState<'error' | 'success'>('error');
  const [busy, setBusy] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback('');

    const form = new FormData(event.currentTarget);
    const result = await loginPublic(
      String(form.get('correo') ?? '').trim(),
      String(form.get('contrasena') ?? ''),
    );

    setBusy(false);

    if (!result.ok) {
      setKind('error');
      setFeedback(result.message);
      return;
    }

    router.push(`/${result.session.rol}`);
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const contrasena = String(form.get('contrasena') ?? '');
    const confirmacion = String(form.get('confirmacion') ?? '');

    if (contrasena !== confirmacion) {
      setKind('error');
      setFeedback('Las contraseñas no coinciden.');
      return;
    }

    setBusy(true);
    setFeedback('');

    const result = await registerStudent({
      nombre: String(form.get('nombre') ?? '').trim(),
      correo: String(form.get('correo') ?? '').trim(),
      contrasena,
      generacion: Number(form.get('generacion')),
    });

    setBusy(false);
    setKind(result.ok ? 'success' : 'error');
    setFeedback(result.message);

    if (result.session) router.push('/estudiante');
  }

  async function handleRecover(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback('');

    const form = new FormData(event.currentTarget);
    const result = await requestPasswordRecovery(
      String(form.get('correo') ?? '').trim(),
    );

    setBusy(false);
    setKind(result.ok ? 'success' : 'error');
    setFeedback(result.message);
  }

  function changeView(nextView: View) {
    setView(nextView);
    setFeedback('');
  }

  return (
    <main className="auth-page">
      <div className="auth-background" aria-hidden="true">
        <span className="mountain mountain-a" />
        <span className="mountain mountain-b" />
        <span className="mountain mountain-c" />
      </div>

      <section className="auth-shell">
        <div className="auth-visual">
          <div className="visual-orb orb-a" />
          <div className="visual-orb orb-b" />
          <div className="logo-card">
            <Image
              src="/logo-uv.png"
              alt="Universidad de Valparaíso"
              width={250}
              height={140}
              priority
            />
          </div>
          <div className="visual-copy">
            <strong>Aula UV</strong>
            <span>Salas y horarios en un solo lugar</span>
          </div>
        </div>

        <div className="auth-panel">
          {view === 'login' && (
            <>
              <div className="auth-heading">
                <span className="eyebrow">Estudiantes y Secretaría</span>
                <h1>Iniciar sesión</h1>
                <p>Ingresa con tu correo institucional y contraseña.</p>
              </div>

              <form className="auth-form" onSubmit={handleLogin}>
                <label>
                  Correo institucional
                  <input
                    type="email"
                    name="correo"
                    required
                    autoComplete="email"
                    placeholder="correo institucional"
                  />
                </label>

                <label>
                  Contraseña
                  <input
                    type="password"
                    name="contrasena"
                    required
                    minLength={6}
                    autoComplete="current-password"
                  />
                </label>

                <div className="auth-row">
                  <label className="check">
                    <input type="checkbox" /> Recordarme
                  </label>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => changeView('recover')}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {feedback && <p className={`feedback ${kind}`}>{feedback}</p>}

                <button className="primary wide" type="submit" disabled={busy}>
                  {busy ? 'Ingresando…' : 'Ingresar'}
                </button>
              </form>

              <div className="auth-footer">
                <span>¿Eres estudiante nuevo?</span>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => changeView('register')}
                >
                  Crear cuenta
                </button>
              </div>
            </>
          )}

          {view === 'register' && (
            <>
              <div className="auth-heading">
                <span className="eyebrow">Registro de estudiante</span>
                <h1>Crear cuenta</h1>
                <p>Las cuentas de Secretaría son creadas por Administración.</p>
              </div>

              <form className="auth-form" onSubmit={handleRegister}>
                <label>
                  Nombre completo
                  <input name="nombre" required maxLength={80} autoComplete="name" />
                </label>

                <label>
                  Correo institucional
                  <input
                    type="email"
                    name="correo"
                    required
                    placeholder="nombre@alumnos.uv.cl"
                    autoComplete="email"
                  />
                </label>

                <label>
                  Generación (año de ingreso)
                  <input
                    type="number"
                    name="generacion"
                    required
                    min={2000}
                    max={2100}
                    placeholder="Ej. 2026"
                  />
                </label>

                <label>
                  Contraseña
                  <input
                    type="password"
                    name="contrasena"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </label>

                <label>
                  Repetir contraseña
                  <input
                    type="password"
                    name="confirmacion"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </label>

                {feedback && <p className={`feedback ${kind}`}>{feedback}</p>}

                <button className="primary wide" type="submit" disabled={busy}>
                  {busy ? 'Creando cuenta…' : 'Crear cuenta de estudiante'}
                </button>
              </form>

              <button
                type="button"
                className="text-button back-link"
                onClick={() => changeView('login')}
              >
                Volver al inicio de sesión
              </button>
            </>
          )}

          {view === 'recover' && (
            <>
              <div className="auth-heading">
                <span className="eyebrow">Recuperación de acceso</span>
                <h1>Recuperar contraseña</h1>
                <p>Disponible para estudiantes y Secretaría.</p>
              </div>

              <form className="auth-form" onSubmit={handleRecover}>
                <label>
                  Correo institucional
                  <input type="email" name="correo" required autoComplete="email" />
                </label>

                {feedback && <p className={`feedback ${kind}`}>{feedback}</p>}

                <button className="primary wide" type="submit" disabled={busy}>
                  {busy ? 'Enviando…' : 'Enviar solicitud'}
                </button>
              </form>

              <button
                type="button"
                className="text-button back-link"
                onClick={() => changeView('login')}
              >
                Volver al inicio de sesión
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
