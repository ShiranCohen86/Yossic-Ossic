'use client';

import { useState } from 'react';
import { OpenSlot } from '@/lib/api/availability.api';
import { lessonsApi } from '@/lib/api/lessons.api';

interface Props { slot: OpenSlot; onClose: () => void; onSuccess: () => void; }

export default function BookingModal({ slot, onClose, onSuccess }: Props) {
  const [subject, setSubject] = useState<'math'|'physics'>('math');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try { await lessonsApi.book({ date: slot.date, startTime: slot.startTime, endTime: slot.endTime, subject, topic }); onSuccess(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'שגיאה בהזמנת השיעור'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={e=>e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">הזמנת שיעור</h2>
        <div className="mb-4 rounded-lg bg-primary-50 p-3 text-sm text-primary-700">
          <p>{new Date(slot.date).toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long'})}</p>
          <p className="font-medium">{slot.startTime}–{slot.endTime}</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">מקצוע</label>
            <div className="flex gap-3">
              {(['math','physics'] as const).map(s=>(
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={subject===s} onChange={()=>setSubject(s)} />
                  {s==='math'?'מתמטיקה':'פיזיקה'}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">נושא (אופציונלי)</label>
            <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="למשל: אינטגרלים..."
              className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 rounded-lg bg-primary-700 py-2 text-white text-sm font-medium hover:bg-primary-800 disabled:opacity-50">
            {loading?'שולח...':'הזמן שיעור'}
          </button>
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">ביטול</button>
        </div>
      </div>
    </div>
  );
}
