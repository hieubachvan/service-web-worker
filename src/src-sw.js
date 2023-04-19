/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

clientsClaim();
//cho phép sw can thiệp ngay lập tức và sử lý ngay lập tức , thay vì chờ đợi cho Service Worker của trang web trước được giải phóng.

self.skipWaiting();

// clientsClaim() và self.skipWaiting() là hai phương thức trong service worker để đảm bảo rằng service worker sẽ nhanh chóng trở thành
//worker chính trong quá trình cập nhật và hoạt động ngay lập tức khi được cài đặt.

precacheAndRoute(self.__WB_MANIFEST);

// precacheAndRoute(self.__WB_MANIFEST) được sử dụng để tải trước và lưu trữ tất cả các tài nguyên đã được khai báo trong tệp manifest của service worker.

// registerRoute(
//   ({url}) => url.origin === 'https://fonts.googleapis.com',
//   new StaleWhileRevalidate({
//     cacheName: 'google-fonts-stylesheets',
//   })
// );

// registerRoute(
//   ({url}) => url.origin === 'https://fonts.gstatic.com',
//   new CacheFirst({
//     cacheName: 'google-fonts-webfonts',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new ExpirationPlugin({
//         maxAgeSeconds: 60 * 60 * 24 * 365,
//         maxEntries: 30,
//       }),
//     ],
//   })
// );

/**
 * Move api.
 *
 * Caches at: runtime
 */
registerRoute(
  ({ url }) =>
    url.origin === "https://api.themoviedb.org" &&
    url.pathname.startsWith("/3/discover/tv"),
  new StaleWhileRevalidate({
    cacheName: "movie-api-response",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({ maxEntries: 1 }), // Will cache maximum 1 requests.
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30,
      }),
    ],
  })
);

// registerRoute(
//   ({request}) => request.destination === 'script' ||
//     request.destination === 'style',
//   new StaleWhileRevalidate({
//     cacheName: 'static-resources',
//   })
// );
