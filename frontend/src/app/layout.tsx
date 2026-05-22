'use client';

import './globals.css';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import Toast from '@/components/ui/Toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <title>שיעורים פרטיים — מתמטיקה ופיזיקה</title>
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Provider store={store}>
          {children}
          <Toast />
        </Provider>
      </body>
    </html>
  );
}
