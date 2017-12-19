self.addEventListener('install', function(event){
    console.log('[SW] 安裝(Install) Service Worker!',event);
});

self.addEventListener('activate', function(event){
    console.log('[SW] 觸發(Activate) Service Worker!',event);
    return self.clients.claim();
});

self.addEventListener('fetch', function(event){
    console.log('[SW] 抓資料(Fetch)!',event);
    event.respondWith(fetch(event.request));
});