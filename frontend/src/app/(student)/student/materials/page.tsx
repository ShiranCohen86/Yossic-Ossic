'use client';

import { useEffect, useState } from 'react';
import { materialsApi, Material } from '@/lib/api/materials.api';
import MaterialCard from '@/components/materials/MaterialCard';
import SubjectFilter from '@/components/materials/SubjectFilter';

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: '', q: '' });

  useEffect(() => {
    const load = async () => { setLoading(true); const data = await materialsApi.list(filters); setMaterials(data.materials); setLoading(false); };
    load();
  }, [filters]);

  if (loading) return <div className="text-gray-500">טוען...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">חומרי לימוד</h1>
      <SubjectFilter value={filters} onChange={setFilters} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map(m=><MaterialCard key={m._id} material={m} />)}
        {materials.length===0&&<p className="col-span-3 text-gray-400">לא נמצאו חומרים</p>}
      </div>
    </div>
  );
}
