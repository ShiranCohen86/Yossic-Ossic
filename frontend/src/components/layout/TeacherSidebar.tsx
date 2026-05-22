'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { clearCredentials } from '@/lib/store/slices/authSlice';

const NAV = [
  { href: '/teacher/dashboard/', label: 'ראשי', icon: '🏠' },
  { href: '/teacher/schedule/', label: 'לוח זמנים', icon: '📅' },
  { href: '/teacher/students/', label: 'תלמידים', icon: '👥' },
  { href: '/teacher/materials/', label: 'חומרי לימוד', icon: '📚' },
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => { dispatch(clearCredentials()); router.push('/login/'); };

  return (
    <aside className="w-60 flex-shrink-0 bg-primary-800 text-white flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-primary-700">
        <p className="font-bold text-lg">שיעורים פרטיים</p>
        <p className="text-xs text-primary-200 mt-0.5">{user?.name}</p>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-3">
        {NAV.map(item=>(
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              pathname.startsWith(item.href.replace(/\/$/, ''))?'bg-primary-700 font-medium':'hover:bg-primary-700/50'
            }`}>
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
      </nav>
      <button onClick={handleLogout} className="mx-3 mb-4 rounded-lg px-3 py-2.5 text-sm text-primary-200 hover:text-white hover:bg-primary-700/50 text-right">יציאה ↩</button>
    </aside>
  );
}
