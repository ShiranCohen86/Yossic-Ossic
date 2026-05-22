'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) router.replace('/login/');
    else if (user.role === 'teacher') router.replace('/teacher/dashboard/');
    else router.replace('/student/dashboard/');
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-gray-500">טוען...</div>
    </div>
  );
}
