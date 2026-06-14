'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store';
import { lessonsApi, Lesson } from '@/lib/api/lessons.api';
import LessonList from '@/components/lessons/LessonList';

export default function TeacherDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [pending, setPending] = useState<Lesson[]>([]);
  const [todayLessons, setTodayLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [pendingRes, todayRes] = await Promise.all([
          lessonsApi.list({ status: 'pending' }),
          lessonsApi.list({ from: today, to: today }),
        ]);
        setPending(pendingRes.lessons);
        setTodayLessons(todayRes.lessons);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="text-gray-500">טוען...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">שלום, {user?.name}</h1>
        <p className="text-gray-500">לוח ניהול שיעורים</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-5">
          <p className="text-sm text-yellow-700 font-medium">ממתינים לאישור</p>
          <p className="mt-1 text-3xl font-bold text-yellow-800">{pending.length}</p>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-5">
          <p className="text-sm text-blue-700 font-medium">שיעורים היום</p>
          <p className="mt-1 text-3xl font-bold text-blue-800">{todayLessons.length}</p>
        </div>
      </div>
      {pending.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">ממתינים לאישור</h2>
          <LessonList lessons={pending} onRefresh={() => window.location.reload()} showStudent />
        </section>
      )}
      <section>
        <h2 className="mb-3 text-lg font-semibold">שיעורים היום</h2>
        {todayLessons.length === 0 ? (
          <p className="text-gray-400">אין שיעורים היום</p>
        ) : (
          <LessonList lessons={todayLessons} onRefresh={() => window.location.reload()} showStudent />
        )}
      </section>
    </div>
  );
}
