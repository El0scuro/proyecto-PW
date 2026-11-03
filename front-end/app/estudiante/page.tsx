'use client';

import RoleGuard from '@/components/RoleGuard';
import StudentDashboard from '@/components/StudentDashboard';

export default function EstudiantePage() {
  return (
    <RoleGuard role="estudiante">
      {(session) => <StudentDashboard session={session} />}
    </RoleGuard>
  );
}
