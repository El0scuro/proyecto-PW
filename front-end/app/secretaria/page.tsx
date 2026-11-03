'use client';

import RoleGuard from '@/components/RoleGuard';
import StaffDashboard from '@/components/StaffDashboard';

export default function SecretariaPage() {
  return (
    <RoleGuard role="secretaria">
      {(session) => (
        <StaffDashboard session={session} mode="secretaria" />
      )}
    </RoleGuard>
  );
}
