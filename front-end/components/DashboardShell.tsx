'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { logout } from '@/lib/auth';
import type { Role, Session } from '@/lib/types';

type NavItem = {
  id: string;
  label: string;
};

const roleLabels: Record<Role, string> = {
  estudiante: 'Estudiante',
  secretaria: 'Secretaría',
  administrador: 'Administración',
};

type DashboardShellProps = {
  session: Session;
  nav: NavItem[];
  active: string;
  onNavigate: (id: string) => void;
  children: ReactNode;
};

export default function DashboardShell({
  session,
  nav,
  active,
  onNavigate,
  children,
}: DashboardShellProps) {
  const router = useRouter();

  function closeSession() {
    logout();
    router.replace('/');
  }

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div className="brand">
          <Image
            src="/logo-uv.png"
            alt="Universidad de Valparaíso"
            width={156}
            height={74}
          />
          <span className="brand-line" />
          <div>
            <strong>Aula UV</strong>
            <small>Gestión de salas y horarios</small>
          </div>
        </div>

        <div className="user-box">
          <div>
            <strong>{session.nombre}</strong>
            <small>
              {roleLabels[session.rol]}
              {session.generacion ? ` · Generación ${session.generacion}` : ''}
            </small>
          </div>
          <button className="secondary" onClick={closeSession}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <span className="menu-label">Menú principal</span>
          <nav>
            {nav.map((item) => (
              <button
                key={item.id}
                className={active === item.id ? 'active' : ''}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="system-card">
            <span>Estado del sistema</span>
            <strong>Frontend listo</strong>
            <small>Backend pendiente de integración</small>
          </div>
        </aside>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
