const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /\/api\/availability\/open-slots/,
        handler: 'NetworkFirst',
        options: { cacheName: 'open-slots', expiration: { maxAgeSeconds: 300 } },
      },
      {
        urlPattern: /\/api\/materials/,
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'materials', expiration: { maxAgeSeconds: 86400 } },
      },
      {
        urlPattern: /^https:\/\/res\.cloudinary\.com/,
        handler: 'CacheFirst',
        options: { cacheName: 'cloudinary', expiration: { maxAgeSeconds: 604800 } },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = withPWA(nextConfig);
