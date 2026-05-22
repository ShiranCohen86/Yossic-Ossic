'use client';

import { useState } from 'react';
import { Lesson, lessonsApi } from '@/lib/api/lessons.api';
import StatusBadge from './StatusBadge';

interface Props { lessons: Lesson[]; onRefresh: () => void; showStudent?: boolean; }

export default function LessonList({ lessons, onRefresh, showStudent }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const action = async (fn: () => Promise<void>) => { setLoading('x'); try { await fn(); onRefresh(); } finally { setLoading(null); } };

  if (lessons.length === 0) return <p className="text-gray-400">אין שיעורים להצגה</p>;

  return (
    <div className="space-y-3">
      {lessons.map(lesson => (
        <div key={lesson._id} className="rounded-xl border bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <StatusBadge status={lesson.status} />
                <span className="font-medium text-sm">
                  {lesson.subject==='math'?'מתמטיקה':'פיזיקה'}{lesson.topic?` — ${lesson.topic}`:''}
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                {new Date(lesson.date).toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long'})} • {lesson.startTime}–{lesson.endTime}
              </p>
              {showStudent && lesson.student && typeof lesson.student === 'object' && (
                <p className="text-gray-400 text-xs">{lesson.student.name} ({lesson.student.email})</p>
              )}
              {lesson.notes && <p className="text-gray-500 text-xs mt-1">📝 {lesson.notes}</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {lesson.status==='pending' && showStudent && (
                <button disabled={!!loading} onClick={()=>action(()=>lessonsApi.confirm(lesson._id))}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700 disabled:opacity-50">אשר</button>
              )}
              {['pending','confirmed'].includes(lesson.status) && (
                <button disabled={!!loading} onClick={()=>action(()=>lessonsApi.cancel(lesson._id))}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50">בטל</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
