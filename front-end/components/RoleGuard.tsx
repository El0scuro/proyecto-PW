'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getSession } from '@/lib/auth';
import type { Role, Session } from '@/lib/types';

type RoleGuardProps = {
  role: Role;
  children: (session: Session) => ReactNode;
};

export default function RoleGuard({ role, children }: RoleGuardProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const current = getSession();

    if (!current || current.rol !== role) {
      router.replace('/');
      return;
    }

    setSession(current);
  }, [role, router]);

  if (!session) {
    return <main className="loading-page">Cargando Aula UV…</main>;
  }

  return <>{children(session)}</>;
}
