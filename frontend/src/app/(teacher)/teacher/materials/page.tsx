'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { materialsApi, Material } from '@/lib/api/materials.api';
import MaterialCard from '@/components/materials/MaterialCard';
import SubjectFilter from '@/components/materials/SubjectFilter';

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: '', q: '' });

  const load = async () => { const data = await materialsApi.list(filters); setMaterials(data.materials); setLoading(false); };
  useEffect(() => { load(); }, [filters]);

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק חומר זה?')) return;
    await materialsApi.remove(id); await load();
  };

  if (loading) return <div className="text-gray-500">טוען...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">חומרי לימוד</h1>
        <Link href="/teacher/materials/upload/" className="rounded-lg bg-primary-700 px-4 py-2 text-white hover:bg-primary-800">+ העלה חומר</Link>
      </div>
      <SubjectFilter value={filters} onChange={setFilters} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map(m=><MaterialCard key={m._id} material={m} onDelete={handleDelete} canDelete />)}
        {materials.length===0&&<p className="col-span-3 text-gray-400">אין חומרים עדיין</p>}
      </div>
    </div>
  );
}
