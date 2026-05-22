'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store';
import TeacherSidebar from '@/components/layout/TeacherSidebar';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) router.replace('/login/');
    else if (user.role !== 'teacher') router.replace('/student/dashboard/');
  }, [user, token, router]);

  if (!user || user.role !== 'teacher') return null;

  return (
    <div className="flex min-h-screen">
      <TeacherSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
