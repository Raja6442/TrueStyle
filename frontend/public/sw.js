// Minimal Service Worker for PWA "Add to Home Screen" support
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('fetch', (event) => {
  // This is required for the "installable" criteria
  event.respondWith(fetch(event.request));
});
