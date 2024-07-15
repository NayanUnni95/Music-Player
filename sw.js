const data = [
  "./index.html",
  "./style.css",
  "./script.js",
  "./images/icons/music-player16x16.png",
  "./images/icons/music-player24x24.png",
  "./images/icons/music-player32x32.png",
  "./images/icons/music-player64x64.png",
  "./images/icons/music-player128x128.png",
  "./images/icons/music-player256x256.png",
  "./images/icons/music-player512x512.png",
];
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll(data);
    })
  );
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
