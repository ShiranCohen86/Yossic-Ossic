'use client';

import { AvailabilitySlot } from '@/lib/api/availability.api';

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

interface Props { slots: AvailabilitySlot[]; onDelete?: (id: string) => void; isTeacher?: boolean; }

export default function WeekCalendar({ slots, onDelete, isTeacher }: Props) {
  const byDay = DAYS.map((day, i) => ({ day, index: i, slots: slots.filter(s => s.isRecurring && s.dayOfWeek === i) }));

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden text-sm">
      {byDay.map(({ day, index, slots: daySlots }) => (
        <div key={index} className="bg-white min-h-[120px]">
          <div className="bg-gray-50 px-2 py-1.5 font-medium text-gray-600 text-xs text-center border-b">{day}</div>
          <div className="p-1.5 space-y-1">
            {daySlots.map(slot => (
              <div key={slot._id} className="rounded bg-primary-50 border border-primary-100 px-1.5 py-1 text-xs text-primary-700 flex items-center justify-between gap-1">
                <span>{slot.startTime}–{slot.endTime}</span>
                {isTeacher && onDelete && (
                  <button onClick={() => onDelete(slot._id)} className="text-red-400 hover:text-red-600 text-xs" title="מחק">×</button>
                )}
              </div>
            ))}
            {daySlots.length === 0 && <p className="text-gray-300 text-xs text-center pt-2">—</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
