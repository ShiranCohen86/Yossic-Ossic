'use client';

import { useEffect, useState } from 'react';
import { authApi, User } from '@/lib/api/auth.api';

export default function StudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', gradeLevel: 10, subjects: ['math'] as string[], phone: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => { const data = await authApi.listStudents(); setStudents(data.students); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setSaving(true);
    try { await authApi.registerStudent(form); setShowForm(false); setForm({ name: '', email: '', password: '', gradeLevel: 10, subjects: ['math'], phone: '' }); await load(); }
    finally { setSaving(false); }
  };

  const toggleSubject = (s: string) =>
    setForm(prev => ({ ...prev, subjects: prev.subjects.includes(s) ? prev.subjects.filter(x => x !== s) : [...prev.subjects, s] }));

  if (loading) return <div className="text-gray-500">טוען...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">תלמידים ({students.length})</h1>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-primary-700 px-4 py-2 text-white hover:bg-primary-800">+ הוסף תלמיד</button>
      </div>
      {showForm && (
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold text-lg">תלמיד חדש</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="block text-sm text-gray-600 mb-1">שם מלא</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-lg border px-3 py-2" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">אימייל</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-lg border px-3 py-2" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">סיסמא</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full rounded-lg border px-3 py-2" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">כיתה</label><select value={form.gradeLevel} onChange={e => setForm({...form, gradeLevel: Number(e.target.value)})} className="w-full rounded-lg border px-3 py-2">{[7,8,9,10,11,12].map(g=><option key={g} value={g}>כיתה {g}</option>)}</select></div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">מקצועות</label>
            <div className="flex gap-3">
              {['math','physics'].map(s=>(<label key={s} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.subjects.includes(s)} onChange={()=>toggleSubject(s)} />{s==='math'?'מתמטיקה':'פיזיקה'}</label>))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={saving} className="rounded-lg bg-primary-700 px-5 py-2 text-white disabled:opacity-50">{saving?'שומר...':'צור תלמיד'}</button>
            <button onClick={()=>setShowForm(false)} className="rounded-lg border px-5 py-2">ביטול</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {students.map(s=>(
          <div key={s._id} className="flex items-center justify-between rounded-xl border bg-white p-4">
            <div><p className="font-medium">{s.name}</p><p className="text-sm text-gray-500">{s.email} • כיתה {s.gradeLevel}</p><p className="text-sm text-gray-400">{s.subjects?.map(sub=>sub==='math'?'מתמטיקה':'פיזיקה').join(', ')}</p></div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.isActive?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{s.isActive?'פעיל':'לא פעיל'}</span>
          </div>
        ))}
        {students.length===0&&<p className="text-gray-400">אין תלמידים עדיין</p>}
      </div>
    </div>
  );
}
