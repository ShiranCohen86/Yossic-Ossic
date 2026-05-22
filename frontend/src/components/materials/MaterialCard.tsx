'use client';

import { Material } from '@/lib/api/materials.api';

const TYPE_ICON: Record<string,string> = { pdf: '📄', image: '🖼️', link: '🔗' };
const SUBJECT_LABEL: Record<string,string> = { math: 'מתמטיקה', physics: 'פיזיקה' };

interface Props { material: Material; onDelete?: (id: string) => void; canDelete?: boolean; }

export default function MaterialCard({ material, onDelete, canDelete }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <span className="text-xl">{TYPE_ICON[material.fileType]||'📁'}</span>
          <div>
            <p className="font-medium leading-tight">{material.title}</p>
            {material.description && <p className="text-xs text-gray-500 mt-0.5">{material.description}</p>}
          </div>
        </div>
        {canDelete && onDelete && (
          <button onClick={()=>onDelete(material._id)} className="text-red-400 hover:text-red-600 text-xs">🗑️</button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5">{SUBJECT_LABEL[material.subject]}</span>
        {material.topic && <span className="rounded-full bg-gray-100 text-gray-600 px-2 py-0.5">{material.topic}</span>}
        {material.gradeLevel?.map(g=>(<span key={g} className="rounded-full bg-gray-100 text-gray-500 px-2 py-0.5">כיתה {g}</span>))}
      </div>
      {material.fileUrl && (
        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
          {material.fileType==='link'?'פתח קישור →':'הורד / צפה →'}
        </a>
      )}
    </div>
  );
}
