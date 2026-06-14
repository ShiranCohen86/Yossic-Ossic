'use client';

import { useEffect, useState } from 'react';
import { availabilityApi, OpenSlot } from '@/lib/api/availability.api';
import BookingModal from '@/components/lessons/BookingModal';

export default function BookPage() {
  const [slots, setSlots] = useState<OpenSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OpenSlot | null>(null);

  const load = async () => { const data = await availabilityApi.getOpenSlots(); setSlots(data.slots); setLoading(false); };
  useEffect(() => { load(); }, []);

  const grouped = slots.reduce((acc, slot) => {
    const date = new Date(slot.date).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, OpenSlot[]>);

  if (loading) return <div className="text-gray-500">טוען זמינות...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">הזמן שיעור</h1>
      {Object.keys(grouped).length===0?(
        <p className="text-gray-400">אין זמינות ב-4 השבועות הקרובים</p>
      ):(
        Object.entries(grouped).map(([date, daySlots]) => (
          <div key={date} className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 font-semibold text-gray-700">{date}</h2>
            <div className="flex flex-wrap gap-2">
              {daySlots.map((slot, i) => (
                <button key={i} onClick={() => setSelected(slot)}
                  className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm text-primary-700 hover:bg-primary-100">
                  {slot.startTime}–{slot.endTime}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
      {selected && <BookingModal slot={selected} onClose={() => setSelected(null)} onSuccess={() => { setSelected(null); load(); }} />}
    </div>
  );
}
