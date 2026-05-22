'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/store';
import { clearCredentials } from '@/lib/store/slices/authSlice';

const NAV = [
  { href: '/student/dashboard/', label: 'ראשי' },
  { href: '/student/book/', label: 'הזמן שיעור' },
  { href: '/student/lessons/', label: 'השיעורים שלי' },
  { href: '/student/materials/', label: 'חומרי לימוד' },
];

export default function StudentNav() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = () => { dispatch(clearCredentials()); router.push('/login/'); };

  return (
    <header className="bg-primary-800 text-white">
      <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-3">
        <p className="font-bold">שיעורים פרטיים</p>
        <nav className="flex items-center gap-1">
          {NAV.map(item=>(
            <Link key={item.href} href={item.href}
              className={`rounded-lg px-3 py-1.5 text-sm ${pathname.startsWith(item.href.replace(/\/$/, ''))?'bg-primary-700 font-medium':'hover:bg-primary-700/50'}`}>
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="mr-2 text-sm text-primary-200 hover:text-white">יציאה</button>
        </nav>
      </div>
    </header>
  );
}
