'use client';

import { useEffect, useState } from 'react';
import { availabilityApi, AvailabilitySlot } from '@/lib/api/availability.api';
import WeekCalendar from '@/components/calendar/WeekCalendar';

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export default function SchedulePage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ dayOfWeek: 0, startTime: '16:00', endTime: '17:00' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await availabilityApi.list();
    setSlots(data.slots);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    setSaving(true);
    try { await availabilityApi.create({ ...form, isRecurring: true }); await load(); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק slot זה?')) return;
    await availabilityApi.remove(id);
    await load();
  };

  if (loading) return <div className="text-gray-500">טוען...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">ניהול לוח זמנים</h1>
      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">הוספת זמינות</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">יום</label>
            <select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })}
              className="rounded-lg border px-3 py-2">
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">שעת התחלה</label>
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">שעת סיום</label>
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="rounded-lg border px-3 py-2" />
          </div>
          <button onClick={handleAdd} disabled={saving}
            className="rounded-lg bg-primary-700 px-5 py-2 text-white hover:bg-primary-800 disabled:opacity-50">הוסף</button>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold">Slots קבועים שבועיים</h2>
        <WeekCalendar slots={slots} onDelete={handleDelete} isTeacher />
      </section>
    </div>
  );
}
