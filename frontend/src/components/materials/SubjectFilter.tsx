'use client';

interface Filters { subject: string; q: string; }

export default function SubjectFilter({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex gap-2">
        {[{v:'',l:'הכל'},{v:'math',l:'מתמטיקה'},{v:'physics',l:'פיזיקה'}].map(opt=>(
          <button key={opt.v} onClick={()=>onChange({...value,subject:opt.v})}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              value.subject===opt.v?'bg-primary-700 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{opt.l}</button>
        ))}
      </div>
      <input value={value.q} onChange={e=>onChange({...value,q:e.target.value})} placeholder="חיפוש חומרים..."
        className="rounded-lg border px-3 py-1.5 text-sm flex-1 min-w-[150px]" />
    </div>
  );
}
