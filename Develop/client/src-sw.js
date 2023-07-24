import { CacheFirst } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, 
    }),
  ],
});

const urlsToWarmUp = ['/index.html', '/'];
urlsToWarmUp.forEach((url) => {
  pageCache.handle({ request: url });
});

registerRoute(
  ({ request }) => request.mode === 'navigate',
  ({ event }) => {
    return pageCache.handle({ request: event.request });
  }
);

registerRoute(
  /\.(png|jpg|jpeg|svg|gif)$/,
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, 
      }),
    ],
  })
);
