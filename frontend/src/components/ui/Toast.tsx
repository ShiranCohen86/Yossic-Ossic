'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { removeToast } from '@/lib/store/slices/uiSlice';

export default function Toast() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(state => state.ui.toasts);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => dispatch(removeToast(toasts[0].id)), 3500);
    return () => clearTimeout(timer);
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      {toasts.map(t=>(
        <div key={t.id} className={`rounded-xl px-4 py-3 text-white text-sm shadow-lg max-w-xs ${
          t.type==='error'?'bg-red-600':t.type==='success'?'bg-green-600':'bg-gray-800'
        }`}>{t.message}</div>
      ))}
    </div>
  );
}
