'use client';

import { useEffect, useState } from 'react';
import { lessonsApi, Lesson } from '@/lib/api/lessons.api';
import LessonList from '@/components/lessons/LessonList';

const STATUS_OPTIONS = [
  { value: '', label: 'הכל' }, { value: 'pending', label: 'ממתין' },
  { value: 'confirmed', label: 'מאושר' }, { value: 'completed', label: 'הושלם' },
  { value: 'cancelled', label: 'בוטל' },
];

export default function StudentLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const load = async () => { setLoading(true); const data = await lessonsApi.list({ status }); setLessons(data.lessons); setLoading(false); };
  useEffect(() => { load(); }, [status]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">השיעורים שלי</h1>
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map(opt=>(
          <button key={opt.value} onClick={()=>setStatus(opt.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${status===opt.value?'bg-primary-700 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {opt.label}
          </button>
        ))}
      </div>
      {loading?<div className="text-gray-500">טוען...</div>:<LessonList lessons={lessons} onRefresh={load} />}
    </div>
  );
}
