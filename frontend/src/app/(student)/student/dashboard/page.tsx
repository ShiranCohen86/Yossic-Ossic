'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store';
import { lessonsApi, Lesson } from '@/lib/api/lessons.api';
import LessonList from '@/components/lessons/LessonList';

export default function StudentDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [upcoming, setUpcoming] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split('T')[0];
      const data = await lessonsApi.list({ from: today, status: 'confirmed' });
      setUpcoming(data.lessons.slice(0, 5));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-gray-500">טוען...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">שלום, {user?.name}!</h1>
        <p className="text-gray-500">כיתה {user?.gradeLevel} • {user?.subjects?.map(s=>s==='math'?'מתמטיקה':'פיזיקה').join(', ')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/student/book/" className="rounded-xl bg-primary-600 p-5 text-white hover:bg-primary-700">
          <p className="text-lg font-semibold">הזמן שיעור</p>
          <p className="text-sm opacity-80 mt-1">בחר מועד זמין וקבע שיעור</p>
        </Link>
        <Link href="/student/materials/" className="rounded-xl bg-gray-100 border p-5 hover:bg-gray-200">
          <p className="text-lg font-semibold text-gray-800">חומרי לימוד</p>
          <p className="text-sm text-gray-500 mt-1">גש לחומרים ותרגילים</p>
        </Link>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">שיעורים קרובים</h2>
        {upcoming.length===0?(
          <p className="text-gray-400">אין שיעורים קרובים. <Link href="/student/book/" className="text-primary-600 hover:underline">הזמן עכשיו</Link></p>
        ):(
          <LessonList lessons={upcoming} onRefresh={()=>window.location.reload()} />
        )}
      </section>
    </div>
  );
}
