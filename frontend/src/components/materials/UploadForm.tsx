'use client';

import { useState, ChangeEvent } from 'react';
import { materialsApi } from '@/lib/api/materials.api';

interface Props { onSuccess: () => void; }

export default function UploadForm({ onSuccess }: Props) {
  const [form, setForm] = useState({ title:'', description:'', subject:'math', topic:'', gradeLevel:[] as number[], fileType:'pdf' as 'pdf'|'image'|'link', fileUrl:'' });
  const [file, setFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleGrade = (g: number) =>
    setForm(prev => ({ ...prev, gradeLevel: prev.gradeLevel.includes(g) ? prev.gradeLevel.filter(x=>x!==g) : [...prev.gradeLevel, g] }));

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => { if (Array.isArray(v)) v.forEach(i=>fd.append(k,String(i))); else fd.append(k,String(v)); });
      if (file) fd.append('file', file);
      await materialsApi.create(fd);
      onSuccess();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'שגיאה בהעלאה'); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-xl border bg-white p-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="block text-sm text-gray-600 mb-1">כותרת *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full rounded-lg border px-3 py-2" /></div>
        <div><label className="block text-sm text-gray-600 mb-1">מקצוע *</label><select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="w-full rounded-lg border px-3 py-2"><option value="math">מתמטיקה</option><option value="physics">פיזיקה</option></select></div>
        <div><label className="block text-sm text-gray-600 mb-1">נושא</label><input value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} placeholder="למשל: גבולות" className="w-full rounded-lg border px-3 py-2" /></div>
        <div className="sm:col-span-2"><label className="block text-sm text-gray-600 mb-1">תיאור</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className="w-full rounded-lg border px-3 py-2" /></div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-600 mb-2">כיתות מתאימות</label>
          <div className="flex flex-wrap gap-2">{[7,8,9,10,11,12].map(g=>(<label key={g} className="flex items-center gap-1.5 cursor-pointer text-sm"><input type="checkbox" checked={form.gradeLevel.includes(g)} onChange={()=>toggleGrade(g)} />כיתה {g}</label>))}</div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">סוג קובץ *</label>
          <div className="flex gap-4">{(['pdf','image','link'] as const).map(t=>(<label key={t} className="flex items-center gap-2 cursor-pointer text-sm"><input type="radio" checked={form.fileType===t} onChange={()=>setForm({...form,fileType:t})} />{t==='pdf'?'PDF':t==='image'?'תמונה':'קישור'}</label>))}</div>
        </div>
        {form.fileType==='link'?(
          <div className="sm:col-span-2"><label className="block text-sm text-gray-600 mb-1">קישור *</label><input type="url" value={form.fileUrl} onChange={e=>setForm({...form,fileUrl:e.target.value})} className="w-full rounded-lg border px-3 py-2" /></div>
        ):(
          <div className="sm:col-span-2"><label className="block text-sm text-gray-600 mb-1">קובץ *</label><input type="file" accept={form.fileType==='pdf'?'.pdf':'image/*'} onChange={(e:ChangeEvent<HTMLInputElement>)=>setFile(e.target.files?.[0]||null)} className="w-full text-sm" /></div>
        )}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button onClick={handleSubmit} disabled={loading} className="w-full rounded-lg bg-primary-700 py-2.5 text-white font-medium hover:bg-primary-800 disabled:opacity-50">{loading?'מעלה...':'העלה חומר'}</button>
    </div>
  );
}
