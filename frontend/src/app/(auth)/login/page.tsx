'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/store';
import { setCredentials } from '@/lib/store/slices/authSlice';
import { authApi } from '@/lib/api/auth.api';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      dispatch(setCredentials(data));
      router.push(data.user.role === 'teacher' ? '/teacher/dashboard/' : '/student/dashboard/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'שגיאה בכניסה למערכת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-800 to-primary-600 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary-800">שיעורים פרטיים</h1>
          <p className="mt-1 text-sm text-gray-500">מתמטיקה ופיזיקה</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">אימייל</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">סיסמא</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200" />
          </div>
          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary-700 py-2.5 text-white font-medium hover:bg-primary-800 disabled:opacity-50 transition-colors">
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  );
}
