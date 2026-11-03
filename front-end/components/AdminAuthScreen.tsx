'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { loginAdmin } from '@/lib/auth';

export default function AdminAuthScreen() {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback('');

    const form = new FormData(event.currentTarget);
    const result = await loginAdmin(
      String(form.get('correo') ?? '').trim(),
      String(form.get('contrasena') ?? ''),
    );

    setBusy(false);

    if (!result.ok) {
      setFeedback(result.message);
      return;
    }

    router.push('/administrador');
  }

  return (
    <main className="auth-page admin-auth-page">
      <section className="admin-auth-card">
        <div className="admin-auth-brand">
          <Image
            src="/logo-uv.png"
            alt="Universidad de Valparaíso"
            width={220}
            height={120}
            priority
          />
        </div>

        <div className="auth-heading">
          <span className="eyebrow">Acceso interno</span>
          <h1>Administración</h1>
          <p>Acceso exclusivo para la cuenta administradora del sistema.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            Correo institucional
            <input type="email" name="correo" required autoComplete="email" />
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

          {feedback && <p className="feedback error">{feedback}</p>}

          <button className="primary wide" type="submit" disabled={busy}>
            {busy ? 'Ingresando…' : 'Ingresar a Administración'}
          </button>
        </form>
      </section>
    </main>
  );
}
