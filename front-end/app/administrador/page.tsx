'use client';

import RoleGuard from '@/components/RoleGuard';
import StaffDashboard from '@/components/StaffDashboard';

export default function AdministradorPage() {
  return (
    <RoleGuard role="administrador">
      {(session) => (
        <StaffDashboard session={session} mode="administrador" />
      )}
    </RoleGuard>
  );
}
