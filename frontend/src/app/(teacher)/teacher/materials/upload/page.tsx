'use client';

import { useRouter } from 'next/navigation';
import UploadForm from '@/components/materials/UploadForm';

export default function UploadPage() {
  const router = useRouter();
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-primary-600 hover:underline text-sm">← חזרה</button>
        <h1 className="text-2xl font-bold">העלאת חומר לימוד</h1>
      </div>
      <UploadForm onSuccess={() => router.push('/teacher/materials/')} />
    </div>
  );
}
