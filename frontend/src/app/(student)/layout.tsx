'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store';
import StudentNav from '@/components/layout/StudentNav';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!token || !user) router.replace('/login/');
    else if (user.role !== 'student') router.replace('/teacher/dashboard/');
  }, [user, token, router, mounted]);

  if (!mounted || !user || user.role !== 'student') return null;

  return (
    <div className="flex min-h-screen flex-col">
      <StudentNav />
      <main className="flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}
